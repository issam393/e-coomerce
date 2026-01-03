package com.ecommerce.controller;

import java.io.IOException;
import java.io.PrintWriter;

import com.ecommerce.dao.UserDAO;
import com.ecommerce.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
@WebServlet("/resend-code")
public class ResendCode extends HttpServlet {
    private UserDAO userDAO;

    @Override
    public void init() {
        userDAO = new UserDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // ✅ 1. Set response to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // ✅ 2. Retrieve Session
        HttpSession session = request.getSession(false);
        if (session == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false, \"message\":\"Session expirée. Veuillez vous réinscrire.\"}");
            out.flush();
            return;
        }

        // ✅ 3. Retrieve Temporary User (Stored by SignupServlet)
        User tempUser = (User) session.getAttribute("verificationUser");

        if (tempUser == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false, \"message\":\"Aucune inscription en cours trouvée.\"}");
            out.flush();
            return;
        }

        try {
            // ✅ 4. Generate New Verification Code
            String newCode = sendVerificationEmail.generateVerificationCode();

            // ✅ 5. Update Code in Database
            userDAO.updateVerificationCode(tempUser.getEmail(), newCode);

            // ✅ 6. Send Code via Email (Assuming EmailUtil is a utility class for sending emails)
            boolean emailSent = sendVerificationEmail.sendEmail(
                    tempUser.getEmail(),
                    "Code de vérification - URBANE",
                    "Bienvenue chez URBANE !\n\nVotre code de vérification est : " + newCode
            );
            if (!emailSent) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"success\":false, \"message\":\"Échec de l'envoi de l'email.\"}");
                out.flush();
                return;
            }
            out.print("{\"success\":true, \"message\":\"Nouveau code de vérification envoyé.\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\":false, \"message\":\"Erreur lors de la réexpédition du code.\"}");
        }
        out.flush();
    }
}

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

@WebServlet("/resend")
public class ResendCodeServlet extends HttpServlet {

    private UserDAO userDAO;

    @Override
    public void init() {
        userDAO = new UserDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json; charset=UTF-8");
        PrintWriter out = response.getWriter();

        // 1. Get Email
        // Is this formdataurlencoded ?
        String email = request.getParameter("email");
        System.out.println("Resend code requested for email: " + email);
        if (email == null || email.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false, \"message\":\"Email requis.\"}");
            return;
        }

        try {
            // 2. Find User
            User user = userDAO.findByEmail(email);

            if (user == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"success\":false, \"message\":\"Utilisateur introuvable.\"}");
                return;
            }

            if (user.isVerified()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\":false, \"message\":\"Ce compte est déjà vérifié.\"}");
                return;
            }

            // 3. Generate New Code
            String newCode = sendVerificationEmail.generateVerificationCode();
            user.setVerificationCode(newCode);

            // 4. Update Database
            userDAO.updateUser(user);

            // 5. Send Email
            boolean emailSent = sendVerificationEmail.sendEmail(
                user.getEmail(), 
                "Nouveau code de vérification", 
                "Votre nouveau code est : " + newCode
            );

            if (emailSent) {
                out.print("{\"success\":true, \"message\":\"Nouveau code envoyé.\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"success\":false, \"message\":\"Erreur lors de l'envoi de l'email.\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\":false, \"message\":\"Erreur serveur.\"}");
        }
    }
}
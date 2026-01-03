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

/**
 * Servlet pour gérer la vérification du compte utilisateur (API JSON)
 */
@WebServlet("/verify")
public class VerificationServlet extends HttpServlet {

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

        // ✅ 2. Get the code sent by React
        String inputCode = request.getParameter("verificationCode");

        // ✅ 3. Retrieve Session
        HttpSession session = request.getSession(false);
        if (session == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false, \"message\":\"Session expirée. Veuillez vous réinscrire.\"}");
            out.flush();
            return;
        }

        // ✅ 4. Retrieve Temporary User (Stored by SignupServlet)
        User tempUser = (User) session.getAttribute("verificationUser");

        if (tempUser == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false, \"message\":\"Aucune inscription en cours trouvée.\"}");
            out.flush();
            return;
        }

        if (inputCode == null || inputCode.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false, \"message\":\"Le code de vérification est manquant.\"}");
            out.flush();
            return;
        }

        // ✅ 5. Verify Code
        if (tempUser.getVerificationCode().equals(inputCode)) {

            try {
                // Update User Status
                tempUser.setVerified(true);
                tempUser.setStatus("ACTIVE");

                // ✅ 6. Save User to Database
                userDAO.saveUser(tempUser);

                // ✅ 7. Clean up Session (Remove temp user)
                session.removeAttribute("verificationUser");

                // ✅ 8. Return Success JSON
                // Note: We do NOT log them in here. They must go to /login to get a JWT.
                out.print("{\"success\":true, \"message\":\"Compte vérifié avec succès !\"}");
                out.flush();

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"success\":false, \"message\":\"Erreur base de données lors de la validation.\"}");
                e.printStackTrace();
            }

        } else {
            // ❌ Code Incorrect
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
            out.print("{\"success\":false, \"message\":\"Code de vérification incorrect.\"}");
            out.flush();
        }
    }
}
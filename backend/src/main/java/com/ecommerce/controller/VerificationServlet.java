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
    public void init() { userDAO = new UserDAO(); }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {

        response.setContentType("application/json; charset=UTF-8");
        PrintWriter out = response.getWriter();

        // ✅ REQUIRE BOTH EMAIL AND CODE
        String email = request.getParameter("email");
        String inputCode = request.getParameter("verificationCode");

        if (email == null || inputCode == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false, \"message\":\"Email et Code requis.\"}");
            return;
        }

        try {
            // ✅ 1. Find User by Email from DB
            User user = userDAO.findByEmail(email);

            if (user == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\":false, \"message\":\"Utilisateur introuvable.\"}");
                return;
            }

            // ✅ 2. Check if already verified
            if (user.isVerified()) {
                out.print("{\"success\":true, \"message\":\"Compte déjà vérifié.\"}");
                return;
            }

            // ✅ 3. Validate Code
            if (user.getVerificationCode().equals(inputCode)) {
                
                user.setVerified(true);
                user.setStatus("ACTIVE");
                user.setVerificationCode(null); // Clear the code for security
                
                // Update DB
                userDAO.updateUser(user); // You need an 'update' method in DAO

                out.print("{\"success\":true, \"message\":\"Compte vérifié !\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\":false, \"message\":\"Code incorrect.\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\":false, \"message\":\"Erreur serveur.\"}");
        }
    }
}
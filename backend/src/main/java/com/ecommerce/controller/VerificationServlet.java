package com.ecommerce.controller;

import java.io.IOException;

import com.ecommerce.dao.UserDAO;
import com.ecommerce.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * Servlet pour gérer la vérification du compte utilisateur
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

        // ✅ Code saisi par l'utilisateur
        String inputCode = request.getParameter("verificationCode");

        HttpSession session = request.getSession(false); // ✅ éviter créer une session inutile
        if (session == null) {
            response.sendRedirect("signup.jsp");
            return;
        }

        // ✅ Utilisateur temporaire stocké après signup
        User tempUser = (User) session.getAttribute("verificationUser"); // 🔁 NOM CORRIGÉ

        if (tempUser == null || inputCode == null || inputCode.isEmpty()) {
            response.sendRedirect("VerificationCode/VerificationPage.jsp?error=invalid");
            return;
        }

        System.out.println("Code entré : " + inputCode);
        System.out.println("Code attendu : " + tempUser.getVerificationCode());

        // ✅ Vérification du code
        if (tempUser.getVerificationCode().equals(inputCode)) {

            tempUser.setVerified(true);              // ✅ compte vérifié
            tempUser.setStatus("ACTIVE");            // ✅ activation du compte

            try {
                // ✅ Sauvegarde définitive en base
                userDAO.saveUser(tempUser);

                // ✅ Création de la session utilisateur finale
                session.setAttribute("email", tempUser.getEmail());
                session.setAttribute("role", tempUser.getRole());

                // ✅ Nettoyage de la session temporaire
                session.removeAttribute("verificationUser");

                response.sendRedirect("LandingPage.jsp");

            } catch (Exception e) {
                throw new ServletException("Erreur lors de la vérification du compte", e);
            }

        } else {
            // ❌ Code incorrect
            response.sendRedirect("VerificationCode/VerificationPage.jsp?error=code");
        }
    }
}

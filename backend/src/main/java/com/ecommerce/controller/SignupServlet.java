package com.ecommerce.controller;

import java.io.IOException;

import org.springframework.security.crypto.bcrypt.BCrypt;

import com.ecommerce.dao.UserDAO;
import com.ecommerce.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * Servlet pour gérer l'inscription des utilisateurs
 */
@WebServlet("/signup")
public class SignupServlet extends HttpServlet {

    private UserDAO userDAO;


    @Override
    public void init() {
        userDAO = new UserDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // ✅ Récupération des données du formulaire
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String phone = request.getParameter("phone");        // ✅ ajout phone
        String address = request.getParameter("address");    // ✅ ajout address

        // ✅ Vérifier si l'utilisateur existe déjà
        if (userDAO.userExists(email)) {
            response.getWriter().println("Cet email est déjà utilisé !");
            return;
        }

        // ✅ Hash du mot de passe
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

        // ✅ Utilisation du NOUVEAU constructeur
        User user = new User(
                name,
                email,
                hashedPassword,
                phone,          // ✅ phone passé au constructeur
                address,        // ✅ address passé au constructeur
                "USER"          // ✅ rôle par défaut
        );

        // ✅ Génération du code de vérification
        String code = sendVerificationEmail.generateVerificationCode();
        user.setVerificationCode(code);     // code email
        user.setVerified(false);             // non vérifié par défaut
        user.setStatus("PENDING");           // status initial

        // ✅ Envoi de l’email
        sendVerificationEmail.sendEmail(
                email,
                "Code de vérification",
                "Votre code est : " + code
        );

        // ✅ Stocker l'utilisateur temporairement en session
        HttpSession verifySession = request.getSession();
        verifySession.setAttribute("verificationUser", user);

        // ✅ Redirection vers la page de vérification
        response.sendRedirect("verificationCode/VerificationPage.jsp?email=" + email);
    }
}

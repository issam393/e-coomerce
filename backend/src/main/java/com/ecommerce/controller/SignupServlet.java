package com.ecommerce.controller;

import java.io.IOException;
import java.io.PrintWriter;

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
 * Servlet pour gérer l'inscription des utilisateurs (API JSON)
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

        // ✅ 1. Set response to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // ✅ 2. Retrieve form data
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String phone = request.getParameter("phone");
        String address = request.getParameter("address");

        // Basic validation
        if (email == null || password == null || name == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false, \"message\":\"Tous les champs sont obligatoires.\"}");
            out.flush();
            return;
        }

        // ✅ 3. Check if user already exists
        if (userDAO.userExists(email)) {
            response.setStatus(HttpServletResponse.SC_CONFLICT); // 409 Conflict
            out.print("{\"success\":false, \"message\":\"Cet email est déjà utilisé !\"}");
            out.flush();
            return;
        }

        try {
            // ✅ 4. Hash password
            String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

            // ✅ 5. Create User Object
            User user = new User(
                    name,
                    email,
                    hashedPassword,
                    phone,
                    address,
                    "USER" // Default role
            );

            // ✅ 6. Generate Verification Code
            String code = sendVerificationEmail.generateVerificationCode();
            user.setVerificationCode(code);
            user.setVerified(false);
            user.setStatus("PENDING");

            // ✅ 7. Send Email
            boolean emailSent = sendVerificationEmail.sendEmail(
                    email,
                    "Code de vérification - URBANE",
                    "Bienvenue chez URBANE !\n\nVotre code de vérification est : " + code
            );

            if (!emailSent) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"success\":false, \"message\":\"Erreur lors de l'envoi de l'email. Veuillez réessayer.\"}");
                out.flush();
                return;
            }

            // ✅ 8. Store temporary user in Session
            // VerificationServlet will retrieve this to check the code later
            HttpSession verifySession = request.getSession();
            verifySession.setAttribute("verificationUser", user);

            // ✅ 9. Return JSON Success (No Redirect)
            // React handles the navigation to /verify-email
            out.print("{\"success\":true, \"message\":\"Inscription réussie. Veuillez vérifier votre email.\"}");
            out.flush();

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\":false, \"message\":\"Erreur serveur lors de l'inscription.\"}");
            e.printStackTrace();
        }
    }
}
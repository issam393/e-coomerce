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

/**
 * Servlet pour gérer l'inscription des utilisateurs (API JSON)
 */
@WebServlet("/signup")
public class SignupServlet extends HttpServlet {
    
    private UserDAO userDAO;

    @Override
    public void init() { userDAO = new UserDAO(); }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {

        response.setContentType("application/json; charset=UTF-8");
        PrintWriter out = response.getWriter();

        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String phone = request.getParameter("phone");
        String address = request.getParameter("address");

        // 1. Check if user exists
        if (userDAO.userExists(email)) {
            // OPTIONAL: If they exist but are "PENDING", you could update the code and resend email here.
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            out.print("{\"success\":false, \"message\":\"Email déjà utilisé.\"}");
            return;
        }

        try {
            String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
            
            // 2. Create User
            User user = new User(name, email, hashedPassword, phone, address, "USER");
            
            // 3. Generate Code
            // ✅ FIX: Assumed static class name 'SendVerificationEmail'
            String code = sendVerificationEmail.generateVerificationCode(); 
            user.setVerificationCode(code);
            user.setVerified(false);
            user.setStatus("PENDING"); // Important status

            // 4. ✅ SAVE TO DB IMMEDIATELY (Instead of Session)
            userDAO.saveUser(user); 

            // 5. Send Email
            boolean emailSent = sendVerificationEmail.sendEmail(email, "Code URBANE", "Votre code: " + code);

            if (emailSent) {
                out.print("{\"success\":true, \"message\":\"Inscription réussie. Vérifiez votre email.\"}");
            } else {
                // If email fails, you might want to delete the user or handle retry
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"success\":false, \"message\":\"Erreur envoi email.\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\":false, \"message\":\"Erreur serveur.\"}");
        }
    }
}
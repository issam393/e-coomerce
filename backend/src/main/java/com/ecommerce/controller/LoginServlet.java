package com.ecommerce.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.crypto.bcrypt.BCrypt;

import com.ecommerce.dao.UserDAO;
import com.ecommerce.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private UserDAO userDAO;

    // ✅ Clé JWT fixe
    private static final SecretKey JWT_KEY =
        Keys.hmacShaKeyFor("12345678901234567890123456789012".getBytes());

    @Override
    public void init() {
        userDAO = new UserDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Set response type to JSON for React
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        try {
            User user = userDAO.getUserByEmail(email);

            // ✅ 1️⃣ Vérifier si l'utilisateur existe
            if (user == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
                out.print("{\"success\":false, \"message\":\"Email incorrect.\"}");
                out.flush();
                return;
            }

            // ✅ 2️⃣ Vérifier si le compte est vérifié
            if (!user.isVerified()) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 Forbidden
                out.print("{\"success\":false, \"message\":\"Veuillez vérifier votre compte via email.\"}");
                out.flush();
                return;
            }

            // ✅ 3️⃣ Vérifier si le compte est bloqué
            if ("BLOCKED".equalsIgnoreCase(user.getStatus())) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                out.print("{\"success\":false, \"message\":\"Votre compte est bloqué. Contactez le support.\"}");
                out.flush();
                return;
            }

            // ✅ 4️⃣ Vérifier le mot de passe
            if (!BCrypt.checkpw(password, user.getPassword())) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                out.print("{\"success\":false, \"message\":\"Mot de passe incorrect.\"}");
                out.flush();
                return;
            }

            // ✅ 5️⃣ Création de la session (Toujours utile pour le côté serveur)
            HttpSession session = request.getSession();
            session.setAttribute("email", user.getEmail());
            session.setAttribute("role", user.getRole());
            session.setAttribute("userId", user.getId()); // Store ID in session too

            // ✅ 6️⃣ Génération du JWT
            long expiration = 1000 * 60 * 60 * 24; // 1 jour
            String jwtToken = Jwts.builder()
                    .setSubject(user.getEmail())
                    .claim("role", user.getRole())
                    .claim("userId", user.getId())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + expiration))
                    .signWith(SignatureAlgorithm.HS256, JWT_KEY)
                    .compact();

            // Création du Cookie HttpOnly (Sécurisé pour React)
            Cookie jwtCookie = new Cookie("jwtToken", jwtToken);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setMaxAge(24 * 60 * 60);
            jwtCookie.setPath("/");
            // jwtCookie.setSecure(true); // Décommenter si vous utilisez HTTPS
            response.addCookie(jwtCookie);

            // ✅ 7️⃣ Réponse JSON pour React (Succès)
            // On renvoie l'ID, le Nom et le Rôle pour le localStorage du Frontend
            String jsonSuccess = String.format(
                "{\"success\":true, \"message\":\"Connexion réussie\", \"userId\":%d, \"name\":\"%s\", \"role\":\"%s\"}",
                user.getId(), 
                user.getName(), 
                user.getRole()
            );
            
            out.print(jsonSuccess);
            out.flush();

        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\":false, \"message\":\"Erreur serveur lors de la connexion.\"}");
            e.printStackTrace();
        }
    }
}
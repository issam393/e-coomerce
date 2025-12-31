package com.ecommerce.controller;

import java.io.IOException;
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

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        try {
            User user = userDAO.getUserByEmail(email);

            // ✅ 1️⃣ Vérifier si l'utilisateur existe (AJOUT)
            if (user == null) {
                response.sendRedirect("login.jsp?error=email");
                return;
            }

            // ✅ 2️⃣ Vérifier si le compte est vérifié (AJOUT)
            if (!user.isVerified()) {
                response.sendRedirect("login.jsp?error=not_verified");
                return;
            }

            // ✅ 3️⃣ Vérifier si le compte est bloqué (AJOUT)
            if ("BLOCKED".equalsIgnoreCase(user.getStatus())) {
                response.sendRedirect("login.jsp?error=blocked");
                return;
            }

            // ✅ 4️⃣ Vérifier le mot de passe
            if (!BCrypt.checkpw(password, user.getPassword())) {
                response.sendRedirect("login.jsp?error=password");
                return;
            }

            // ✅ 5️⃣ Création de la session
            HttpSession session = request.getSession();
            session.setAttribute("email", user.getEmail());
            session.setAttribute("role", user.getRole());

            // ✅ 6️⃣ Génération du JWT
            long expiration = 1000 * 60 * 60 * 24; // 1 jour
            String jwtToken = Jwts.builder()
                    .setSubject(user.getEmail())
                    .claim("role", user.getRole())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + expiration))
                    .signWith(SignatureAlgorithm.HS256, JWT_KEY)
                    .compact();

            Cookie jwtCookie = new Cookie("jwtToken", jwtToken);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setMaxAge(24 * 60 * 60);
            jwtCookie.setPath("/");
            response.addCookie(jwtCookie);

            // ✅ 7️⃣ Redirection selon le rôle
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                response.sendRedirect("/admin/adminPage.jsp");
            } else {
                response.sendRedirect("LandingPage.jsp");
            }

        } catch (SQLException e) {
            throw new ServletException("Erreur lors de la récupération de l'utilisateur", e);
        }
    }
}

package com.ecommerce.controller;

import java.io.IOException;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        // ✅ Invalidation de la session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // ✅ Suppression du cookie JWT
        Cookie jwtCookie = new Cookie("jwtToken", "");
        jwtCookie.setMaxAge(0);
        jwtCookie.setHttpOnly(true); // 🔐 sécurité
        jwtCookie.setPath("/");
        response.addCookie(jwtCookie);

        // ✅ (Optionnel) suppression du cookie email
        Cookie emailCookie = new Cookie("userEmail", "");
        emailCookie.setMaxAge(0);
        emailCookie.setHttpOnly(true);
        emailCookie.setPath("/");
        response.addCookie(emailCookie);

        // ✅ Redirection vers login
        response.sendRedirect("login.jsp");
    }
}

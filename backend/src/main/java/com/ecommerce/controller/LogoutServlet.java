package com.ecommerce.controller;

import java.io.IOException;
import java.io.PrintWriter;

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

        // ✅ 1. Set response to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // ✅ 2. Invalidate the server-side session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // ✅ 3. Delete the JWT Cookie
        // We overwrite the cookie with an empty value and 0 max age
        Cookie jwtCookie = new Cookie("jwtToken", "");
        jwtCookie.setMaxAge(0);
        jwtCookie.setHttpOnly(true); // Must match the creation attributes
        jwtCookie.setPath("/");      // Must match the creation path
        response.addCookie(jwtCookie);

        // ✅ 4. (Optional) Delete the email cookie if you use it
        Cookie emailCookie = new Cookie("userEmail", "");
        emailCookie.setMaxAge(0);
        emailCookie.setHttpOnly(true);
        emailCookie.setPath("/");
        response.addCookie(emailCookie);

        // ✅ 5. Return JSON Success (No Redirect)
        // React handles the redirect to the home page or login page
        out.print("{\"success\":true, \"message\":\"Déconnexion réussie\"}");
        out.flush();
    }
}
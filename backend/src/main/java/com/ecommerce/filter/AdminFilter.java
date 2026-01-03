package com.ecommerce.filter;

import java.io.IOException;
import com.ecommerce.model.User;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// 1. Change from "/admin/*" to "/*" to intercept ALL requests
@WebFilter("/*")
public class AdminFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // 2. Allow CORS "preflight" OPTIONS requests (needed for React fetch)
        if (request.getMethod().equals("OPTIONS")) {
            chain.doFilter(req, res);
            return;
        }

        String path = request.getServletPath();
        String method = request.getMethod();

        // ---------------------------------------------------------
        // RULE 1: PUBLIC ROUTES (No Login Required)
        // ---------------------------------------------------------
        boolean isPublic = 
            path.equals("/login") || 
            path.equals("/signup") || 
            path.equals("/logout") ||
            // Allow anyone to VIEW products or locations
            ((path.equals("/products") || path.equals("/locations")) && method.equals("GET"));

        if (isPublic) {
            chain.doFilter(request, response);
            return;
        }

        // ---------------------------------------------------------
        // RULE 2: CHECK LOGIN (Session Existence)
        // ---------------------------------------------------------
        HttpSession session = request.getSession(false); // don't create if missing
        
        // Assuming you stored the full User object in session during login:
        // session.setAttribute("user", userObj);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            // 401 Unauthorized
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"success\": false, \"message\": \"Veuillez vous connecter.\"}");
            return;
        }

        // ---------------------------------------------------------
        // RULE 3: ADMIN-ONLY ROUTES
        // ---------------------------------------------------------
        // Define what an admin does:
        // 1. Manage Users (/users)
        // 2. Manage Orders Status (PUT /orders)
        // 3. Edit/Add/Delete Products or Locations (POST/PUT/DELETE)
        
        boolean isAdminPath = 
            path.equals("/users") || 
            path.equals("/admin") ||
            (path.equals("/orders") && method.equals("PUT")) || // Update order status
            (path.equals("/orders") && request.getParameter("view") != null && request.getParameter("view").equals("all")) || // View ALL orders
            ((path.equals("/products") || path.equals("/locations")) && !method.equals("GET")); // Modify products/locations

        if (isAdminPath) {
            if ("ADMIN".equals(user.getRole())) {
                chain.doFilter(request, response); // Authorized Admin
            } else {
                // 403 Forbidden
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("{\"success\": false, \"message\": \"Accès refusé. Administrateurs uniquement.\"}");
            }
            return;
        }

        // ---------------------------------------------------------
        // RULE 4: STANDARD USER ROUTES
        // ---------------------------------------------------------
        // e.g., Creating an order (POST /orders), viewing own orders, viewing own cart
        chain.doFilter(request, response);
    }
}
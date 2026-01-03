package com.ecommerce.controller;

import com.ecommerce.dao.UserDAO;
import com.ecommerce.model.User;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/profile")
public class ProfileController extends HttpServlet {
    private UserDAO userDAO = new UserDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String idParam = request.getParameter("userId");
        if (idParam != null) {
            try {
                // Ensure you add getUserById(int id) to your UserDAO class!
                User user = userDAO.getUserById(Integer.parseInt(idParam)); 
                // Security: Don't send the password back!
                user.setPassword(""); 
                out.print(gson.toJson(user));
            } catch (Exception e) {
                response.setStatus(500);
            }
        }
        out.flush();
    }
}
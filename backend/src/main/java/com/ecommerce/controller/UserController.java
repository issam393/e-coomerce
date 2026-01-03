package com.ecommerce.controller;

import com.ecommerce.dao.UserDAO;
import com.ecommerce.model.User;
import com.google.gson.Gson;
import org.springframework.security.crypto.bcrypt.BCrypt; // Ensure you have this

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/users")
public class UserController extends HttpServlet {

    private UserDAO userDAO = new UserDAO();
    private Gson gson = new Gson();
    // GET: List all users
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        List<User> users = userDAO.getAllUsers();
        out.print(gson.toJson(users));
        out.flush();
    }

    // POST: Add new user
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            User user = gson.fromJson(request.getReader(), User.class);
            // Hash password before saving
            String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
            user.setPassword(hashedPassword);
            
            userDAO.addUser(user);
            out.print("{\"success\":true, \"message\":\"Utilisateur ajouté\"}");
        } catch (Exception e) {
            response.setStatus(500);
            out.print("{\"success\":false, \"message\":\"Erreur\"}");
        }
        out.flush();
    }

    // PUT: Block/Unblock User
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();

        try {
            // Expecting: { "id": 1, "status": "BLOCKED" }
            User data = gson.fromJson(request.getReader(), User.class);
            userDAO.updateUserStatus(data.getId(), data.getStatus());
            out.print("{\"success\":true, \"message\":\"Statut mis à jour\"}");
        } catch (Exception e) {
            response.setStatus(500);
            out.print("{\"success\":false, \"message\":\"Erreur\"}");
        }
        out.flush();
    }

    // DELETE: Remove User
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();

        try {
            int id = Integer.parseInt(request.getParameter("id"));
            userDAO.deleteUser(id);
            out.print("{\"success\":true, \"message\":\"Utilisateur supprimé\"}");
        } catch (Exception e) {
            response.setStatus(500);
            out.print("{\"success\":false, \"message\":\"Erreur\"}");
        }
        out.flush();
    }
}
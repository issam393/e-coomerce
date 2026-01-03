package com.ecommerce.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import com.ecommerce.dao.OrderDAO;
import com.ecommerce.model.Order;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/orders")
public class OrderController extends HttpServlet {

    private OrderDAO orderDAO = new OrderDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String viewMode = request.getParameter("view");
        if ("all".equals(viewMode)) {
            List<Order> allOrders = orderDAO.getAllOrders();
            out.print(gson.toJson(allOrders));
        } else {
            String userIdParam = request.getParameter("userId");
            if(userIdParam != null) {
                int userId = Integer.parseInt(userIdParam);
                List<Order> orders = orderDAO.getOrdersByUser(userId);
                out.print(gson.toJson(orders));
            } else {
                out.print("[]");
            }
        }
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            // 1. Parse JSON (Contains only userId, maybe total)
            Order order = gson.fromJson(request.getReader(), Order.class);

            // 2. Delegate EVERYTHING to DAO (Stock check, Update, Order Creation)
            int orderId = orderDAO.createOrder(order);

            out.print("{\"success\":true, \"orderId\":" + orderId + "}");
        } catch (SQLException e) {
            // This catches "Stock insufficient" or "Cart empty" errors thrown by DAO
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false, \"message\":\"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\":false, \"message\":\"Erreur serveur.\"}");
        }
        out.flush();
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        Order order = gson.fromJson(request.getReader(), Order.class);
        orderDAO.updateOrderStatus(order.getId(), order.getStatus());

        out.print("{\"success\":true, \"message\":\"Statut mis à jour\"}");
        out.flush();
    }
}
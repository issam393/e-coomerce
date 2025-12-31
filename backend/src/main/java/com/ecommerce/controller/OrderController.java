package com.ecommerce.controller;

import java.io.IOException;
import java.io.PrintWriter;
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

    // Lister les commandes d’un utilisateur
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        int userId = Integer.parseInt(request.getParameter("userId"));
        List<Order> orders = orderDAO.getOrdersByUser(userId);

        out.print(gson.toJson(orders));
        out.flush();
    }

    // Créer une commande
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        Order order = gson.fromJson(request.getReader(), Order.class);
        int orderId = orderDAO.createOrder(order);

        out.print("{\"success\":true, \"orderId\":" + orderId + "}");
        out.flush();
    }

    // Mettre à jour le statut d’une commande (ADMIN)
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        Order order = gson.fromJson(request.getReader(), Order.class);
        orderDAO.updateOrderStatus(order.getId(), order.getStatus());

        out.print("{\"success\":true, \"message\":\"Statut de la commande mis à jour\"}");
        out.flush();
    }
}

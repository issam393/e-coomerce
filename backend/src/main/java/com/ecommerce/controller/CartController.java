package com.ecommerce.controller;

import java.io.IOException;
import java.io.PrintWriter;

import com.ecommerce.dao.CartDAO;
import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/cart")
public class CartController extends HttpServlet {

    private CartDAO cartDAO = new CartDAO();
    private Gson gson = new Gson();

    // Récupérer le panier complet d'un utilisateur
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        int userId = Integer.parseInt(request.getParameter("userId"));
        Cart cart = cartDAO.getCartByUserId(userId);

        out.print(gson.toJson(cart));
        out.flush();
    }

    // Ajouter un produit au panier
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        CartItem item = gson.fromJson(request.getReader(), CartItem.class);
        cartDAO.addToCart(item);

        out.print("{\"success\":true, \"message\":\"Produit ajouté au panier\"}");
        out.flush();
    }



    // Supprimer un produit du panier
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        int id = Integer.parseInt(request.getParameter("id"));
        cartDAO.removeFromCart(id);

        out.print("{\"success\":true, \"message\":\"Produit retiré du panier\"}");
        out.flush();
    }
}

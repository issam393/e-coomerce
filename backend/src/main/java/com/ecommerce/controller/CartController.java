package com.ecommerce.controller;

import java.io.IOException;
import java.io.PrintWriter;

import com.ecommerce.dao.CartDAO;
import com.ecommerce.dao.ProductDAO;
import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/cart")
public class CartController extends HttpServlet {

    private ProductDAO productDAO = new ProductDAO();
    private CartDAO cartDAO = new CartDAO();
    private Gson gson = new Gson();

    // Récupérer le panier complet d'un utilisateur
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
       response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            // 1. Get the User ID
            String userIdParam = request.getParameter("userId");
            if (userIdParam == null) {
                out.print("{\"error\": \"User ID is required\"}");
                return;
            }
            int userId = Integer.parseInt(userIdParam);

            // 2. Get the basic Cart (IDs and Quantities)
            Cart cart = cartDAO.getCartByUserId(userId);

            // 3. ENRICH the CartItems with Product Details
            if (cart != null && cart.getItems() != null) {
                for (CartItem item : cart.getItems()) {
                    // Fetch full product details using the productId stored in the item
                    Product product = productDAO.getProductById(item.getProductId());
                    
                    if (product != null) {
                        item.setProductName(product.getName());
                        item.setProductPrice(product.getPrice());
                        item.setProductImage(product.getImage());
                        // Add size/color here if your Product model has them
                    }
                }
            }

            // 4. Return the enriched JSON
            out.print(gson.toJson(cart));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Error fetching cart: " + e.getMessage() + "\"}");
            e.printStackTrace();
        } finally {
            out.flush();
        }
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
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // Expecting JSON: { "id": 1, "quantity": 3 } (where id is the Cart Item ID)
        // You need to create a simple class or Map to hold this data, or parse manually
        CartItem updateData = gson.fromJson(request.getReader(), CartItem.class);
        
        // You must add updateCartItemQuantity(int cartItemId, int quantity) to your CartDAO
        cartDAO.updateCartItemQuantity(updateData.getId(), updateData.getQuantity());

        out.print("{\"success\":true, \"message\":\"Quantité mise à jour\"}");
        out.flush();
    }
}

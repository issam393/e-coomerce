package com.ecommerce.dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.util.DBConnection;

public class CartDAO {

    public Cart getCartByUserId(int userId) {
        List<CartItem> items = getCartItems(userId);
        return new Cart(userId, items);
    }

    public void addToCart(CartItem item) {
        String sql = "INSERT INTO cart_items (user_id, product_id, quantity, size, color) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, item.getUserId());
            stmt.setInt(2, item.getProductId());
            stmt.setInt(3, item.getQuantity());
            stmt.setString(4, item.getSize());
            stmt.setString(5, item.getColor());
            stmt.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    public List<CartItem> getCartItems(int userId) {
        List<CartItem> items = new ArrayList<>();
        // JOIN to get product details for display
        String sql = "SELECT c.id, c.user_id, c.product_id, c.quantity, c.size, c.color, " +
                     "p.name, p.price, p.image " +
                     "FROM cart_items c " +
                     "JOIN products p ON c.product_id = p.id " +
                     "WHERE c.user_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                CartItem item = new CartItem();
                item.setId(rs.getInt("id"));
                item.setUserId(rs.getInt("user_id"));
                item.setProductId(rs.getInt("product_id"));
                item.setQuantity(rs.getInt("quantity"));
                item.setSize(rs.getString("size"));
                item.setColor(rs.getString("color"));
                
                // Display fields
                item.setProductName(rs.getString("name"));
                item.setProductPrice(rs.getDouble("price"));
                item.setProductImage(rs.getString("image"));
                
                items.add(item);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return items;
    }

    public void removeFromCart(int id) {
        String sql = "DELETE FROM cart_items WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }
}
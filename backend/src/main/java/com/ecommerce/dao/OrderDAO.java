package com.ecommerce.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.ecommerce.model.Order;
import com.ecommerce.util.DBConnection;

public class OrderDAO {

    // Helper class for internal logic
    private static class CartItemTemp {
        int productId;
        int quantity;
        public CartItemTemp(int p, int q) { this.productId = p; this.quantity = q; }
    }

    // UPDATED: Now throws SQLException so Controller can handle errors message
    public int createOrder(Order order) throws SQLException {
        
        String fetchCartSQL = "SELECT product_id, quantity FROM cart_items WHERE user_id = ?"; 
        String checkStockSQL = "SELECT name, stock, price FROM products WHERE id = ?";
        String updateStockSQL = "UPDATE products SET stock = stock - ? WHERE id = ?";
        String insertOrderSQL = "INSERT INTO orders (user_id, total_price, status, created_at) VALUES (?, ?, ?, NOW())";
        String insertOrderItemSQL = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
        String clearCartSQL = "DELETE FROM cart_items WHERE user_id = ?";

        int orderId = -1;
        Connection conn = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // 🔴 START TRANSACTION

            // 1️⃣ Fetch Items from Cart
            List<CartItemTemp> cartItems = new ArrayList<>();
            try (PreparedStatement fetchStmt = conn.prepareStatement(fetchCartSQL)) {
                fetchStmt.setInt(1, order.getUserId());
                ResultSet rs = fetchStmt.executeQuery();
                while (rs.next()) {
                    cartItems.add(new CartItemTemp(rs.getInt("product_id"), rs.getInt("quantity")));
                }
            }

            if (cartItems.isEmpty()) {
                throw new SQLException("Votre panier est vide.");
            }

            // 2️⃣ CHECK STOCK & UPDATE STOCK & CALCULATE REAL TOTAL
            double calculatedTotal = 0.0;
            
            try (PreparedStatement checkStmt = conn.prepareStatement(checkStockSQL);
                 PreparedStatement updateStockStmt = conn.prepareStatement(updateStockSQL)) {
                
                for (CartItemTemp item : cartItems) {
                    checkStmt.setInt(1, item.productId);
                    ResultSet rsProduct = checkStmt.executeQuery();
                    
                    if (rsProduct.next()) {
                        String name = rsProduct.getString("name");
                        int currentStock = rsProduct.getInt("stock");
                        double price = rsProduct.getDouble("price");

                        if (currentStock < item.quantity) {
                            throw new SQLException("Stock insuffisant pour : " + name + " (Stock: " + currentStock + ")");
                        }
                        
                        // Update calculated total (more secure than trusting frontend)
                        calculatedTotal += (price * item.quantity);

                        // Deduct Stock
                        updateStockStmt.setInt(1, item.quantity);
                        updateStockStmt.setInt(2, item.productId);
                        updateStockStmt.executeUpdate();
                    } else {
                        throw new SQLException("Produit ID " + item.productId + " n'existe plus.");
                    }
                }
            }

            // 3️⃣ Create Order Header
            try (PreparedStatement orderStmt = conn.prepareStatement(insertOrderSQL, Statement.RETURN_GENERATED_KEYS)) {
                orderStmt.setInt(1, order.getUserId());
                orderStmt.setDouble(2, calculatedTotal); // Use server-side calculated total
                orderStmt.setString(3, "En cours");
                orderStmt.executeUpdate();

                ResultSet rs = orderStmt.getGeneratedKeys();
                if (rs.next()) {
                    orderId = rs.getInt(1);
                } else {
                    throw new SQLException("Echec de création de commande.");
                }
            }

            // 4️⃣ Insert Order Items
            try (PreparedStatement itemStmt = conn.prepareStatement(insertOrderItemSQL)) {
                // We need to fetch price again or store it in CartItemTemp, 
                // but for simplicity, let's assume we do a quick lookup or cached it.
                // For this example, let's re-query price briefly or optimize above.
                // Optimization: We already got price in Step 2. 
                // To keep code simple here, I will do a sub-query in SQL or just re-use the loop if I stored price.
                
                // Simplified approach: Re-query price inside this loop OR assume price didn't change in 1ms.
                String getPriceSimple = "SELECT price FROM products WHERE id = ?";
                PreparedStatement priceStmt = conn.prepareStatement(getPriceSimple);

                for (CartItemTemp item : cartItems) {
                    priceStmt.setInt(1, item.productId);
                    ResultSet rsP = priceStmt.executeQuery();
                    double p = 0.0;
                    if(rsP.next()) p = rsP.getDouble("price");

                    itemStmt.setInt(1, orderId);
                    itemStmt.setInt(2, item.productId);
                    itemStmt.setInt(3, item.quantity);
                    itemStmt.setDouble(4, p);
                    itemStmt.addBatch();
                }
                itemStmt.executeBatch();
                priceStmt.close();
            }

            // 5️⃣ Clear Cart
            try (PreparedStatement clearStmt = conn.prepareStatement(clearCartSQL)) {
                clearStmt.setInt(1, order.getUserId());
                clearStmt.executeUpdate();
            }

            conn.commit(); // 🟢 COMMIT TRANSACTION

        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            }
            throw e; // Re-throw to Controller
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException e) { e.printStackTrace(); }
            }
        }
        return orderId;
    }

    // ... (Keep your getAllOrders, getOrdersByUser, updateOrderStatus methods as they were) ...
    public List<Order> getOrdersByUser(int userId) {
        List<Order> orders = new ArrayList<>();
        // ✅ FIX 4: Changed 'order_date' to 'created_at'
        String sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Order order = new Order();
                order.setId(rs.getInt("id"));
                order.setUserId(rs.getInt("user_id"));
                order.setTotalPrice(rs.getDouble("total_price"));
                order.setStatus(rs.getString("status"));
                // ✅ FIX 5: Map DB column 'created_at' to Java field 'orderDate'
                order.setOrderDate(rs.getTimestamp("created_at")); 
                orders.add(order);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }
    public List<Order> getAllOrders() {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC";
        UserDAO userDAO = new UserDAO();
        try (Connection conn = DBConnection.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Order order = new Order();
                order.setId(rs.getInt("id"));
                order.setUserId(rs.getInt("user_id"));
                order.setTotalPrice(rs.getDouble("total_price"));
                order.setStatus(rs.getString("status"));
                order.setOrderDate(rs.getTimestamp("created_at"));
                order.setUser(userDAO.getUserById(rs.getInt("user_id"))); 
                orders.add(order);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }

    public void updateOrderStatus(int orderId, String status) {
        String sql = "UPDATE orders SET status = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, orderId);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
package com.ecommerce.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.util.DBConnection;

public class OrderDAO {

    public int createOrder(Order order) {
        String sqlOrder = "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)";
        String sqlItem = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
        int orderId = -1;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmtOrder = conn.prepareStatement(sqlOrder, Statement.RETURN_GENERATED_KEYS)) {

            stmtOrder.setInt(1, order.getUserId());
            stmtOrder.setDouble(2, order.getTotalPrice());
            stmtOrder.setString(3, order.getStatus());

            stmtOrder.executeUpdate();

            ResultSet rs = stmtOrder.getGeneratedKeys();
            if (rs.next()) {
                orderId = rs.getInt(1);
            }

            // Ajouter les items
            try (PreparedStatement stmtItem = conn.prepareStatement(sqlItem)) {
                for (OrderItem item : order.getItems()) {
                    stmtItem.setInt(1, orderId);
                    stmtItem.setInt(2, item.getProductId());
                    stmtItem.setInt(3, item.getQuantity());
                    stmtItem.setDouble(4, item.getPrice());
                    stmtItem.addBatch();
                }
                stmtItem.executeBatch();
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return orderId;
    }

    public List<Order> getOrdersByUser(int userId) {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM orders WHERE user_id = ?";

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

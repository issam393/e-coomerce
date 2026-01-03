package com.ecommerce.dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import com.ecommerce.model.Product;
import com.ecommerce.util.DBConnection;

public class ProductDAO {

    public void addProduct(Product product) {
        String sql = "INSERT INTO products (name, description, price, old_price, stock, category, image, sizes, colors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, product.getName());
            stmt.setString(2, product.getDescription());
            stmt.setDouble(3, product.getPrice());
            stmt.setDouble(4, product.getOldPrice());
            stmt.setInt(5, product.getStock());
            stmt.setString(6, product.getCategory());
            stmt.setString(7, product.getImage());
            stmt.setString(8, product.getSizes());
            stmt.setString(9, product.getColors());
            stmt.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    public List<Product> getAllProducts() {
        List<Product> products = new ArrayList<>();
        String sql = "SELECT * FROM products";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                products.add(mapRow(rs));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return products;
    }

    public Product getProductById(int id) {
        String sql = "SELECT * FROM products WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) return mapRow(rs);
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }
    
    // Helper to map result set
    private Product mapRow(ResultSet rs) throws SQLException {
        return new Product(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("description"),
            rs.getDouble("price"),
            rs.getDouble("old_price"),
            rs.getInt("stock"),
            rs.getString("category"),
            rs.getString("image"),
            rs.getString("sizes"),
            rs.getString("colors")
        );
    }
    public void updateProduct(Product product) {
        String sql = "UPDATE products SET name=?, description=?, price=?, old_price=?, stock=?, category=?, image=?, sizes=?, colors=? WHERE id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, product.getName());
            stmt.setString(2, product.getDescription());
            stmt.setDouble(3, product.getPrice());
            stmt.setDouble(4, product.getOldPrice());
            stmt.setInt(5, product.getStock());
            stmt.setString(6, product.getCategory());
            stmt.setString(7, product.getImage());
            stmt.setString(8, product.getSizes());
            stmt.setString(9, product.getColors());
            stmt.setInt(10, product.getId());
            stmt.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }
}
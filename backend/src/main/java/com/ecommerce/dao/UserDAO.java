package com.ecommerce.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.ecommerce.model.User;
import com.ecommerce.util.DBConnection;

public class UserDAO {

    // Vérifier si un utilisateur existe
    public boolean userExists(String email) {
        String sql = "SELECT id FROM users WHERE email = ?"; // ✅ table "users"
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Ajouter un utilisateur complet (signup)
    public void saveUser(User user) {
        String sql = """
            INSERT INTO users (full_name, email, password, phone, address, role, status, email_verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """;
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, user.getFullName());
            stmt.setString(2, user.getEmail());
            stmt.setString(3, user.getPassword());
            stmt.setString(4, user.getPhoneNumber()); // ✅ phone
            stmt.setString(5, user.getAddress());     // ✅ address
            stmt.setString(6, user.getRole());
            stmt.setString(7, user.getStatus());      // ✅ status (PENDING / ACTIVE / BLOCKED)
            stmt.setBoolean(8, user.isVerified());    // ✅ email_verified

            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Récupérer un utilisateur par email
    public User getUserByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM users WHERE email=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new User(
                        rs.getString("full_name"),
                        rs.getString("email"),
                        rs.getString("password"),
                        rs.getString("phone"),    // ✅ phone
                        rs.getString("address"),  // ✅ address
                        rs.getString("role")      // ✅ role
                );
            }
        }
        return null;
    }

    // Lister tous les utilisateurs
    public List<User> getAllUsers() throws SQLException {
        List<User> users = new ArrayList<>();
        String sql = "SELECT * FROM users";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                users.add(new User(
                        rs.getString("full_name"),
                        rs.getString("email"),
                        rs.getString("password"),
                        rs.getString("phone"),    // ✅ phone
                        rs.getString("address"),  // ✅ address
                        rs.getString("role")      // ✅ role
                ));
            }
        }
        return users;
    }
}

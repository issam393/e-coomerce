package com.ecommerce.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import com.ecommerce.model.Wilaya;
import com.ecommerce.model.Commune;
import com.ecommerce.util.DBConnection;

public class LocationDAO {

    // --- Wilaya Operations ---

    public List<Wilaya> getAllWilayas() {
        List<Wilaya> list = new ArrayList<>();
        String sql = "SELECT * FROM wilaya ORDER BY id ASC"; 

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Wilaya w = new Wilaya();
                w.setId(rs.getInt("id"));
                w.setName(rs.getString("name"));
                w.setPrice(rs.getDouble("price"));
                list.add(w);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Wilaya getWilayaById(int id) {
        String sql = "SELECT * FROM wilaya WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Wilaya(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getDouble("price")
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }


    public List<Commune> getCommunesByWilaya(int wilayaId) {
        List<Commune> list = new ArrayList<>();
        String sql = "SELECT * FROM commune WHERE wilaya_id = ? ORDER BY name ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, wilayaId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Commune c = new Commune();
                    c.setId(rs.getInt("id"));
                    c.setName(rs.getString("name"));
                    c.setWilayaId(rs.getInt("wilaya_id"));
                    list.add(c);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
    public boolean addWilaya(Wilaya wilaya) {
        String sql = "INSERT INTO wilaya (name, price) VALUES (?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, wilaya.getName());
            stmt.setDouble(2, wilaya.getPrice());
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteWilaya(int id) {
        // Note: You usually need to delete associated communes first or use CASCADE in DB
        String sql = "DELETE FROM wilaya WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace(); // Likely constraint violation if communes exist
            return false;
        }
    }

    // --- Commune Management ---

    public boolean addCommune(Commune commune) {
        String sql = "INSERT INTO commune (name, wilaya_id) VALUES (?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, commune.getName());
            stmt.setInt(2, commune.getWilayaId());
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteCommune(int id) {
        String sql = "DELETE FROM commune WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public boolean updateWilaya(Wilaya wilaya) {
        String sql = "UPDATE wilaya SET name = ?, price = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, wilaya.getName());
            stmt.setDouble(2, wilaya.getPrice());
            stmt.setInt(3, wilaya.getId());
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
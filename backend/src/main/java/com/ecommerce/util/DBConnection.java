package com.ecommerce.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecommerce?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASS = "CHANGE_ME"; // 🔐 à externaliser

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("✅ Driver MySQL chargé");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("❌ Driver MySQL introuvable", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, USER, PASS);
    }
}

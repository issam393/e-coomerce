package com.ecommerce.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection{

    public final static String DB_URL = "jdbc:mysql://localhost:3306/name";
    public final static String USER = "root";
    public final static String PASS = "pass";

    public static Connection getConnection()  {
        try{
            Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
            System.out.println("✅ Connexion à la base réussie !");
            return conn;
        }catch(SQLException e){
            System.err.println("❌ Impossible de se connecter à la base : " + e.getMessage());
            return null; 
        }
    }
    public static void main(String[] args) {
        getConnection();
    }
    
}
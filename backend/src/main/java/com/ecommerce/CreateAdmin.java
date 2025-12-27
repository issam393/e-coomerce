package com.ecommerce;
import org.springframework.security.crypto.bcrypt.BCrypt;

import com.ecommerce.dao.UserDAO;
import com.ecommerce.model.User;

public class CreateAdmin {

    public static void main(String[] args) throws Exception {
        String name = "Admin";
        String email = "admin@example.com";
        String password = "admin123";

        // Hacher le mot de passe
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

        // Créer l'utilisateur admin
        User admin = new User(name, email, hashedPassword, "ADMIN");

        // Sauvegarder dans la DB
        UserDAO userDAO = new UserDAO();
        userDAO.saveUser(admin, "ADMIN");

        System.out.println("Admin créé avec succès !");
    }
}

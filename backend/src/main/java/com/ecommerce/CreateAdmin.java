package com.ecommerce;
import org.springframework.security.crypto.bcrypt.BCrypt;

import com.ecommerce.dao.UserDAO;
import com.ecommerce.model.User;

public class CreateAdmin {

    public static void main(String[] args) throws Exception {

        // Créer l'utilisateur admin
        User admin = new User(
            "Admin",                // name
            "admin@example.com",    // email
            "0000000000",           // phoneNumber
            "Admin Address",        // address
            BCrypt.hashpw("admin123", BCrypt.gensalt()) // password haché
        );
        
        // Définir les champs supplémentaires
        admin.setRole("ADMIN");
        admin.setVerified(true);
        admin.setStatus("ACTIVE");
        
        // Sauvegarder dans la DB
        UserDAO userDAO = new UserDAO();
        userDAO.saveUser(admin);
        
        System.out.println("Admin créé avec succès !");
    }
}

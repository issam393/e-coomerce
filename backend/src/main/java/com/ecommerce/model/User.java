package com.ecommerce.model;

/**
 * Modèle représentant un utilisateur
 */
public class User {
    private int id;
    private String name;
    private String email;
    private String password;
    private String role; // ADMIN ou USER
    private boolean isVerified; // false par défaut
    private String verificationCode;

    // Constructeur complet
    public User(String name, String email, String password, String role, boolean isVerified, String verificationCode) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.isVerified = isVerified;
        this.verificationCode = verificationCode;
    }

    public User(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;

    }

    // Constructeur pour login (email + password)
    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { this.isVerified = verified; }

    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
}

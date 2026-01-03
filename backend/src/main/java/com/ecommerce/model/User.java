package com.ecommerce.model;

public class User {
    private int id;
    private String name;
    private String email;
    private String password;
    private String role; 
    private boolean isVerified;
    private String verificationCode;
    private String phoneNumber;
    private String address;
    private String status = "PENDING"; 

    // Constructors...
    public User() {} 

    // Used for Signup
    public User(String name, String email, String password, String role, boolean isVerified, String verificationCode) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.isVerified = isVerified;
        this.verificationCode = verificationCode;
    }

    // Used for DAO fetching
    public User(String name, String email, String password, String phoneNumber, String address, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.role = role;
    }

    // --- Getters & Setters ---
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    // ✅ FIXED: Renamed getFullName() to getName()
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

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
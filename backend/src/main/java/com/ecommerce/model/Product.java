package com.ecommerce.model;

public class Product {

    private String name;
    private String description;
    private double price;
    private int stock;
    private String category;
    private String imageUrl;
    private String taille;

    // Constructeur vide
    public Product() {}

    // Constructeur complet
    public Product(String name, String description, double price, int stock, String category, String imageUrl , String taille) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.imageUrl = imageUrl;
        this.taille = taille;
    }

    // Getters & Setters

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTaille() { return taille; }
    public void setTaille(String taille) { this.taille = taille; }
}

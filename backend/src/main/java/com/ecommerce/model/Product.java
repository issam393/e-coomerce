package com.ecommerce.model;

public class Product {
    private int id;
    private String name;
    private String description;
    private double price;
    private double oldPrice; // Added for discounts
    private int stock;
    private String category;
    private String image;    // Renamed from imageUrl
    private String sizes;    // Renamed from taille
    private String colors;   // Added

    public Product() {}

    public Product(int id, String name, String description, double price, double oldPrice, int stock, String category, String image, String sizes, String colors) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.oldPrice = oldPrice;
        this.stock = stock;
        this.category = category;
        this.image = image;
        this.sizes = sizes;
        this.colors = colors;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getOldPrice() { return oldPrice; }
    public void setOldPrice(double oldPrice) { this.oldPrice = oldPrice; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getSizes() { return sizes; }
    public void setSizes(String sizes) { this.sizes = sizes; }

    public String getColors() { return colors; }
    public void setColors(String colors) { this.colors = colors; }
}
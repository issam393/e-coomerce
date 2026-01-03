package com.ecommerce.model;

public class CartItem {
    private int id;
    private int userId;
    private int productId;
    private int quantity;
    
    // Options selected by user
    private String size;
    private String color;

    // Display fields (Fetched from Product table via JOIN)
    private String productName;
    private double productPrice;
    private String productImage;

    public CartItem() {}

    public CartItem(int userId, int productId, int quantity, String size, String color) {
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.size = size;
        this.color = color;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public double getProductPrice() { return productPrice; }
    public void setProductPrice(double productPrice) { this.productPrice = productPrice; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }
}
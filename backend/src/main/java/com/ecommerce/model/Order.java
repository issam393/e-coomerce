package com.ecommerce.model;

import java.util.List;

public class Order {

    private int id;
    private int userId;
    private double totalPrice;
    private String status; // PENDING, PAID, SHIPPED
    private List<OrderItem> items;

    public Order() {}

    public Order(int userId, double totalPrice, String status, List<OrderItem> items) {
        this.userId = userId;
        this.totalPrice = totalPrice;
        this.status = status;
        this.items = items;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}

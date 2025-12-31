package com.ecommerce.model;

import java.util.List;

public class Cart {
    private int userId;              // L'utilisateur propriétaire du panier
    private List<CartItem> items;    // Les produits dans le panier

    public Cart() {}

    public Cart(int userId, List<CartItem> items) {
        this.userId = userId;
        this.items = items;
    }

    // Getters & Setters
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }
}

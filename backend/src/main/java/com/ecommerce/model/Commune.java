package com.ecommerce.model;

public class Commune {
    private int id;
    private String name;
    private int wilayaId;

    public Commune() {}

    public Commune(int id, String name, int wilayaId) {
        this.id = id;
        this.name = name;
        this.wilayaId = wilayaId;
    }
    public Commune(String name, int wilayaId) {
        this.name = name;
        this.wilayaId = wilayaId;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getWilayaId() { return wilayaId; }
    public void setWilayaId(int wilayaId) { this.wilayaId = wilayaId; }
}
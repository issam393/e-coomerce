package com.ecommerce.controller;

import com.ecommerce.dao.ProductDAO;
import com.ecommerce.model.Product;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/products")
public class ProductController extends HttpServlet {

    private ProductDAO productDAO = new ProductDAO();
    private Gson gson = new Gson();

    // Lister tous les produits ou récupérer un produit par nom
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String name = request.getParameter("name");
        if (name != null && !name.isEmpty()) {
            Product product = productDAO.getProductByName(name);
            if (product != null) {
                out.print(gson.toJson(product));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"error\":\"Produit non trouvé\"}");
            }
        } else {
            List<Product> products = productDAO.getAllProducts();
            out.print(gson.toJson(products));
        }
        out.flush();
    }

    // Ajouter un produit (ADMIN)
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        Product product = gson.fromJson(request.getReader(), Product.class);
        productDAO.addProduct(product);

        out.print("{\"success\":true, \"message\":\"Produit ajouté avec succès\"}");
        out.flush();
    }

    // Mettre à jour un produit (ADMIN)
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        Product product = gson.fromJson(request.getReader(), Product.class);
        productDAO.updateProduct(product);

        out.print("{\"success\":true, \"message\":\"Produit mis à jour avec succès\"}");
        out.flush();
    }
   
}

package com.ecommerce.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import com.ecommerce.dao.LocationDAO;
import com.ecommerce.model.Commune;
import com.ecommerce.model.Wilaya;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/locations")
public class LocationController extends HttpServlet {

    private LocationDAO locationDAO = new LocationDAO();
    private Gson gson = new Gson();

    /**
     * GET REQUESTS
     * Used to fetch lists of Wilayas or Communes.
     * Examples:
     * 1. GET /locations?type=wilaya  -> Returns all wilayas
     * 2. GET /locations?type=commune&wilayaId=1 -> Returns communes for Wilaya ID 1
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String type = request.getParameter("type");

        if ("wilaya".equals(type)) {
            List<Wilaya> wilayas = locationDAO.getAllWilayas();
            out.print(gson.toJson(wilayas));
        } else if ("commune".equals(type)) {
            String wilayaIdStr = request.getParameter("wilayaId");
            if (wilayaIdStr != null) {
                int wilayaId = Integer.parseInt(wilayaIdStr);
                List<Commune> communes = locationDAO.getCommunesByWilaya(wilayaId);
                out.print(gson.toJson(communes));
            } else {
                out.print("[]");
            }
        } else {
            out.print("{\"error\": \"Invalid type parameter\"}");
        }
        out.flush();
    }

    /**
     * POST REQUESTS
     * Used to CREATE a new Wilaya or Commune.
     * Required Query Param: type (wilaya OR commune)
     * Body: JSON object of the entity
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String type = request.getParameter("type");
        boolean success = false;

        try {
            if ("wilaya".equals(type)) {
                // Parse JSON body to Wilaya object
                Wilaya newWilaya = gson.fromJson(request.getReader(), Wilaya.class);
                success = locationDAO.addWilaya(newWilaya);

            } else if ("commune".equals(type)) {
                // Parse JSON body to Commune object
                Commune newCommune = gson.fromJson(request.getReader(), Commune.class);
                success = locationDAO.addCommune(newCommune);
            }

            if (success) {
                out.print("{\"success\": true, \"message\": \"Ajouté avec succès\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\": false, \"message\": \"Échec de l'ajout\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"message\": \"Erreur serveur\"}");
        }
        out.flush();
    }

    /**
     * DELETE REQUESTS
     * Used to REMOVE a Wilaya or Commune.
     * Required Query Params: type, id
     * Example: DELETE /locations?type=wilaya&id=5
     */
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String type = request.getParameter("type");
        String idStr = request.getParameter("id");

        if (idStr == null || type == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\": false, \"message\": \"Paramètres manquants (type, id)\"}");
            return;
        }

        int id = Integer.parseInt(idStr);
        boolean success = false;

        try {
            if ("wilaya".equals(type)) {
                success = locationDAO.deleteWilaya(id);
            } else if ("commune".equals(type)) {
                success = locationDAO.deleteCommune(id);
            }

            if (success) {
                out.print("{\"success\": true, \"message\": \"Supprimé avec succès\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\": false, \"message\": \"Impossible de supprimer (Vérifiez si l'ID existe ou s'il y a des dépendances)\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"message\": \"Erreur serveur\"}");
        }
        out.flush();
    }
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String type = request.getParameter("type");
        boolean success = false;

        try {
            if ("wilaya".equals(type)) {
                // Parse JSON to Wilaya object (must include ID)
                Wilaya wilayaToUpdate = gson.fromJson(request.getReader(), Wilaya.class);
                success = locationDAO.updateWilaya(wilayaToUpdate);
            }

            if (success) {
                out.print("{\"success\": true, \"message\": \"Mis à jour avec succès\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\": false, \"message\": \"Échec de la mise à jour\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"message\": \"Erreur serveur\"}");
        }
        out.flush();
    }
}
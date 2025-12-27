<%@ page language="java" contentType="text/html; charset=UTF-8" %>

<%
    // Sécurisation : redirection si l'utilisateur n'est pas admin
    if (session == null || !"admin".equals(session.getAttribute("role"))) {
        response.sendRedirect("../login.jsp");
        return;
    }
%>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
</head>
<body>

<h1>Admin Dashboard</h1>
<p>Bienvenue <b><%= session.getAttribute("email") %></b></p>

<ul>
    <li><a href="#">Gérer les utilisateurs</a></li>
    <li><a href="#">Gérer les produits</a></li>
    <li><a href="#">Voir les commandes</a></li>
</ul>

<a href="<%= request.getContextPath() %>/logout">Déconnexion</a>

</body>
</html>

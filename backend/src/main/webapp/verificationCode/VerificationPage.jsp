<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.ecommerce.model.User" %>

<% User verificationCode = (User) session.getAttribute("vrificationCode") ;
    if (verificationCode == null) {
         response.sendRedirect("../signup.jsp");
         return;
    }

%>
<!DOCTYPE html>
<html>
<head>
    <title>Vérification du compte</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }

        .verification-box {
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            text-align: center;
        }

        input[type="text"] {
            padding: 10px;
            width: 200px;
            font-size: 16px;
            margin-top: 20px;
        }

        input[type="submit"] {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    
    <div class="verification-box ">
        <h2>Entrez votre code de vérification</h2>
        <form action="../verify" method="post">
            <input type="text" name="verificationCode" placeholder="XXXXXX" maxlength="6" required />
            <br/>
            <input type="submit" value="Vérifier" />
        </form>
    </div>
</body>
</html>

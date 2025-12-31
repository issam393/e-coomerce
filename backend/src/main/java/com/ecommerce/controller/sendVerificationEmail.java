package com.ecommerce.controller;

import java.security.SecureRandom; // ✅ PLUS SÉCURISÉ que Math.random()
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 * Classe utilitaire pour l'envoi des emails de vérification
 */
public class sendVerificationEmail { // ✅ NOM DE CLASSE CORRIGÉ (Java convention)

    // ❗ À METTRE DANS DES VARIABLES D'ENV EN PROD
    private static final String SENDER_EMAIL = "exemple@gmail.com"; 
    private static final String SENDER_PASSWORD = "xxxx xxxx xxxx xxxx"; 

    /**
     * Envoie un email
     */
    public static boolean sendEmail(String recipientEmail, String subject, String body) {

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        // ✅ Session SMTP avec authentification
        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SENDER_EMAIL, SENDER_PASSWORD);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SENDER_EMAIL));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(recipientEmail)
            );
            message.setSubject(subject);
            message.setText(body);

            Transport.send(message);
            System.out.println("✅ Email envoyé à : " + recipientEmail);
            return true;

        } catch (MessagingException e) {
            System.err.println("❌ Erreur envoi email : " + e.getMessage());
            return false;
        }
    }

    /**
     * Génère un code de vérification à 6 chiffres
     */
    public static String generateVerificationCode() {
        SecureRandom random = new SecureRandom(); // ✅ plus sécurisé
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}

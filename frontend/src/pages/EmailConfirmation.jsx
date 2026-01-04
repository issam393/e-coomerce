import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ Import useLocation
import api from '../api/axios';
import './EmailConfirmation.css'; 
import { FaEnvelope, FaArrowLeft, FaRedo, FaSpinner } from 'react-icons/fa';

const EmailConfirmation = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [activeInput, setActiveInput] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null); 
    
    const navigate = useNavigate();
    const location = useLocation(); // ✅ Initialize hook

    // ✅ Get email from previous page (or fallback text)
    const userEmail = location.state.email || "votre adresse email"; 

    // Show Notification Helper
    const showNotification = (type, title, message) => {
        setNotification({ type, title, message });
        setTimeout(() => setNotification(null), 5000);
    };

    // Handle Input
    const handleChange = (value, index) => {
        if (isNaN(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            setActiveInput(index + 1);
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    // Handle Backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            setActiveInput(index - 1);
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    // Submit Logic
    const handleSubmit = async () => {
        const fullCode = code.join("");
        if (fullCode.length !== 6) {
            showNotification("error", "Code incomplet", "Veuillez entrer les 6 chiffres.");
            return;
        }

        setIsLoading(true);
        console.log("here");
        try {
            const params = new URLSearchParams();
            params.append('verificationCode', fullCode);
            params.append('email', userEmail); 
            const response = await api.post('/verify', params);

            if (response.data.success) {
                showNotification("success", "Succès", "Email vérifié ! Redirection...");
                setTimeout(() => navigate('/register'), 1500);
            }
        } catch (err) {
            console.error(err);
            showNotification("error", "Erreur", err.response?.data?.message || "Code invalide ou expiré.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleResend = async () => {
        // form urlencoded body

        const params = new URLSearchParams();
        params.append('email', userEmail);
        const response = await fetch('http://localhost:9000/resend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        console.log(userEmail);
        const data = await response.json();
        if (data.success)
        {
            showNotification("success", "Envoyé", "Nouveau code envoyé");

        } else {
            showNotification("error", "Erreur", data.message || "Échec de l'envoi du code.");
        }

    };

    return (
        <div className="email-confirmation-page">
            
            {/* Notification Area */}
            <div className="notification-area">
                {notification && (
                    <div className={`notification notification--${notification.type}`}>
                        <div className="notification__content">
                            <strong className="notification__title">{notification.title}</strong>
                            <p className="notification__message">{notification.message}</p>
                        </div>
                        <button className="notification__close" onClick={() => setNotification(null)}>×</button>
                    </div>
                )}
            </div>

            <div className="email-confirmation-wrapper">
                <div className="confirmation-card">
                    
                    {/* Header */}
                    <div className="card-header-section">
                        <div className="header-icon-wrapper">
                            <FaEnvelope className="header-icon" />
                        </div>
                        <h1 className="header-title">Vérification Email</h1>
                        <p className="header-subtitle">
                            Entrez le code reçu dans votre console serveur (simulation email).
                        </p>
                    </div>

                    {/* Content */}
                    <div className="card-content-section">
                        <div className="email-info">
                            <p className="instruction-text">Entrez le code à 6 chiffres envoyé à</p>
                            {/* ✅ Display the dynamic email here */}
                            <p className="email-address">{userEmail}</p>
                        </div>

                        {/* OTP Inputs */}
                        <div className="otp-fields">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    className={`otp-field ${activeInput === index ? 'otp-field--active' : ''}`}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onFocus={() => setActiveInput(index)}
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <button 
                            className="verify-action-button" 
                            onClick={handleSubmit} 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="button-spinner" /> Vérification...
                                </>
                            ) : (
                                "Vérifier le code"
                            )}
                        </button>

                        {/* Resend Section */}
                        <div className="resend-section">
                            <p className="resend-text">Vous n'avez pas reçu le code ?</p>
                            <button className="resend-action-button" onClick={handleResend}>
                                <FaRedo /> Renvoyer le code
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="card-footer-section">
                        <button className="back-navigation-button" onClick={() => navigate('/register')}>
                            <FaArrowLeft /> Retour à la connexion
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;
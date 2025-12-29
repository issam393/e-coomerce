import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import "./EmailConfirmation.css";

const EmailConfirmation = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeInput, setActiveInput] = useState(0);
  const navigate = useNavigate();

  const validateCode = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      displayNotification("Code incomplet", "Veuillez entrer les 6 chiffres du code", "error");
      return;
    }

    setIsVerifying(true);
    
    // Simulation API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Code démo
    if (fullCode === "123456") {
      displayNotification("Email vérifié !", "Votre compte a été confirmé avec succès", "success");
      navigate("/");
    } else {
      displayNotification("Code invalide", "Le code entré est incorrect. Veuillez réessayer.", "error");
    }
    
    setIsVerifying(false);
  };

  const sendNewCode = async () => {
    setIsSending(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    displayNotification("Code renvoyé", "Un nouveau code a été envoyé à votre adresse email", "success");
    
    setIsSending(false);
  };

  const displayNotification = (title, message, type) => {
    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <strong class="notification__title">${title}</strong>
        <p class="notification__message">${message}</p>
      </div>
      <button class="notification__close" onclick="this.parentElement.remove()">×</button>
    `;
    
    const container = document.querySelector(".notification-area");
    container.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentElement) notification.remove();
    }, 5000);
  };

  const updateCode = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Focus suivant
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyPress = (index, event) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
      setActiveInput(index - 1);
    }
  };

  const handlePasteCode = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text").trim();
    
    if (/^\d{6}$/.test(pastedText)) {
      const digits = pastedText.split("").slice(0, 6);
      setCode(digits);
      setActiveInput(5);
    }
  };

  return (
    <div className="email-confirmation-page">
      <div className="notification-area"></div>
      
      <div className="email-confirmation-wrapper">
        <div className="confirmation-card">
          {/* En-tête */}
          <div className="card-header-section">
            <div className="header-icon-wrapper">
              <Mail className="header-icon" />
            </div>
            <h1 className="header-title">Vérification Email</h1>
            <p className="header-subtitle">
              Un code de vérification a été envoyé à votre adresse email
            </p>
          </div>

          {/* Contenu */}
          <div className="card-content-section">
            <div className="email-info">
              <p className="instruction-text">Entrez le code à 6 chiffres</p>
              <p className="email-address">exemple@email.com</p>
            </div>

            {/* Champs OTP */}
            <div className="otp-fields">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => updateCode(index, e.target.value)}
                  onKeyDown={(e) => handleKeyPress(index, e)}
                  onPaste={handlePasteCode}
                  onFocus={() => setActiveInput(index)}
                  className={`otp-field ${activeInput === index ? "otp-field--active" : ""}`}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Bouton vérifier */}
            <button
              onClick={validateCode}
              disabled={isVerifying || code.some(d => d === "")}
              className="verify-action-button"
            >
              {isVerifying ? (
                <RefreshCw className="button-spinner" />
              ) : null}
              {isVerifying ? "Vérification..." : "Vérifier le code"}
            </button>

            {/* Renvoyer code */}
            <div className="resend-section">
              <p className="resend-text">Vous n'avez pas reçu le code ?</p>
              <button
                onClick={sendNewCode}
                disabled={isSending}
                className="resend-action-button"
              >
                {isSending ? (
                  <RefreshCw className="button-spinner" />
                ) : (
                  <RefreshCw className="action-icon" />
                )}
                {isSending ? "Envoi en cours..." : "Renvoyer le code"}
              </button>
            </div>

            {/* Info démo */}
            <div className="demo-info">
              <p>
                💡 Pour la démo, utilisez le code : 
                <span className="demo-code-value">123456</span>
              </p>
            </div>
          </div>

          {/* Pied de page */}
          <div className="card-footer-section">
            <button
              onClick={() => navigate(-1)}
              className="back-navigation-button"
            >
              <ArrowLeft className="action-icon" />
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
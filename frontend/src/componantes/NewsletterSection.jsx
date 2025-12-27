// NewsletterSection.jsx (version corrigée avec classes uniques)
import { useState } from 'react';
import { Send } from 'lucide-react';
import '../styles/NewsletterSection.css';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsLoading(true);
      
      // Simuler un appel API
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        
        // Afficher notification
        const toast = document.createElement('div');
        toast.className = 'nl-toast nl-toast-success';
        toast.innerHTML = `
          <div class="nl-toast-content">
            <span>✓</span>
            <div>
              <strong>Merci pour votre inscription !</strong>
              <p>Vous recevrez bientôt nos dernières nouveautés.</p>
            </div>
          </div>
        `;
        document.body.appendChild(toast);
        
        // Supprimer la notification après 4 secondes
        setTimeout(() => {
          toast.classList.add('nl-fade-out');
          setTimeout(() => toast.remove(), 300);
        }, 4000);
        
        setEmail('');
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => setIsSuccess(false), 5000);
      }, 800);
    } else {
      const toast = document.createElement('div');
      toast.className = 'nl-toast nl-toast-error';
      toast.innerHTML = `
        <div class="nl-toast-content">
          <span>✗</span>
          <div>
            <strong>Adresse email invalide</strong>
            <p>Veuillez entrer une adresse email valide.</p>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('nl-fade-out');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }
  };

  return (
    <section id="newsletter" className="nl-section">
      {/* Decorative Elements */}
      <div className="nl-decorative">
        <div className="nl-circle nl-circle-1"></div>
        <div className="nl-circle nl-circle-2"></div>
      </div>

      <div className="nl-container">
        <div className="nl-content">
          <span className="nl-subtitle">Newsletter</span>
          <h2 className="nl-title">Restez Connecté</h2>
          <p className="nl-description">
            Inscrivez-vous pour recevoir en avant-première nos nouvelles collections, 
            offres exclusives et conseils style.
          </p>

          {isSuccess ? (
            <div className="nl-success-message">
              <div className="nl-success-icon">✓</div>
              <div>
                <h3>Inscription réussie !</h3>
                <p>Un email de confirmation vous a été envoyé.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="nl-form">
              <div className="nl-input-container">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="nl-input"
                  required
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="nl-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="nl-loading-spinner"></div>
                  ) : (
                    <>
                      S'inscrire
                      <Send className="nl-send-icon" />
                    </>
                  )}
                </button>
              </div>
              <p className="nl-privacy">
                En vous inscrivant, vous acceptez notre politique de confidentialité.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'Hoodies', href: '#' },
      { name: 'Jeans', href: '#' },
      { name: 'Casquettes', href: '#' },
      { name: 'Collection Hiver', href: '#' },
      { name: 'Nouveautés', href: '#' },
    ],
    company: [
      { name: 'Notre Histoire', href: '#about' },
      { name: 'Contact', href: '#' },
      { name: 'Carrières', href: '#' },
      { name: 'Presse', href: '#' },
      { name: 'Boutiques', href: '#' },
    ],
    support: [
      { name: 'FAQ', href: '#' },
      { name: 'Livraison', href: '#' },
      { name: 'Retours', href: '#' },
      { name: 'Guide des tailles', href: '#' },
      { name: 'Contactez-nous', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer id='footer' className="footer">
      {/* Top Section */}
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand & Contact */}
            <div className="footer-brand">
              <a href="#" className="footer-logo">
                URBANE
              </a>
              <p className="footer-tagline">
                Votre destination pour le streetwear premium. Style, qualité et authenticité depuis 2020.
              </p>
              
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <span>123 Rue du Style, 75000 Paris</span>
                </div>
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>01 23 45 67 89</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>contact@urbane.com</span>
                </div>
              </div>
              
              <div className="social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="social-link"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="social-icon" />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop Links */}
            <div className="footer-column">
              <h4 className="column-title">Boutique</h4>
              <ul className="column-list">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="footer-column">
              <h4 className="column-title">Entreprise</h4>
              <ul className="column-list">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="footer-column">
              <h4 className="column-title">Support</h4>
              <ul className="column-list">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="bottom-content">
            <p className="copyright">
              © {currentYear} URBANE. Tous droits réservés.
            </p>
            
            <div className="legal-links">
              <a href="#" className="legal-link">Mentions légales</a>
              <span className="separator">•</span>
              <a href="#" className="legal-link">Politique de confidentialité</a>
              <span className="separator">•</span>
              <a href="#" className="legal-link">CGV</a>
              <span className="separator">•</span>
              <a href="#" className="legal-link">Cookies</a>
            </div>
            
            <div className="payment-methods">
              <div className="payment-icon visa" aria-label="Visa"></div>
              <div className="payment-icon mastercard" aria-label="Mastercard"></div>
              <div className="payment-icon paypal" aria-label="PayPal"></div>
              <div className="payment-icon apple-pay" aria-label="Apple Pay"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
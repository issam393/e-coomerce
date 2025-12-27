// AboutSection.jsx
import React, { useEffect, useState } from 'react';
import '../styles/AboutSection.css';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content-wrapper">
          {/* Left Content */}
          <div className={`about-content-left ${isVisible ? 'fade-in-up' : ''}`}>
            <span className="section-subtitle">Notre Histoire</span>
            <h2 className="section-title">
              Une Passion Pour le
              <span className="text-gradient"> Streetwear</span>
            </h2>
            
            <div className="about-description">
              <p>
                Fondée en 2020, URBANE est née d'une vision simple : créer des vêtements 
                streetwear qui allient confort, qualité et style unique.
              </p>
              <p>
                Chaque pièce de notre collection est conçue avec passion, en utilisant 
                des matériaux premium sourcés de manière responsable.
              </p>
              <p>
                Notre mission est de vous permettre d'exprimer votre personnalité 
                à travers des créations uniques qui transcendent les tendances éphémères.
              </p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <p className="stat-label">Clients Satisfaits</p>
              </div>
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <p className="stat-label">Produits Uniques</p>
              </div>
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <p className="stat-label">Pays Livrés</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className={`about-visual-right ${isVisible ? 'fade-in-up delay' : ''}`}>
            <div className="visual-grid">
              <div className="grid-column-left">
                <div className="visual-box visual-box-1 float-animation"></div>
                <div className="visual-box visual-box-2"></div>
              </div>
              <div className="grid-column-right">
                <div className="visual-box visual-box-3"></div>
                <div className="visual-box visual-box-4 float-animation delay-1"></div>
              </div>
            </div>
            
            {/* Decorative Circles */}
            <div className="decorative-circle circle-top-right"></div>
            <div className="decorative-circle circle-bottom-left"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
import React from "react";
import "../styles/About.css";
import heroBanner from "../assets/hero_banner.png";

function About() {
  return (
    <section
    id="hero"
      className="hero"
      style={{
        backgroundImage: `
          linear-gradient(
            to right,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0)
          ),
          url(${heroBanner})
        `
      }}
    >
      <p className="edition">ÉDITION LIMITÉE</p>

      <h1>
        Exprimez <br />
        <span>Votre Style</span> <br />
        Sans Limites
      </h1>

      <p className="description">
        Découvrez notre collection exclusive de streetwear <br />
        premium. Hoodies, jeans, casquettes et essentiels <br />
        d'hiver pour un style unique.
      </p>

      <div className="buttons">
        <button className="btn1">Découvrir la collection →</button>
        <button className="btn2">En savoir plus</button>
      </div>
    </section>
  );
}

export default About;

import React from "react";
import "../styles/Hero.css";

import client1 from "../assets/client1.jpg";
import client2 from "../assets/client2.jpg";
import client3 from "../assets/client3.jpg";
import client4 from "../assets/client4.jpg";
import client5 from "../assets/client5.jpg";
import client6 from "../assets/client6.jpg";
import client7 from "../assets/client7.jpg";
import client8 from "../assets/client8.jpg";
import client9 from "../assets/client9.jpg";
import client10 from "../assets/client10.jpg";

const testimonials = [
  { id: 1, name: "Alice", text: "J'adore ces vêtements, le confort est incroyable et le style est parfait pour toutes les occasions.", avatar: client1 },
  { id: 2, name: "Mohamed", text: "Le streetwear noir est exactement ce que je cherchais, la qualité est irréprochable et la livraison rapide.", avatar: client2 },
  { id: 3, name: "Sarah", text: "Hoodies et jeans très confortables, j'apprécie vraiment le soin apporté aux détails et aux finitions.", avatar: client3 },
  { id: 4, name: "Karim", text: "Livraison rapide et produit conforme à la description, je recommande cette boutique à tous mes amis.", avatar: client4 },
  { id: 5, name: "Lina", text: "Très satisfait de mon achat, les articles sont stylés et durables, je reviendrai certainement.", avatar: client5 },
  { id: 6, name: "Youssef", text: "Qualité exceptionnelle et service client au top, je ne peux que recommander cette marque.", avatar: client6 },
  { id: 7, name: "Emma", text: "Le design et le confort se marient parfaitement, chaque pièce est unique et agréable à porter.", avatar: client7 },
  { id: 8, name: "Lucas", text: "Articles de haute qualité, livraison rapide et packaging soigné, je suis impressionné.", avatar: client8 },
  { id: 9, name: "Chloé", text: "J'aime beaucoup cette collection, elle allie style, confort et durabilité de manière exceptionnelle.", avatar: client9 },
  { id: 10, name: "Maxime", text: "Tout est parfait, des matériaux aux finitions, je suis très satisfait de mon expérience d'achat.", avatar: client10 },
];

// Dupliquer pour un défilement infini
const duplicatedTestimonials = [...testimonials, ...testimonials];

function Hero() {
  return (
    <section id="hero" className="testimonials">
      <div className="testimonials-header">
        <h2>❤️ CE QUE DISENT NOS CLIENTS.</h2>
        <p>
          Une Passion Pour le <span>noire</span>{" "}
          <span className="orange">Streetwear</span>
        </p>
      </div>

      <div className="testimonials-slider-wrapper">
        <div className="testimonials-slider slow">
          {duplicatedTestimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card">
              <img className="avatar" src={testimonial.avatar} alt={testimonial.name} />
              <div className="name">{testimonial.name}</div>
              <div className="comment">{testimonial.text}</div>
            </div>
          ))}
        </div>

        <div className="testimonials-slider fast">
          {duplicatedTestimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card">
              <img className="avatar" src={testimonial.avatar} alt={testimonial.name} />
              <div className="name">{testimonial.name}</div>
              <div className="comment">{testimonial.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;

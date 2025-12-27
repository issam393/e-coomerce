import React from "react";
import "../styles/Categories.css";

import hoodieImg from "../assets/catecoty-hoodies.jpeg";
import jeansImg from "../assets/category-jeans.jpeg";
import capImg from "../assets/category-caps.jpeg";
import winterImg from "../assets/category-winter.jpeg";

function Categories() {
  const categories = [
    {
      title: "Hoodies",
      subtitle: "Confort et style urbain",
      img: hoodieImg,
      count: "24 articles",
    },
    {
      title: "Jeans",
      subtitle: "Denim premium",
      img: jeansImg,
      count: "18 articles",
    },
    {
      title: "Casquettes",
      subtitle: "Accessoires essentiels",
      img: capImg,
      count: "12 articles",
    },
    {
      title: "Collection Hiver",
      subtitle: "Restez au chaud avec style",
      img: winterImg,
      count: "30 articles",
    },
  ];

  return (
    <section id="categories" className="categories">
      <div className="categories-header">
        <p className="subtitle">NOS CATÉGORIES</p>
        <h2>
          Trouvez <span>Votre Style.</span>
        </h2>
        <p className="description">
          Explorez notre sélection soigneusement curatée de vêtements streetwear
          <br />
          premium
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div key={index} className="category-card">
            <img src={cat.img} alt={cat.title} />

            {/* Texte à gauche */}
            <div className="category-text">
              <h3>{cat.title}</h3>
              <p>{cat.subtitle}</p>
            </div>

            {/* Footer : nombre d’articles + flèche */}
            <div className="category-footer">
              <span className="category-count">{cat.count}</span>
              <span className="category-arrow">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;

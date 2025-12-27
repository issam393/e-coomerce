// Nav.jsx (version avec ancres)
import React from 'react';
import { CiShop } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import '../styles/Nav.css';

function Nav() {
  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'Categories', id: 'categories' },
    { name: 'About', id: 'about' },
    { name: 'Newsletter', id: 'newsletter' },
    { name: 'Contact', id: 'footer' },
  ];

  const scrollToSection = (id, e) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav  className="nav">
      <div className="log">URBANE</div>
      
      <div className="links">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={`#${link.id}`}
            className="nav-link"
            onClick={(e) => scrollToSection(link.id, e)}
          >
            {link.name}
          </a>
        ))}
      </div>

      <div className="left">
        <div className="shop-container">
          <CiShop className="shop" />
        </div>
        <div 
  className="connexion" 
  onClick={() => window.location.href = '/register'}
  style={{ cursor: 'pointer' }}
>
  <span><GoPerson /></span> Inscription
</div>
      </div>
    </nav>
  );
}

export default Nav;
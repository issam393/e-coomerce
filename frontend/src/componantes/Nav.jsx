// Nav.jsx
import React, { useState, useEffect } from 'react';
import { CiShop } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { MdLogout } from "react-icons/md"; // Added Logout Icon
import '../styles/Nav.css';

function Nav() {
  const [user, setUser] = useState(null);

  // 1. Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  // 2. Handle Logout Logic
  const handleLogout = async () => {
    try {
      // Call backend to invalidate session
      await fetch('http://localhost:9000/logout', {
        method: 'POST', // or 'GET' depending on your Servlet
        credentials: 'include' // Important to send the cookie so backend knows who to logout
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state regardless of backend response
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/'; // Refresh/Redirect to home
    }
  };

  return (
    <nav className="nav">
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
        <div className="shop-container" onClick={() => window.location.href = '/Products'}>
          <CiShop className="shop" />
        </div>

        {/* 3. Conditional Rendering */}
        {user ? (
          // IF LOGGED IN: Show Disconnect
          <div 
            className="connexion" 
            onClick={handleLogout}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <span style={{ fontSize: '1.2em' }}><MdLogout /></span> 
            Déconnexion
          </div>
        ) : (
          // IF NOT LOGGED IN: Show Register
          <div 
            className="connexion" 
            onClick={() => window.location.href = '/register'}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <span><GoPerson /></span> 
            Inscription
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
// LoginForm.jsx
import React, { useState } from 'react';
import './Register.css';
import { FaUser, FaLock, FaEnvelope, FaGoogle, FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';

const Regiter = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login attempt:', { username: formData.username, password: formData.password });
    } else {
      console.log('Registration attempt:', formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="body">
    <div className={`form-container ${!isLogin ? 'active' : ''}`}>
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input 
              type="text" 
              name="username"
              placeholder="Username" 
              required 
              value={formData.username}
              onChange={handleChange}
            />
            <FaUser className="input-icon" />
          </div>
          <div className="input-box">
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              required 
              value={formData.password}
              onChange={handleChange}
            />
            <FaLock className="input-icon" />
          </div>
          <div className="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="btn">Login</button>
          <p>or login with social platforms</p>
          <div className="social-icons">
            <a href="#"><FaGoogle /></a>
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaGithub /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </form>
      </div>

      <div className="form-box register">
        <form onSubmit={handleSubmit}>
          <h1>Registration</h1>
          <div className="input-box">
            <input 
              type="text" 
              name="username"
              placeholder="Username" 
              required 
              value={formData.username}
              onChange={handleChange}
            />
            <FaUser className="input-icon" />
          </div>
          <div className="input-box">
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
            <FaEnvelope className="input-icon" />
          </div>
          <div className="input-box">
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              required 
              value={formData.password}
              onChange={handleChange}
            />
            <FaLock className="input-icon" />
          </div>
          <button type="submit" className="btn">Register</button>
          <p>or register with social platforms</p>
          <div className="social-icons">
            <a href="#"><FaGoogle /></a>
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaGithub /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </form>
      </div>

      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn toggle-btn" onClick={() => setIsLogin(false)}>Register</button>
        </div>

        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn toggle-btn" onClick={() => setIsLogin(true)}>Login</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Regiter;
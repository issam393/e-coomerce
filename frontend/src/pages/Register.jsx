import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 
import './Register.css'; // Make sure this CSS file exists
import { 
  FaUser, 
  FaLock, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaGoogle, 
  FaFacebook 
} from 'react-icons/fa';

const Register = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    try {
      if (isLogin) {
        // --- LOGIN ---
        params.append('email', formData.email);
        params.append('password', formData.password);

        const response = await api.post('/login', params);
        
        if (response.data.success) {
          localStorage.setItem('user', JSON.stringify(response.data));
          
          // ✅ FIX: Matches your routing file paths
          if (response.data.role === 'ADMIN') {
            navigate('/Admin'); 
          } else {
            navigate('/Dashboard');
          }
        }
      } else {
        // --- SIGNUP ---
        params.append('name', formData.username);
        params.append('email', formData.email);
        params.append('password', formData.password);
        params.append('phone', formData.phone);     // ✅ Required by Backend
        params.append('address', formData.address); // ✅ Required by Backend

        const response = await api.post('/signup', params);
        if (response.data.success) {
           alert("Registration successful! Check server console for code.");
           // ✅ FIX: Matches your routing file path
           navigate('/EmailConfirmation', { state: { email: formData.email } });
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert("Error: " + (error.response?.data?.message || "Connection failed"));
    }
  };

  return (
    <div className="body">
      <div className={`form-container ${!isLogin ? 'active' : ''}`}>
        
        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="input-box">
              <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
              <FaEnvelope className="input-icon" />
            </div>
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
              <FaLock className="input-icon" />
            </div>
            <button type="submit" className="btn">Login</button>
            <div className="social-icons">
               <a href="#"><FaGoogle /></a> <a href="#"><FaFacebook /></a>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className="form-box register">
          <form onSubmit={handleSubmit}>
            <h1>Registration</h1>
            
            <div className="input-box">
              <input type="text" name="username" placeholder="Full Name" required value={formData.username} onChange={handleChange} />
              <FaUser className="input-icon" />
            </div>
            
            <div className="input-box">
              <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
              <FaEnvelope className="input-icon" />
            </div>
            
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
              <FaLock className="input-icon" />
            </div>

            {/* ✅ Phone Input */}
            <div className="input-box">
              <input type="tel" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} />
              <FaPhone className="input-icon" />
            </div>

            {/* ✅ Address Input */}
            <div className="input-box">
              <input type="text" name="address" placeholder="Shipping Address" required value={formData.address} onChange={handleChange} />
              <FaMapMarkerAlt className="input-icon" />
            </div>

            <button type="submit" className="btn">Register</button>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <button className="btn toggle-btn" onClick={() => setIsLogin(false)}>Register</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <button className="btn toggle-btn" onClick={() => setIsLogin(true)}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
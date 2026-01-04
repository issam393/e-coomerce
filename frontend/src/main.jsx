import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductsDetails.jsx'
import Admin from './pages/Admin.jsx'
import AdminRoute from './componantes/AdminRoute.jsx'
import EmailConfirmation from './pages/EmailConfirmation.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path='/Dashboard' element={<Dashboard />}/>
        <Route path='/Products' element={<Products />}/>
        <Route path='/Product/:id' element={<ProductDetails />}/>
          <Route path="/admin" element={<Admin />} />
        <Route path='/EmailConfirmation' element={<EmailConfirmation />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
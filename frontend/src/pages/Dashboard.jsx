// Dashboard.jsx
import { useState } from 'react';
import { User, Package, ShoppingCart, LogOut, ChevronRight, Trash2, Plus, Minus, MapPin, Mail, Phone, Edit2, Home } from 'lucide-react';
import './Dashboard.css';

// Mock data
const mockOrders = [
  { id: "ORD-2025-001", date: "22 Déc 2025", status: "Livré", total: "189€", items: 3 },
  { id: "ORD-2025-002", date: "18 Déc 2025", status: "En cours", total: "89€", items: 1 },
  { id: "ORD-2025-003", date: "10 Déc 2025", status: "Livré", total: "245€", items: 4 },
];

const mockCart = [
  { id: 1, name: "Hoodie Oversize Premium", size: "L", color: "Noir", price: 89, quantity: 1 },
  { id: 2, name: "Jean Baggy Vintage", size: "M", color: "Bleu", price: 119, quantity: 2 },
];

const mockProfile = {
  name: "Lucas Martin",
  email: "lucas.martin@email.com",
  phone: "+33 6 12 34 56 78",
  address: "42 Rue de la Mode, 75001 Paris",
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [cart, setCart] = useState(mockCart);

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Livré': return 'status-delivered';
      case 'En cours': return 'status-pending';
      default: return 'status-default';
    }
  };

  const tabs = [
    { id: 'orders', label: 'Mes Commandes', icon: Package },
    { id: 'cart', label: 'Mon Panier', icon: ShoppingCart, badge: cart.length },
    { id: 'profile', label: 'Mon Profil', icon: User },
  ];
  
  

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-container">
          <div className="header-content">
            <button 
              onClick={() => window.location.href = '/'}
              className="dashboard-logo"
            >
              URBANE
            </button>
            <div className="header-right">
              <button 
                onClick={() => window.location.href = '/'}
                className="logout-btn"
              >
                <LogOut className="icon-sm" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-container dashboard-content">
        <div className="dashboard-grid">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-profile">
                <div className="profile-avatar">
                  {mockProfile.name.charAt(0)}
                </div>
                <h2 className="profile-name">{mockProfile.name}</h2>
                <p className="profile-since">Client depuis 2024</p>
              </div>
              
              <nav className="sidebar-nav">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <div className="nav-btn-left">
                      <tab.icon className="nav-icon" />
                      <span className="nav-label">{tab.label}</span>
                    </div>
                    <div className="nav-btn-right">
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className={`nav-badge ${activeTab === tab.id ? 'active-badge' : ''}`}>
                          {tab.badge}
                        </span>
                      )}
                      <ChevronRight className="chevron-icon" />
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="dashboard-main">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="tab-content">
                <h1 className="tab-title">Mes Commandes</h1>
                <div className="orders-grid">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <div className="order-info">
                            <h3 className="order-id">{order.id}</h3>
                            <span className={`status-badge ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="order-meta">{order.date} • {order.items} article(s)</p>
                        </div>
                        <div className="order-right">
                          <span className="order-total">{order.total}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === 'cart' && (
              <div className="tab-content">
                <h1 className="tab-title">Mon Panier</h1>
                
                {cart.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingCart className="empty-icon" />
                    <h3 className="empty-title">Votre panier est vide</h3>
                    <p className="empty-text">Découvrez notre collection et ajoutez vos articles préférés.</p>
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="explore-btn"
                    >
                      Explorer la Collection
                    </button>
                  </div>
                ) : (
                  <div className="cart-grid">
                    <div className="cart-items">
                      {cart.map((item) => (
                        <div key={item.id} className="cart-item-card">
                          <div className="cart-item-content">
                            <div className="cart-item-image">
                              <ShoppingCart className="item-icon" />
                            </div>
                            <div className="cart-item-details">
                              <h3 className="item-name">{item.name}</h3>
                              <p className="item-meta">Taille: {item.size} • Couleur: {item.color}</p>
                              <div className="item-actions">
                                <div className="quantity-control">
                                  <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="quantity-btn"
                                  >
                                    <Minus className="icon-xs" />
                                  </button>
                                  <span className="quantity-value">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="quantity-btn"
                                  >
                                    <Plus className="icon-xs" />
                                  </button>
                                </div>
                                <div className="item-right">
                                  <span className="item-price">{item.price * item.quantity}€</span>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="delete-btn"
                                  >
                                    <Trash2 className="icon-sm" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Summary */}
                    <div className="cart-summary">
                      <div className="summary-card">
                        <h3 className="summary-title">Récapitulatif</h3>
                        <div className="summary-details">
                          <div className="summary-row">
                            <span className="summary-label">Sous-total</span>
                            <span className="summary-value">{cartTotal}€</span>
                          </div>
                          <div className="summary-row">
                            <span className="summary-label">Livraison</span>
                            <span className="summary-value">Gratuite</span>
                          </div>
                          <div className="summary-total">
                            <span className="total-label">Total</span>
                            <span className="total-value">{cartTotal}€</span>
                          </div>
                        </div>
                        <button className="checkout-btn">
                          Passer la Commande
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="tab-content">
                <h1 className="tab-title">Mon Profil</h1>
                <div className="profile-card">
                  <div className="profile-header">
                    <h3 className="profile-section-title">Informations Personnelles</h3>
                  </div>
                  
                  <div className="profile-grid">
                    <div className="profile-field">
                      <div className="field-icon">
                        <User className="icon-md" />
                      </div>
                      <div className="field-content">
                        <p className="field-label">Nom complet</p>
                        <p className="field-value">{mockProfile.name}</p>
                      </div>
                    </div>
                    
                    <div className="profile-field">
                      <div className="field-icon">
                        <Mail className="icon-md" />
                      </div>
                      <div className="field-content">
                        <p className="field-label">Email</p>
                        <p className="field-value">{mockProfile.email}</p>
                      </div>
                    </div>
                    
                    <div className="profile-field">
                      <div className="field-icon">
                        <Phone className="icon-md" />
                      </div>
                      <div className="field-content">
                        <p className="field-label">Téléphone</p>
                        <p className="field-value">{mockProfile.phone}</p>
                      </div>
                    </div>
                    
                    <div className="profile-field">
                      <div className="field-icon">
                        <MapPin className="icon-md" />
                      </div>
                      <div className="field-content">
                        <p className="field-label">Adresse de livraison</p>
                        <p className="field-value">{mockProfile.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
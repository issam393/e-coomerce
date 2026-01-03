import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, ShoppingCart, LogOut, ChevronRight, Trash2, Plus, Minus, MapPin, Mail, Phone } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  
  // --- Data State ---
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  // --- UI State ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Helper: Get User ID from LocalStorage ---
  const getUserId = () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return null;
      const userData = JSON.parse(userString);
      return userData.userId; 
    } catch (e) {
      console.error("Error parsing user data", e);
      return null;
    }
  };

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      const userId = getUserId();
      
      if (!userId) {
        window.location.href = '/login'; 
        return;
      }

      const fetchOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // ✅ Critical: Sends the JWT Cookie
      };
      console.log("Fetching data for userId:", userId);
      try {
        const [profileRes, ordersRes, cartRes] = await Promise.all([
          fetch(`http://localhost:9000/profile?userId=${userId}`, fetchOptions),
          fetch(`http://localhost:9000/orders?userId=${userId}`, fetchOptions),
          fetch(`http://localhost:9000/cart?userId=${userId}`, fetchOptions)
        ]);

        if (!profileRes.ok || !ordersRes.ok || !cartRes.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        const profileData = await profileRes.json();
        const ordersData = await ordersRes.json();
        const cartData = await cartRes.json();

        setProfile(profileData);
        setOrders(ordersData);
        setCart(Array.isArray(cartData) ? cartData : cartData.items || []);
        
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données. Vérifiez que le serveur Java (port 9000) est lancé.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. UPDATE QUANTITY (PUT) ---
  const updateQuantity = async (cartItemId, currentQuantity, delta) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    
    // Optimistic Update
    setCart(cart.map(item => 
      item.id === cartItemId ? { ...item, quantity: newQuantity } : item
    ));

    try {
      await fetch(`http://localhost:9000/cart`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: cartItemId, quantity: newQuantity })
      });
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  // --- 3. REMOVE FROM CART (DELETE) ---
  const removeFromCart = async (cartItemId) => {
    setCart(cart.filter(item => item.id !== cartItemId));

    try {
      await fetch(`http://localhost:9000/cart?id=${cartItemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  // --- 4. CHECKOUT (POST ORDER) ---
  const handleCheckout = async () => {
    const userId = getUserId();
    if (!userId) return;

    // Calculate Total
    const totalCalc = cart.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);

    // ✅ JSON Payload: Using 'totalPrice' to match your Java Order Model
    const orderPayload = {
      userId: userId,
      totalPrice: totalCalc, 
      status: "En cours"
    };

    try {
      const response = await fetch('http://localhost:9000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (data.success) {
        // A. Clear Local Cart UI
        setCart([]);
        
        // B. Refresh Orders List
        const refreshOrders = await fetch(`http://localhost:9000/orders?userId=${userId}`, { credentials: 'include' });
        const newOrdersList = await refreshOrders.json();
        setOrders(newOrdersList);

        // C. Switch Tab
        setActiveTab('orders');
        
        alert("Commande validée avec succès !");
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Erreur lors de la validation de la commande.");
    }
  };

  // --- 5. LOGOUT ---
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:9000/logout', { credentials: 'include' });
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  // --- 6. EXPLORE COLLECTION ---
  const handleExploreCollection = () => {
    navigate('/products');
  };
  // --- Calculated Values ---
  const cartTotal = cart.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);

  const getStatusColor = (status) => {
    if (!status) return 'status-default';
    const s = status.toLowerCase();
    if (s === 'livré' || s === 'delivered') return 'status-delivered';
    if (s === 'en cours' || s === 'pending') return 'status-pending';
    return 'status-default';
  };

  const tabs = [
    { id: 'orders', label: 'Mes Commandes', icon: Package },
    { id: 'cart', label: 'Mon Panier', icon: ShoppingCart, badge: cart.length },
    { id: 'profile', label: 'Mon Profil', icon: User },
  ];

  if (isLoading) return <div className="dashboard-loading"><div className="spinner"></div><p>Chargement...</p></div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-container">
          <div className="header-content">
            <button onClick={() => window.location.href = '/'} className="dashboard-logo">
              URBANE
            </button>
            <div className="header-right">
              <button onClick={handleLogout} className="logout-btn">
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
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 className="profile-name">{profile?.name || 'Utilisateur'}</h2>
                <p className="profile-since">Client Urbane</p>
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
                {orders.length === 0 ? (
                  <p className="empty-text">Aucune commande trouvée.</p>
                ) : (
                  <div className="orders-grid">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div>
                            <div className="order-info">
                              <h3 className="order-id">CMD-{order.id}</h3>
                              <span className={`status-badge ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="order-meta">{new Date(order.orderDate).toLocaleDateString()} • {order.totalPrice}€</p>
                          </div>
                          <div className="order-right">
                            <span className="order-total">{order.totalPrice}€</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    <button onClick={handleExploreCollection} className="explore-btn">
                      Explorer la Collection
                    </button>
                  </div>
                ) : (
                  <div className="cart-grid">
                    <div className="cart-items">
                      {cart.map((item) => (
                        <div key={item.id} className="cart-item-card">
                          <div className="cart-item-content">
                            {/* Product Image */}
                            <div className="cart-item-image">
                              {item.productImage ? (
                                <img 
                                  src={item.productImage} 
                                  alt={item.productName} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <ShoppingCart className="item-icon" />
                              )}
                            </div>
                            
                            <div className="cart-item-details">
                              <h3 className="item-name">{item.productName || "Produit"}</h3>
                              <p className="item-meta">Prix unitaire: {item.productPrice}€</p>
                              
                              <div className="item-actions">
                                <div className="quantity-control">
                                  <button onClick={() => updateQuantity(item.id, item.quantity, -1)} className="quantity-btn">
                                    <Minus className="icon-xs" />
                                  </button>
                                  <span className="quantity-value">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.quantity, 1)} className="quantity-btn">
                                    <Plus className="icon-xs" />
                                  </button>
                                </div>
                                <div className="item-right">
                                  <span className="item-price">{(item.productPrice * item.quantity).toFixed(2)}€</span>
                                  <button onClick={() => removeFromCart(item.id)} className="delete-btn">
                                    <Trash2 className="icon-sm" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="cart-summary">
                      
                      <div className="summary-card">
                        <h3 className="summary-title">Récapitulatif</h3>
                        <div className="summary-details">
                          <div className="summary-total">
                            <span className="total-label">Total</span>
                            <span className="total-value">{cartTotal.toFixed(2)}€</span>
                          </div>
                        </div>
                        <button 
                          className="checkout-btn"
                          onClick={handleCheckout}
                          disabled={cart.length === 0}
                        >
                          Passer la Commande
                        </button>
                      </div>
                    </div>
                    <button onClick={handleExploreCollection} className="explore-btn">
                        Explorer la Collection
                    </button>
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
                      <div className="field-icon"><User className="icon-md" /></div>
                      <div className="field-content">
                        <p className="field-label">Nom complet</p>
                        <p className="field-value">{profile?.name}</p>
                      </div>
                    </div>
                    <div className="profile-field">
                      <div className="field-icon"><Mail className="icon-md" /></div>
                      <div className="field-content">
                        <p className="field-label">Email</p>
                        <p className="field-value">{profile?.email}</p>
                      </div>
                    </div>
                    <div className="profile-field">
                      <div className="field-icon"><Phone className="icon-md" /></div>
                      <div className="field-content">
                        <p className="field-label">Téléphone</p>
                        <p className="field-value">{profile?.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="profile-field">
                      <div className="field-icon"><MapPin className="icon-md" /></div>
                      <div className="field-content">
                        <p className="field-label">Adresse</p>
                        <p className="field-value">{profile?.address}</p>
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
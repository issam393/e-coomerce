// ProductDetail.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RefreshCcw, Check, Users } from 'lucide-react';
import './ProductDetails.css';

// Wilayas d'Algérie avec nombre de commandes
const wilayas = [
  { id: 1, name: "Alger", price: 400, orders: 1250, deliveryTime: "24h", popularity: "très élevée" },
  { id: 2, name: "Oran", price: 600, orders: 890, deliveryTime: "48h", popularity: "élevée" },
  { id: 3, name: "Constantine", price: 700, orders: 650, deliveryTime: "48h", popularity: "élevée" },
  { id: 4, name: "Annaba", price: 750, orders: 420, deliveryTime: "72h", popularity: "moyenne" },
  { id: 5, name: "Blida", price: 450, orders: 780, deliveryTime: "24h", popularity: "élevée" },
  { id: 6, name: "Batna", price: 800, orders: 320, deliveryTime: "72h", popularity: "moyenne" },
  { id: 7, name: "Sétif", price: 700, orders: 540, deliveryTime: "48h", popularity: "moyenne" },
  { id: 8, name: "Tlemcen", price: 650, orders: 380, deliveryTime: "72h", popularity: "moyenne" },
  { id: 9, name: "Béjaïa", price: 600, orders: 290, deliveryTime: "72h", popularity: "faible" },
  { id: 10, name: "Tizi Ouzou", price: 550, orders: 610, deliveryTime: "48h", popularity: "élevée" },
];

// Données des produits
const productsData = {
  1: {
    id: 1,
    name: "Hoodie Oversize Essential",
    category: "hoodies",
    price: 8900,
    originalPrice: 12900,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop"
    ],
    rating: 4.9,
    reviews: 128,
    description: "Notre hoodie signature en coton premium 100% biologique. Coupe oversize moderne avec capuche doublée et poche kangourou. Idéal pour un style streetwear décontracté et confortable.",
    colors: [
      { name: "Noir", hex: "#1a1a1a" },
      { name: "Gris", hex: "#6b7280" },
      { name: "Rouge", hex: "#dc2626" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    features: ["100% Coton Bio", "Coupe Oversize", "Lavable en machine", "Fabriqué en Europe"],
  },
  2: {
    id: 2,
    name: "Jean Baggy Vintage",
    category: "jeans",
    price: 11900,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop"
    ],
    rating: 4.8,
    reviews: 89,
    description: "Jean baggy au look vintage avec finition délavée. Denim de haute qualité, confortable et durable. La coupe large offre un style rétro très tendance.",
    colors: [
      { name: "Bleu Vintage", hex: "#3b82f6" },
      { name: "Noir", hex: "#1a1a1a" },
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    features: ["Denim Premium", "Coupe Baggy", "Taille haute", "5 poches"],
  },
  3: {
    id: 3,
    name: "Sneakers Urban Flow",
    category: "chaussures",
    price: 15900,
    originalPrice: 19900,
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&auto=format&fit=crop"
    ],
    rating: 4.7,
    reviews: 256,
    description: "Sneakers urban au design épuré et moderne. Semelle légère et confortable pour un usage quotidien. Le choix parfait pour compléter votre look streetwear.",
    colors: [
      { name: "Blanc", hex: "#ffffff" },
      { name: "Noir", hex: "#1a1a1a" },
    ],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    features: ["Cuir vegan", "Semelle confort", "Respirant", "Légères"],
  },
};

const ProductDetails = () => {
  const navigate = useNavigate();

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const {id} = useParams();
  const productId = parseInt(id) || 1;
  const product = productsData[productId] || productsData[1];



  const deliveryPrice = selectedWilaya ? wilayas.find(w => w.id === selectedWilaya)?.price || 0 : 0;
  const totalPrice = (product.price * quantity) + deliveryPrice;

  const handleAddToCart = () => {
    if (!selectedSize) {
      showNotification('Veuillez sélectionner une taille');
      return;
    }
    if (!selectedWilaya) {
      showNotification('Veuillez sélectionner une wilaya de livraison');
      return;
    }
    showNotification(`${product.name} ajouté au panier`);
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Wilayas populaires (top 4)
  const popularWilayas = [...wilayas]
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 4);

  // Suggestions de wilayas
  const getPopularityColor = (popularity) => {
    switch (popularity) {
      case 'très élevée': return '#10B981';
      case 'élevée': return '#F59E0B';
      case 'moyenne': return '#3B82F6';
      case 'faible': return '#9CA3AF';
      default: return '#6B7280';
    }
  };

  return (
    <div className="product-detail">
      {/* Toast Notification */}
      {showToast && (
        <div className="product-toast">
          <div className="toast-content">
            <span>✓</span>
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="product-header">
        <div className="product-container">
          <div className="header-content">
            <button
              onClick={() => navigate('/Products')}
              className="back-button"
            >
              <ArrowLeft className="back-icon" />
              <span className="back-text">Retour</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="product-logo"
            >
              URBANE
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="cart-icon-btn"
            >
              <ShoppingCart className="cart-icon" />
            </button>
          </div>
        </div>
      </header>

      <div className="product-container product-main">
        <div className="product-grid">
          {/* Images Section */}
          <div className="product-images">
            <div className="main-image-container">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="main-image"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              >
                <Heart className="heart-icon" />
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="thumbnails">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`thumbnail-btn ${activeImage === idx ? 'active' : ''}`}
                >
                  <img src={img} alt="" className="thumbnail-image" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            {/* Title & Rating */}
            <div className="title-section">
              <span className="product-category">
                {product.category}
              </span>
              <h1 className="product-title">
                {product.name}
              </h1>
              <div className="rating-section">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="price-section">
              <span className="current-price">
                {product.price} DA
              </span>
              {product.originalPrice && (
                <span className="original-price">
                  {product.originalPrice} DA
                </span>
              )}
            </div>

            {/* Description */}
            <p className="product-description">
              {product.description}
            </p>

            {/* Colors */}
            <div className="colors-section">
              <h3 className="section-title">
                Couleur: <span className="selected-color">{product.colors[selectedColor].name}</span>
              </h3>
              <div className="colors-grid">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`color-btn ${selectedColor === idx ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor === idx && (
                      <Check className={`check-icon ${color.hex === '#ffffff' ? 'dark' : 'light'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="sizes-section">
              <h3 className="section-title">Taille</h3>
              <div className="sizes-grid">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Wilaya de Livraison avec Communauté */}
            <div className="delivery-section">
              <div className="delivery-header">
                <h3 className="section-title">
                  <Truck className="delivery-icon" />
                  Wilaya de Livraison
                </h3>
                <div className="delivery-community">
                  <Users className="community-icon" />
                  <span className="community-text">Communauté de livraison</span>
                </div>
              </div>
              
              {/* Wilaya Selection */}
              <div className="wilaya-select-container">
                <select
                  value={selectedWilaya || ''}
                  onChange={(e) => setSelectedWilaya(Number(e.target.value))}
                  className="wilaya-select"
                >
                  <option value="">Sélectionnez votre wilaya</option>
                  {wilayas.map((wilaya) => (
                    <option key={wilaya.id} value={wilaya.id}>
                      {wilaya.name} - {wilaya.price} DA
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Community Info */}
              <div className="community-info">
                <div className="community-stats">
                  {selectedWilaya ? (
                    <div className="selected-wilaya-info">
                      <div className="wilaya-stats">
                        <div className="stat-item">
                          <span className="stat-label">Commandes</span>
                          <span className="stat-value">
                            {wilayas.find(w => w.id === selectedWilaya)?.orders.toLocaleString()}
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Livraison</span>
                          <span className="stat-value">
                            {wilayas.find(w => w.id === selectedWilaya)?.deliveryTime}
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Popularité</span>
                          <span 
                            className="stat-value popularity"
                            style={{ color: getPopularityColor(wilayas.find(w => w.id === selectedWilaya)?.popularity) }}
                          >
                            {wilayas.find(w => w.id === selectedWilaya)?.popularity}
                          </span>
                        </div>
                      </div>
                      <p className="community-note">
                        {wilayas.find(w => w.id === selectedWilaya)?.orders.toLocaleString()} commandes 
                        livrées dans cette wilaya
                      </p>
                    </div>
                  ) : (
                    <div className="popular-wilayas">
                      <p className="popular-title">Wilayas populaires</p>
                      <div className="popular-grid">
                        {popularWilayas.map((wilaya) => (
                          <div 
                            key={wilaya.id}
                            className="popular-wilaya"
                            onClick={() => setSelectedWilaya(wilaya.id)}
                          >
                            <span className="popular-name">{wilaya.name}</span>
                            <div className="popular-meta">
                              <span className="popular-price">{wilaya.price} DA</span>
                              <span className="popular-orders">{wilaya.orders.toLocaleString()} commandes</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity & Total */}
            <div className="quantity-total-section">
              <div className="quantity-control">
                <span className="quantity-label">Quantité:</span>
                <div className="quantity-buttons">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn minus"
                  >
                    -
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity-btn plus"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="total-section">
                <p className="total-label">Total</p>
                <p className="total-price">
                  {totalPrice.toLocaleString()} DA
                </p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <ShoppingCart className="cart-btn-icon" />
              Ajouter au Panier
            </button>

            {/* Features */}
            <div className="features-grid">
              <div className="feature-item">
                <Truck className="feature-icon" />
                <span className="feature-text">Livraison rapide</span>
              </div>
              <div className="feature-item">
                <Shield className="feature-icon" />
                <span className="feature-text">Paiement sécurisé</span>
              </div>
              <div className="feature-item">
                <RefreshCcw className="feature-icon" />
                <span className="feature-text">Retour gratuit</span>
              </div>
              <div className="feature-item">
                <Star className="feature-icon" />
                <span className="feature-text">Qualité premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
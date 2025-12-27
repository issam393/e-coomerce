// Products.jsx
import { useState } from 'react';
import { Heart, ShoppingCart, Star, Filter, Grid3X3, LayoutGrid, ArrowUpDown, Search, X, Home } from 'lucide-react';
import './Products.css';
import { useNavigate } from 'react-router-dom';

// Données de produits (utilisez vos propres images ou placeholders)
const products = [
  {
    id: 1,
    name: "Hoodie Oversize Essential",
    category: "hoodies",
    price: 89,
    originalPrice: 129,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop",
    rating: 4.9,
    reviews: 128,
    badge: "Bestseller",
    colors: ["#1a1a1a", "#6b7280", "#dc2626"],
  },
  {
    id: 2,
    name: "Jean Baggy Vintage",
    category: "jeans",
    price: 119,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w-800&auto=format&fit=crop",
    rating: 4.8,
    reviews: 89,
    isNew: true,
    colors: ["#3b82f6", "#1a1a1a"],
  },
  {
    id: 3,
    name: "Sneakers Urban Flow",
    category: "chaussures",
    price: 159,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop",
    rating: 4.7,
    reviews: 256,
    badge: "-20%",
    colors: ["#ffffff", "#1a1a1a", "#dc2626"],
  },
  {
    id: 4,
    name: "Hoodie Premium Cozy",
    category: "hoodies",
    price: 99,
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop",
    rating: 4.9,
    reviews: 67,
    colors: ["#6b7280", "#1a1a1a", "#f5f5dc"],
  },
  {
    id: 5,
    name: "Jean Cargo Street",
    category: "jeans",
    price: 139,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
    rating: 4.6,
    reviews: 45,
    badge: "Tendance",
    colors: ["#1a1a1a", "#4a5568"],
  },
  {
    id: 6,
    name: "Sneakers Classic Leather",
    category: "chaussures",
    price: 189,
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&auto=format&fit=crop",
    rating: 4.8,
    reviews: 112,
    isNew: true,
    colors: ["#1a1a1a", "#8b4513"],
  },
];

const categories = [
  { id: 'all', label: 'Tous', count: products.length },
  { id: 'hoodies', label: 'Hoodies', count: products.filter(p => p.category === 'hoodies').length },
  { id: 'jeans', label: 'Jeans', count: products.filter(p => p.category === 'jeans').length },
  { id: 'chaussures', label: 'Chaussures', count: products.filter(p => p.category === 'chaussures').length },
];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
    showNotification(favorites.includes(id) ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const addToCart = (product) => {
    showNotification(`${product.name} ajouté au panier`);
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="products-page">
      {/* Toast Notification */}
      {showToast && (
        <div className="products-toast">
          <div className="toast-content">
            <span>✓</span>
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="products-header">
        <div className="products-container">
          <div className="header-content">
            <button 
              onClick={() => window.location.href = '/'}
              className="products-logo"
            >
              URBANE
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="cart-icon-btn"
            >
              <ShoppingCart className="icon" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="products-hero">
        <div className="hero-overlay">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
        </div>
        <div className="products-container">
          <div className="hero-content">
            <span className="hero-subtitle">Collection Exclusive</span>
            <h1 className="hero-title">
              Notre
              <span className="hero-gradient"> Collection</span>
            </h1>
            <p className="hero-description">
              Découvrez nos pièces uniques sélectionnées pour leur qualité et leur style incomparable.
            </p>
          </div>
        </div>
      </section>

      <div className="products-container products-main">
        {/* Filters Bar */}
        <div className="filters-bar">
          {/* Category Tabs */}
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
              >
                <span className="tab-label">{category.label}</span>
                <span className={`tab-count ${activeCategory === category.id ? 'active-count' : ''}`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & View Toggle */}
          <div className="search-view-container">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="search-clear"
                >
                  <X className="clear-icon" />
                </button>
              )}
            </div>
            
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <Grid3X3 className="view-icon" />
              </button>
              <button
                onClick={() => setViewMode('large')}
                className={`view-btn ${viewMode === 'large' ? 'active' : ''}`}
              >
                <LayoutGrid className="view-icon" />
              </button>
            </div>

            <button className="sort-btn">
              <ArrowUpDown className="sort-icon" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`products-grid ${viewMode === 'grid' ? 'grid-view' : 'large-view'}`}>
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="product-card"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => navigate(`/Product/${product.id}`)}
            >
              {/* Image Container */}
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                
                {/* Overlay */}
                <div className="image-overlay"></div>
                
                {/* Badges */}
                <div className="product-badges">
                  {product.badge && (
                    <span className="badge badge-primary">
                      {product.badge}
                    </span>
                  )}
                  {product.isNew && (
                    <span className="badge badge-new">
                      Nouveau
                    </span>
                  )}
                </div>
                
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={`favorite-btn ${favorites.includes(product.id) ? 'active' : ''}`}
                >
                  <Heart className="favorite-icon" />
                </button>
                
                {/* Quick Add Button */}
                <div className="quick-add-container">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="quick-add-btn"
                  >
                    <ShoppingCart className="cart-icon" />
                    Ajouter au Panier
                  </button>
                </div>
              </div>
              
              {/* Info */}
              <div className="product-info">
                {/* Colors */}
                <div className="product-colors">
                  {product.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="color-dot"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                {/* Name */}
                <h3 className="product-name">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="product-rating">
                  <div className="rating-stars">
                    <Star className="star-icon" />
                    <span className="rating-value">{product.rating}</span>
                  </div>
                  <span className="reviews-count">({product.reviews} avis)</span>
                </div>
                
                {/* Price */}
                <div className="product-price">
                  <span className="current-price">{product.price}€</span>
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}€</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon-container">
              <Search className="empty-icon" />
            </div>
            <h3 className="empty-title">Aucun produit trouvé</h3>
            <p className="empty-text">Essayez une autre recherche ou catégorie</p>
            <button 
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="empty-btn"
            >
              Voir tous les produits
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
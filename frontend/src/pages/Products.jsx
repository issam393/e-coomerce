import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Filter, Grid3X3, LayoutGrid, ArrowUpDown, Search, X } from 'lucide-react';
import './Products.css';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);
  
  // Toast Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // --- 1. Helper to Get User ID ---
  const getUserId = () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return null;
      const userData = JSON.parse(userString);
      return userData.userId;
    } catch (e) {
      return null;
    }
  };

  // --- 2. Fetch Products from Backend ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:9000/products');
        if (!response.ok) throw new Error('Erreur chargement produits');
        
        const data = await response.json();
        
        // Transform DB data to UI format
        const formattedProducts = data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category ? p.category.toLowerCase() : 'autre',
          price: p.price,
          originalPrice: p.oldPrice > 0 ? p.oldPrice : null, 
          image: p.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop', 
          rating: (Math.random() * (5 - 4) + 4).toFixed(1), 
          reviews: Math.floor(Math.random() * 200) + 20, 
          colors: p.colors ? p.colors.split(',') : [], 
          isNew: p.id > 10, 
          stock: p.stock
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Impossible de charger les produits.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- 3. Filter Logic ---
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- 4. Dynamic Categories ---
  const categories = [
    { id: 'all', label: 'Tous', count: products.length },
    { id: 'hoodies', label: 'Hoodies', count: products.filter(p => p.category === 'hoodies').length },
    { id: 'jeans', label: 'Jeans', count: products.filter(p => p.category === 'jeans').length },
    { id: 'chaussures', label: 'Chaussures', count: products.filter(p => p.category === 'chaussures').length },
  ];

  // --- 5. Helper Functions ---
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
    showNotification(favorites.includes(id) ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Render ---
  if (isLoading) return <div className="products-loading"><div className="spinner"></div><p>Chargement de la collection...</p></div>;
  if (error) return <div className="products-error">{error}</div>;

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
              onClick={() => navigate('/dashboard')}
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
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {/* Image Container */}
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                
                <div className="image-overlay"></div>
                
                {/* Badges */}
                <div className="product-badges">
                  {product.originalPrice && (
                    <span className="badge badge-primary">Promo</span>
                  )}
                  {product.isNew && (
                    <span className="badge badge-new">Nouveau</span>
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
                
                {/* REMOVED: Quick Add Button was here */}
                
              </div>
              
              {/* Info */}
              <div className="product-info">
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
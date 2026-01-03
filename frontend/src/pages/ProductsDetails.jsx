import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RefreshCcw, Check, Users, MapPin } from 'lucide-react';
import './ProductDetails.css';

// --- Helper: Map Color Names to Hex Codes ---
const getColorHex = (colorName) => {
  const map = {
    'noir': '#1a1a1a', 'black': '#1a1a1a',
    'blanc': '#ffffff', 'white': '#ffffff',
    'rouge': '#dc2626', 'red': '#dc2626',
    'bleu': '#3b82f6', 'blue': '#3b82f6',
    'vert': '#10b981', 'green': '#10b981',
    'gris': '#6b7280', 'gray': '#6b7280',
    'jaune': '#f59e0b', 'yellow': '#f59e0b',
    'beige': '#f5f5dc'
  };
  return map[colorName.toLowerCase()] || '#cccccc';
};

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- State ---
  const [product, setProduct] = useState(null);
  
  // Location State (Dynamic from DB)
  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunes] = useState([]);
  
  // Selection State
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedWilaya, setSelectedWilaya] = useState(""); // Stores ID
  const [selectedCommune, setSelectedCommune] = useState(""); // Stores ID
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // --- 1. Get User ID ---
  const getUserId = () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return null;
      return JSON.parse(userString).userId;
    } catch (e) { return null; }
  };

  // --- 2. Fetch Initial Data (Product + Wilayas) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Parallel Fetch: Product Info AND Wilayas List
        const [productRes, wilayaRes] = await Promise.all([
          fetch(`http://localhost:9000/products?id=${id}`),
          fetch(`http://localhost:9000/locations?type=wilaya`)
        ]);

        if (!productRes.ok) throw new Error("Produit introuvable");

        const productData = await productRes.json();
        const wilayaData = await wilayaRes.json();

        // Format Product
        setProduct({
          id: productData.id,
          name: productData.name,
          category: productData.category || 'Collection',
          price: productData.price,
          originalPrice: productData.oldPrice > 0 ? productData.oldPrice : null,
          description: productData.description || "Aucune description disponible.",
          rating: 4.8,
          reviews: 120,
          sizes: productData.sizes ? productData.sizes.split(',') : [],
          colors: productData.colors ? productData.colors.split(',').map(c => ({
            name: c.trim(),
            hex: getColorHex(c.trim())
          })) : [],
          images: [
            productData.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop"
          ]
        });

        // Set Wilayas
        setWilayas(wilayaData);

      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  // --- 3. Fetch Communes when Wilaya Changes ---
  useEffect(() => {
    const fetchCommunes = async () => {
      if (!selectedWilaya) {
        setCommunes([]);
        return;
      }
      try {
        const response = await fetch(`http://localhost:9000/locations?type=commune&wilayaId=${selectedWilaya}`);
        const data = await response.json();
        setCommunes(data);
        setSelectedCommune(""); // Reset commune when wilaya changes
      } catch (err) {
        console.error("Error fetching communes", err);
      }
    };
    fetchCommunes();
  }, [selectedWilaya]);

  // --- 4. Add To Cart ---
  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes.length > 0) {
      showNotification('Veuillez sélectionner une taille');
      return;
    }
    if (!selectedWilaya) {
      showNotification('Veuillez sélectionner une wilaya');
      return;
    }
    if (!selectedCommune) {
      showNotification('Veuillez sélectionner une commune');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      showNotification("Connectez-vous pour acheter");
      return;
    }

    try {
      // Find Objects for names
      const wilayaObj = wilayas.find(w => w.id === parseInt(selectedWilaya));
      const communeObj = communes.find(c => c.id === parseInt(selectedCommune));

      const payload = {
        userId: userId,
        productId: product.id,
        quantity: quantity,
        size: selectedSize,
        color: product.colors[selectedColor]?.name || null,
        // Optional: Sending location text if your backend supports it, 
        // otherwise it just processes the item
        location: `${wilayaObj.name} - ${communeObj.name}`
      };

      const response = await fetch('http://localhost:9000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        showNotification(`${product.name} ajouté au panier`);
      } else {
        showNotification("Erreur lors de l'ajout");
      }
    } catch (err) {
      showNotification("Erreur de connexion serveur");
    }
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Calculations ---
  // Find selected wilaya object to get price
  const activeWilayaObj = wilayas.find(w => w.id === parseInt(selectedWilaya));
  const deliveryPrice = activeWilayaObj ? activeWilayaObj.price : 0;
  const totalPrice = product ? (product.price * quantity) + deliveryPrice : 0;

  if (isLoading) return <div className="product-loading"><div className="spinner"></div></div>;
  if (error) return <div className="product-error">{error}</div>;
  if (!product) return <div className="product-error">Produit introuvable</div>;

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
            <button onClick={() => navigate('/products')} className="back-button">
              <ArrowLeft className="back-icon" />
              <span className="back-text">Retour</span>
            </button>
            <button onClick={() => navigate('/')} className="product-logo">
              URBANE
            </button>
            <button onClick={() => navigate('/dashboard')} className="cart-icon-btn">
              <ShoppingCart className="cart-icon" />
            </button>
          </div>
        </div>
      </header>

      <div className="product-container product-main">
        <div className="product-grid">
          
          {/* LEFT: Images Section */}
          <div className="product-images">
            <div className="main-image-container">
              <img src={product.images[activeImage]} alt={product.name} className="main-image" />
              <button onClick={() => setIsFavorite(!isFavorite)} className={`favorite-btn ${isFavorite ? 'active' : ''}`}>
                <Heart className="heart-icon" />
              </button>
            </div>
            {/* Thumbnails (if multiple) */}
            {product.images.length > 1 && (
                <div className="thumbnails">
                {product.images.map((img, idx) => (
                    <button key={idx} onClick={() => setActiveImage(idx)} className={`thumbnail-btn ${activeImage === idx ? 'active' : ''}`}>
                    <img src={img} alt="" className="thumbnail-image" />
                    </button>
                ))}
                </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="product-info-section">
            <div className="title-section">
              <span className="product-category">{product.category}</span>
              <h1 className="product-title">{product.name}</h1>
              <div className="rating-section">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`} />
                  ))}
                </div>
                <span className="rating-text">{product.rating} ({product.reviews} avis)</span>
              </div>
            </div>

            <div className="price-section">
              <span className="current-price">{product.price} DA</span>
              {product.originalPrice && <span className="original-price">{product.originalPrice} DA</span>}
            </div>

            <p className="product-description">{product.description}</p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="colors-section">
                <h3 className="section-title">Couleur: <span className="selected-color">{product.colors[selectedColor]?.name}</span></h3>
                <div className="colors-grid">
                  {product.colors.map((color, idx) => (
                    <button key={idx} onClick={() => setSelectedColor(idx)} className={`color-btn ${selectedColor === idx ? 'active' : ''}`} style={{ backgroundColor: color.hex }}>
                      {selectedColor === idx && <Check className={`check-icon ${color.hex === '#ffffff' ? 'dark' : 'light'}`} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="sizes-section">
                <h3 className="section-title">Taille</h3>
                <div className="sizes-grid">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`size-btn ${selectedSize === size ? 'active' : ''}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- DYNAMIC LOCATION SELECTOR --- */}
            <div className="delivery-section">
              <div className="delivery-header">
                <h3 className="section-title"><Truck className="delivery-icon" /> Livraison</h3>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                
                {/* 1. Wilaya Select */}
                <div className="wilaya-select-container">
                    <label style={{fontSize: '12px', color: '#666', marginBottom: '5px', display: 'block'}}>Wilaya</label>
                    <select 
                        value={selectedWilaya} 
                        onChange={(e) => setSelectedWilaya(e.target.value)} 
                        className="wilaya-select"
                    >
                        <option value="">Sélectionnez votre wilaya</option>
                        {wilayas.map((w) => (
                            <option key={w.id} value={w.id}>{w.id} - {w.name} (+{w.price} DA)</option>
                        ))}
                    </select>
                </div>

                {/* 2. Commune Select */}
                <div className="wilaya-select-container">
                    <label style={{fontSize: '12px', color: '#666', marginBottom: '5px', display: 'block'}}>Commune</label>
                    <select 
                        value={selectedCommune} 
                        onChange={(e) => setSelectedCommune(e.target.value)} 
                        className="wilaya-select"
                        disabled={!selectedWilaya}
                    >
                        <option value="">Sélectionnez votre commune</option>
                        {communes.length > 0 ? (
                            communes.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))
                        ) : (
                            <option disabled>{selectedWilaya ? "Chargement..." : "Veuillez choisir une wilaya"}</option>
                        )}
                    </select>
                </div>

                {/* Delivery Info Box */}
                {activeWilayaObj && (
                    <div style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '5px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                            <span style={{color: '#64748b', fontSize: '14px'}}>Frais de livraison:</span>
                            <span style={{fontWeight: 'bold', color: '#10b981'}}>{activeWilayaObj.price} DA</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{color: '#64748b', fontSize: '14px'}}>Destination:</span>
                            <span style={{fontWeight: '500'}}>{activeWilayaObj.name}</span>
                        </div>
                    </div>
                )}

              </div>
            </div>

            {/* Quantity & Total */}
            <div className="quantity-total-section">
              <div className="quantity-control">
                <span className="quantity-label">Quantité:</span>
                <div className="quantity-buttons">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="quantity-btn minus">-</button>
                  <span className="quantity-value">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="quantity-btn plus">+</button>
                </div>
              </div>
              <div className="total-section">
                <p className="total-label">Total</p>
                <p className="total-price">{totalPrice.toLocaleString()} DA</p>
              </div>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <ShoppingCart className="cart-btn-icon" />
              Ajouter au Panier
            </button>

            {/* Features */}
            <div className="features-grid">
              <div className="feature-item"><Truck className="feature-icon" /><span className="feature-text">Livraison 58 Wilayas</span></div>
              <div className="feature-item"><Shield className="feature-icon" /><span className="feature-text">Paiement à la livraison</span></div>
              <div className="feature-item"><RefreshCcw className="feature-icon" /><span className="feature-text">Echange gratuit</span></div>
              <div className="feature-item"><MapPin className="feature-icon" /><span className="feature-text">Suivi de commande</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
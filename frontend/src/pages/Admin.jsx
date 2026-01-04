"use client"

import { useState, useEffect } from "react"
import { FaArrowLeftLong } from "react-icons/fa6"
import { AiOutlineUsergroupDelete } from "react-icons/ai"
import { BsBox, BsCartCheck } from "react-icons/bs"
import { CiSearch, CiMail, CiPhone, CiLocationOn } from "react-icons/ci"
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi"
import { MdOutlineAdd, MdVisibility, MdBlock, MdDelete, MdCheckCircle, MdDevices, MdChair, MdAccessTime, MdLocationOn, MdArrowForward, MdEdit } from "react-icons/md"
import { VscDiffModified } from "react-icons/vsc";
import { IoMdClose } from "react-icons/io";
import { LuUserCheck } from "react-icons/lu";
import { FiUserX, FiUsers, FiUserMinus } from "react-icons/fi";
import { GiClothes, GiShorts } from "react-icons/gi";

import "./Admin.css"

function Admin() {
  // Tabs: 'users', 'products', 'orders', 'locations'
  const [activeTab, setActiveTab] = useState('users'); 
  
  // Search & Filter Global
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  // Filters
  const [filterUserStatus, setFilterUserStatus] = useState("all"); 
  const [filterStatus, setFilterStatus] = useState("all"); 
  const [filterDate, setFilterDate] = useState(""); 

  // Data States
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunes] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // Location UI State
  const [selectedWilaya, setSelectedWilaya] = useState(null); // The wilaya currently selected to view communes

  // Modal States
  const [viewProfile, setViewProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  // Form States
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);

  // Location Modal States
  const [showAddWilaya, setShowAddWilaya] = useState(false);
  const [showAddCommune, setShowAddCommune] = useState(false);

  // Forms Data
  const [productForm, setProductForm] = useState({
    id: null, name: "", price: "", oldPrice: "", category: "Hoodies",
    stock: "", sizes: "", colors: "", image: "", description: ""
  });

  const [locationForm, setLocationForm] = useState({ id: null, name: "", price: "" }); 

  // --- 1. INITIAL FETCH ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, userRes, orderRes, wilayaRes] = await Promise.all([
        fetch('http://localhost:9000/products'),
        fetch('http://localhost:9000/users'),
        fetch('http://localhost:9000/orders?view=all'),
        fetch('http://localhost:9000/locations?type=wilaya')
      ]);

      setProducts(await prodRes.json());
      setClients(await userRes.json());
      setOrders(await orderRes.json());
      setWilayas(await wilayaRes.json());
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- 2. LOCATION LOGIC ---
  const fetchCommunes = async (wilayaId) => {
      try {
          const res = await fetch(`http://localhost:9000/locations?type=commune&wilayaId=${wilayaId}`);
          setCommunes(await res.json());
      } catch(e) { console.error(e); }
  };

  const handleSelectWilaya = (wilaya) => {
      setSelectedWilaya(wilaya);
      fetchCommunes(wilaya.id);
  };

  // Open Modal for Editing Wilaya
  const openEditWilaya = (wilaya) => {
      setLocationForm({ id: wilaya.id, name: wilaya.name, price: wilaya.price });
      setShowAddWilaya(true);
  };

  // Open Modal for Adding Wilaya
  const openAddWilaya = () => {
      setLocationForm({ id: null, name: "", price: "" });
      setShowAddWilaya(true);
  };

  const submitWilaya = async (e) => {
      e.preventDefault();
      
      // Determine Method: PUT if ID exists, POST otherwise
      const method = locationForm.id ? 'PUT' : 'POST';

      try {
          await fetch('http://localhost:9000/locations?type=wilaya', {
              method: method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  id: locationForm.id, 
                  name: locationForm.name, 
                  price: locationForm.price 
              })
          });
          setShowAddWilaya(false);
          setLocationForm({ id: null, name: "", price: "" });
          
          // Refresh wilayas
          const res = await fetch('http://localhost:9000/locations?type=wilaya');
          setWilayas(await res.json());
      } catch(e) { alert("Erreur opération wilaya"); }
  };

  const deleteWilaya = async (id) => {
      if(!window.confirm("Supprimer cette wilaya ?")) return;
      try {
          await fetch(`http://localhost:9000/locations?type=wilaya&id=${id}`, { method: 'DELETE' });
          const res = await fetch('http://localhost:9000/locations?type=wilaya');
          setWilayas(await res.json());
          if(selectedWilaya && selectedWilaya.id === id) {
              setSelectedWilaya(null);
              setCommunes([]);
          }
      } catch(e) { alert("Erreur suppression"); }
  };

  const submitCommune = async (e) => {
      e.preventDefault();
      if(!selectedWilaya) return;
      try {
          await fetch('http://localhost:9000/locations?type=commune', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: locationForm.name, wilayaId: selectedWilaya.id })
          });
          setShowAddCommune(false);
          setLocationForm({ id: null, name: "", price: "" });
          fetchCommunes(selectedWilaya.id);
      } catch(e) { alert("Erreur ajout commune"); }
  };

  const deleteCommune = async (id) => {
      if(!window.confirm("Supprimer cette commune ?")) return;
      try {
          await fetch(`http://localhost:9000/locations?type=commune&id=${id}`, { method: 'DELETE' });
          fetchCommunes(selectedWilaya.id);
      } catch(e) { alert("Erreur suppression"); }
  };

  // --- 3. CALCULATE STATISTICS ---
  const clientStats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'ACTIVE').length,
    inactive: clients.filter(c => c.status === 'INACTIVE').length,
    blocked: clients.filter(c => c.status === 'BLOCKED').length
  };

  const productStats = {
    total: products.length,
    clothes: products.filter(p => p.category === 'Vêtements' || p.category === 'Hoodies').length,
    electronics: products.filter(p => p.category === 'Électronique').length,
    furniture: products.filter(p => p.category === 'Meubles').length,
    shorts: products.filter(p => p.category === 'Shorts & Bas').length
  };

  const orderStats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'Livré').length,
    pending: orders.filter(o => o.status !== 'Livré' && o.status !== 'Annulé').length,
    cancelled: orders.filter(o => o.status === 'Annulé').length
  };

  // --- 4. LOGIC HELPERS ---
  const getEnrichedOrders = () => {
    return orders.map(order => {
      const client = clients.find(c => c.id === order.userId) || {};
      let productNamesString = "";
      if (order.items && Array.isArray(order.items)) {
         productNamesString = order.items.map(item => {
            const p = products.find(prod => prod.id === item.productId);
            return p ? p.name : "";
         }).join(" ");
      }
      return { ...order, clientDetails: client, searchableProductNames: productNamesString };
    });
  };

  // --- 5. FILTERING ---
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterUserStatus === "all" || c.status === filterUserStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrichedOrders = getEnrichedOrders();
  const filteredOrders = enrichedOrders.filter(order => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = order.id.toString().includes(q) ||
        (order.status && order.status.toLowerCase().includes(q)) ||
        (order.clientDetails.name && order.clientDetails.name.toLowerCase().includes(q)) || 
        (order.searchableProductNames && order.searchableProductNames.toLowerCase().includes(q));
    
    const matchesStatus = filterStatus === "all" || 
        (filterStatus === "pending" && order.status !== "Livré" && order.status !== "Annulé") ||
        (filterStatus === "completed" && order.status === "Livré") ||
        (filterStatus === "cancelled" && order.status === "Annulé");

    const orderDateStr = order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : "";
    const matchesDate = filterDate === "" || orderDateStr === filterDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredWilayas = wilayas.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // --- ACTION HANDLERS ---
  const handleBlockUser = async (id, currentStatus) => {
    const newStatus = currentStatus === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    if(!window.confirm(`Voulez-vous vraiment ${newStatus === 'BLOCKED' ? 'bloquer' : 'débloquer'} ce client ?`)) return;
    try {
      await fetch('http://localhost:9000/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
      fetchData(); 
    } catch(e) { alert("Erreur serveur"); }
  };

  const handleDeleteUser = async (id) => {
    if(!window.confirm("Supprimer définitivement ce client ?")) return;
    try { await fetch(`http://localhost:9000/users?id=${id}`, { method: 'DELETE' }); fetchData(); } catch(e) { alert("Erreur suppression"); }
  };

  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Supprimer ce produit ?")) return;
    try { await fetch(`http://localhost:9000/products?id=${id}`, { method: 'DELETE' }); fetchData(); } catch(e) { alert("Erreur suppression"); }
  };

  const submitProductForm = async (e) => {
    e.preventDefault();
    const method = showEditProduct ? 'PUT' : 'POST';
    try {
      await fetch('http://localhost:9000/products', { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productForm) });
      setShowAddProduct(false); setShowEditProduct(false); fetchData();
    } catch(e) { alert("Erreur enregistrement"); }
  };

  const openEditProduct = (prod) => {
    setProductForm({ ...prod, oldPrice: prod.oldPrice || "", sizes: prod.sizes || "", colors: prod.colors || "", image: prod.image || "", description: prod.description || "" });
    setShowEditProduct(true); setOpenMenu(null);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try { await fetch('http://localhost:9000/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status: newStatus }) }); fetchData(); } catch(e) { alert("Erreur maj status"); }
  };

  // --- RENDER ---
  return (
    <div className="section_container">
      {/* Top Nav */}
      <div className="AdminNav">
        <div className="arrow"><FaArrowLeftLong onClick={() => window.location.href = '/'} style={{cursor:'pointer'}} /></div>
        <div className="text">Administration <br /><span className="gestion">Panel de Gestion</span></div>
      </div>

      {/* Tabs */}
      <div className="buttons_container">
        <button onClick={() => {setActiveTab('users'); setSearchQuery("");}} className={`client ${activeTab === 'users' ? "active" : ""}`}><AiOutlineUsergroupDelete /> Clients</button>
        <button onClick={() => {setActiveTab('products'); setSearchQuery("");}} className={`product ${activeTab === 'products' ? "active" : ""}`}><BsBox /> Produits</button>
        <button onClick={() => {setActiveTab('orders'); setSearchQuery("");}} className={`product ${activeTab === 'orders' ? "active" : ""}`}><BsCartCheck /> Commandes</button>
        <button onClick={() => {setActiveTab('locations'); setSearchQuery("");}} className={`product ${activeTab === 'locations' ? "active" : ""}`}><MdLocationOn /> Zones</button>
      </div>

      {/* ================= USERS TAB ================= */}
      {activeTab === 'users' && (
        <div className="client_container_box">
          <div className="stats_container">
            <div className="stat_card"><FiUsers className="stat_icon" /><div className="stat_number">{clientStats.total}</div><div className="stat_label">Total clients</div></div>
            <div className="stat_card"><LuUserCheck className="stat_icon" /><div className="stat_number">{clientStats.active}</div><div className="stat_label">Actifs</div></div>
            <div className="stat_card"><FiUserMinus className="stat_icon" /><div className="stat_number">{clientStats.inactive}</div><div className="stat_label">Inactifs</div></div>
            <div className="stat_card"><FiUserX className="stat_icon" /><div className="stat_number">{clientStats.blocked}</div><div className="stat_label">Bloqués</div></div>
          </div>

          <div className="selection_row">
            <div className="input_container"><CiSearch /><input type="text" placeholder="Rechercher (Nom, Email)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <select className="input_container" style={{ width: '200px', flex: 'none', cursor: 'pointer', outline:'none' }} value={filterUserStatus} onChange={(e) => setFilterUserStatus(e.target.value)}>
                <option value="all">Tout Statuts</option><option value="ACTIVE">Actif</option><option value="BLOCKED">Bloqué</option>
            </select>
          </div>

          <table>
            <thead><tr><th>Nom</th><th>Email</th><th>Role</th><th>Statut</th><th className="three"><PiDotsThreeOutlineVerticalBold /></th></tr></thead>
            <tbody>
              {filteredClients.map(client => (
                  <tr key={client.id}>
                  <td>{client.name}</td><td>{client.email}</td><td>{client.role}</td><td><span className={`status-badge ${client.status?.toLowerCase()}`}>{client.status}</span></td>
                  <td className="menu_cell">
                      <button onClick={() => setOpenMenu(openMenu === client.id ? null : client.id)} className="menu_btn"><PiDotsThreeOutlineVerticalBold /></button>
                      {openMenu === client.id && (<div className="show_options">
                          <div className="option_item" onClick={() => { setSelectedProfile(client); setViewProfile(true); setOpenMenu(null); }}><MdVisibility className="option_icon view" /> Voir Profil</div>
                          <div className="option_item" onClick={() => handleBlockUser(client.id, client.status)}><MdBlock className="option_icon block" /> {client.status === 'BLOCKED' ? 'Débloquer' : 'Bloquer'}</div>
                          <div className="option_item" onClick={() => handleDeleteUser(client.id)}><MdDelete className="option_icon delete" /> Supprimer</div>
                      </div>)}
                  </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= PRODUCTS TAB ================= */}
      {activeTab === 'products' && (
        <div className="products_container_box">
          <div className="stats_container">
            <div className="stat_card"><BsBox className="stat_icon" /><div className="stat_number">{productStats.total}</div><div className="stat_label">Total Produits</div></div>
            <div className="stat_card"><GiClothes className="stat_icon" /><div className="stat_number">{productStats.clothes}</div><div className="stat_label">Vêtements</div></div>
            <div className="stat_card"><MdDevices className="stat_icon" /><div className="stat_number">{productStats.electronics}</div><div className="stat_label">Électronique</div></div>
            <div className="stat_card"><MdChair className="stat_icon" /><div className="stat_number">{productStats.furniture}</div><div className="stat_label">Meubles</div></div>
             <div className="stat_card"><GiShorts className="stat_icon" /><div className="stat_number">{productStats.shorts}</div><div className="stat_label">Shorts & Bas</div></div>
          </div>
          <div className="selection_row">
            <div className="input_container"><CiSearch /><input type="text" placeholder="Rechercher produit..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <button onClick={() => { setProductForm({ id: null, name: "", price: "", oldPrice: "", category: "Hoodies", stock: "", sizes: "", colors: "", image: "", description: "" }); setShowAddProduct(true); }} className="add_product_btn"><MdOutlineAdd /> Ajouter Produit</button>
          </div>
          <table>
            <thead><tr><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th className="three"><PiDotsThreeOutlineVerticalBold /></th></tr></thead>
            <tbody>
              {filteredProducts.map(prod => (
                <tr key={prod.id}>
                  <td>{prod.name}</td><td>{prod.category}</td><td>{prod.price} DA</td><td>{prod.stock}</td>
                  <td className="menu_cell">
                    <button onClick={() => setOpenMenu(openMenu === prod.id ? null : prod.id)} className="menu_btn"><PiDotsThreeOutlineVerticalBold /></button>
                    {openMenu === prod.id && (<div className="show_options">
                        <div className="option_item" onClick={() => openEditProduct(prod)}><VscDiffModified className="option_icon edit" /> Modifier</div>
                        <div className="option_item" onClick={() => handleDeleteProduct(prod.id)}><MdDelete className="option_icon delete" /> Supprimer</div>
                    </div>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ORDERS TAB ================= */}
      {activeTab === 'orders' && (
        <div className="client_container_box">
          <div className="stats_container">
            <div className="stat_card"><BsCartCheck className="stat_icon" /><div className="stat_number">{orderStats.total}</div><div className="stat_label">Total Commandes</div></div>
            <div className="stat_card"><MdCheckCircle className="stat_icon" /><div className="stat_number">{orderStats.delivered}</div><div className="stat_label">Livrées</div></div>
            <div className="stat_card"><MdAccessTime className="stat_icon" /><div className="stat_number">{orderStats.pending}</div><div className="stat_label">En Cours</div></div>
            <div className="stat_card"><MdBlock className="stat_icon" /><div className="stat_number">{orderStats.cancelled}</div><div className="stat_label">Annulées</div></div>
          </div>
          <div className="selection_row" style={{gap: '10px'}}>
            <div className="input_container" style={{flex: 2}}><CiSearch /><input type="text" placeholder="Chercher (Client, Produit, ID)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <select className="input_container" style={{flex: 1, padding: '0 10px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', outline:'none'}} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="all">Tout Statuts</option><option value="pending">En Cours</option><option value="completed">Livré</option><option value="cancelled">Annulé</option></select>
            <input type="date" className="input_container" style={{flex: 1, padding: '0 10px', border: '1px solid #ddd', borderRadius: '8px'}} value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
          <table>
            <thead><tr><th>ID</th><th>Client Info</th><th>Date</th><th>Total</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredOrders.length === 0 ? ( <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Aucune commande trouvée</td></tr> ) : (
                filteredOrders.map(order => (
                    <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td><div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', lineHeight: '1.2'}}><span style={{fontWeight: 'bold', fontSize: '14px'}}>{order.clientDetails.name || `User ID: ${order.userId}`}</span><span style={{fontSize: '12px', color: '#666', display:'flex', alignItems:'center', gap:'4px'}}><CiMail /> {order.clientDetails.email || "N/A"}</span><span style={{fontSize: '12px', color: '#666', display:'flex', alignItems:'center', gap:'4px'}}><CiPhone /> {order.clientDetails.phoneNumber || "N/A"}</span><span style={{fontSize: '14px'}}><CiLocationOn/>{order.clientDetails.address || "N/A"}</span></div></td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td><td>{order.totalPrice} DA</td>
                    <td><span className={`status-badge ${order.status === 'Livré' ? 'active' : order.status === 'Annulé' ? 'blocked' : 'pending'}`}>{order.status}</span></td>
                    <td className="action_cell">
                        {order.status !== 'Livré' && order.status !== 'Annulé' && (<button onClick={() => handleUpdateOrderStatus(order.id, 'Livré')} className="menu_btn" title="Marquer comme livré"><MdCheckCircle style={{color: 'green'}} /></button>)}
                        {order.status !== 'Annulé' && order.status !== 'Livré' && (<button onClick={() => handleUpdateOrderStatus(order.id, 'Annulé')} className="menu_btn" title="Annuler"><MdBlock style={{color: 'red'}} /></button>)}
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= LOCATIONS TAB ================= */}
      {activeTab === 'locations' && (
          <div className="client_container_box" style={{display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
              
              {/* LEFT: WILAYAS LIST */}
              <div style={{flex: 1, background: 'white', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '20px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                      <h3 style={{fontSize: '18px', fontWeight: 'bold'}}>Wilayas</h3>
                      <button onClick={openAddWilaya} className="add_product_btn" style={{padding: '8px 12px', fontSize: '13px'}}>
                          <MdOutlineAdd /> Ajouter
                      </button>
                  </div>
                  
                  {/* Search Wilaya */}
                  <div className="input_container" style={{marginBottom: '15px'}}>
                      <CiSearch />
                      <input type="text" placeholder="Rechercher wilaya..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>

                  <div style={{maxHeight: '500px', overflowY: 'auto'}}>
                      <table style={{width: '100%'}}>
                          <thead><tr><th>ID</th><th>Nom</th><th>Prix Livr.</th><th>Actions</th></tr></thead>
                          <tbody>
                              {filteredWilayas.map(w => (
                                  <tr key={w.id} style={{cursor: 'pointer', background: selectedWilaya?.id === w.id ? '#f8fafc' : 'transparent'}} onClick={() => handleSelectWilaya(w)}>
                                      <td>{w.id}</td>
                                      <td><b>{w.name}</b></td>
                                      <td>{w.price} DA</td>
                                      <td className="action_cell">
                                          <button onClick={(e) => {e.stopPropagation(); handleSelectWilaya(w);}} className="menu_btn" title="Voir Communes"><MdArrowForward /></button>
                                          <button onClick={(e) => {e.stopPropagation(); openEditWilaya(w);}} className="menu_btn" style={{color: '#3b82f6'}} title="Modifier"><MdEdit /></button>
                                          <button onClick={(e) => {e.stopPropagation(); deleteWilaya(w.id);}} className="menu_btn" style={{color: 'red'}} title="Supprimer"><MdDelete /></button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* RIGHT: COMMUNES LIST */}
              <div style={{flex: 1, background: 'white', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '20px'}}>
                  {selectedWilaya ? (
                      <>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                            <div>
                                <h3 style={{fontSize: '18px', fontWeight: 'bold'}}>Communes</h3>
                                <span style={{fontSize: '13px', color: '#64748b'}}>Wilaya: {selectedWilaya.name}</span>
                            </div>
                            <button onClick={() => { setLocationForm({id: null, name: "", price: ""}); setShowAddCommune(true); }} className="add_product_btn" style={{padding: '8px 12px', fontSize: '13px'}}>
                                <MdOutlineAdd /> Ajouter
                            </button>
                        </div>

                        <div style={{maxHeight: '500px', overflowY: 'auto'}}>
                            {communes.length === 0 ? <p style={{color: '#94a3b8', textAlign:'center'}}>Aucune commune.</p> : (
                                <table style={{width: '100%'}}>
                                    <thead><tr><th>Nom</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {communes.map(c => (
                                            <tr key={c.id}>
                                                <td>{c.name}</td>
                                                <td className="action_cell">
                                                    <button onClick={() => deleteCommune(c.id)} className="menu_btn" style={{color: 'red'}}><MdDelete /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                      </>
                  ) : (
                      <div style={{height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8'}}>
                          <CiLocationOn style={{fontSize: '40px', marginBottom: '10px'}}/>
                          <p>Sélectionnez une wilaya pour gérer ses communes.</p>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* --- MODAL: ADD PRODUCT/EDIT --- */}
      {(showAddProduct || showEditProduct) && (
        <div className="profile-overlay">
          <div className="profile-modal">
            <div className="profile-header"><h2>{showEditProduct ? "Modifier Produit" : "Ajouter Produit"}</h2><button onClick={() => { setShowAddProduct(false); setShowEditProduct(false); }} className="close-button"><IoMdClose /></button></div>

            <form className="add-product-form" onSubmit={submitProductForm}>
              
              {/* Name */}
              <div className="form-group">
                <label>Nom du produit</label>
                <input 
                  type="text" 
                  value={productForm.name} 
                  onChange={e => setProductForm({...productForm, name: e.target.value})} 
                  required 
                />
              </div>

              {/* Prices */}
              <div className="prix">
                <div className="form-group">
                  <label>Prix Actuel (DA)</label>
                  <input 
                    type="number" 
                    value={productForm.price} 
                    onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Ancien Prix (DA) <small>(Optionnel)</small></label>
                  <input 
                    type="number" 
                    value={productForm.oldPrice} 
                    onChange={e => setProductForm({...productForm, oldPrice: parseFloat(e.target.value) || 0})} 
                  />
                </div>
              </div>

              {/* Stock & Category */}
              <div className="prix">
                <div className="form-group">
                  <label>Stock</label>
                  <input 
                    type="number" 
                    value={productForm.stock} 
                    onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Catégorie</label>
                  <select 
                    value={productForm.category} 
                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                  >
                    <option value="Hoodies">Hoodies</option>
                    <option value="Vêtements">Vêtements</option>
                    <option value="Électronique">Électronique</option>
                    <option value="Meubles">Meubles</option>
                    <option value="Shorts & Bas">Shorts & Bas</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="form-group">
                <label>URL de l'image</label>
                <input 
                  type="text" 
                  placeholder="http://..."
                  value={productForm.image} 
                  onChange={e => setProductForm({...productForm, image: e.target.value})} 
                />
              </div>

              {/* Sizes & Colors */}
              <div className="prix">
                <div className="form-group">
                  <label>Tailles (séparées par virgule)</label>
                  <input 
                    type="text" 
                    placeholder="S,M,L,XL"
                    value={productForm.sizes} 
                    onChange={e => setProductForm({...productForm, sizes: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Couleurs (séparées par virgule)</label>
                  <input 
                    type="text" 
                    placeholder="Rouge,Bleu,Noir"
                    value={productForm.colors} 
                    onChange={e => setProductForm({...productForm, colors: e.target.value})} 
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="3"
                  value={productForm.description} 
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                ></textarea>
              </div>

              <div className="profile-footer">
                <button type="submit" className="close-btn">
                  {showEditProduct ? "Sauvegarder" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD/EDIT WILAYA --- */}
      {showAddWilaya && (
        <div className="profile-overlay">
          <div className="profile-modal" style={{maxWidth: '400px'}}>
            <div className="profile-header"><h2>{locationForm.id ? "Modifier Wilaya" : "Ajouter Wilaya"}</h2><button onClick={() => setShowAddWilaya(false)} className="close-button"><IoMdClose /></button></div>
            <form className="add-product-form" onSubmit={submitWilaya}>
                <div className="form-group"><label>Nom de la Wilaya</label><input type="text" value={locationForm.name} onChange={e => setLocationForm({...locationForm, name: e.target.value})} required /></div>
                <div className="form-group"><label>Prix Livraison (DA)</label><input type="number" value={locationForm.price} onChange={e => setLocationForm({...locationForm, price: e.target.value})} required /></div>
                <div className="profile-footer"><button type="submit" className="close-btn">{locationForm.id ? "Mettre à jour" : "Ajouter"}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD COMMUNE --- */}
      {showAddCommune && (
        <div className="profile-overlay">
          <div className="profile-modal" style={{maxWidth: '400px'}}>
            <div className="profile-header"><h2>Ajouter Commune</h2><button onClick={() => setShowAddCommune(false)} className="close-button"><IoMdClose /></button></div>
            <form className="add-product-form" onSubmit={submitCommune}>
                <div className="form-group"><label>Nom de la Commune</label><input type="text" value={locationForm.name} onChange={e => setLocationForm({...locationForm, name: e.target.value})} required /></div>
                <div className="profile-footer"><button type="submit" className="close-btn">Ajouter</button></div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: VIEW PROFILE --- */}
      {viewProfile && selectedProfile && (
        <div className="profile-overlay">
          <div className="profile-modal">
            <div className="profile-header"><h2>Profil Client</h2><button onClick={() => setViewProfile(false)} className="close-button"><IoMdClose /></button></div>
            <div className="profile-section"><div className="profile-avatar"><span>{selectedProfile.name.charAt(0).toUpperCase()}</span></div><div className="profile-name-status"><h3>{selectedProfile.name}</h3><p className="status">{selectedProfile.status}</p></div></div>
            <div className="contact-section"><div className="contact-item"><CiMail /> <span>{selectedProfile.email}</span></div><div className="contact-item"><CiPhone /> <span>{selectedProfile.phoneNumber || "Non renseigné"}</span></div><div className="contact-item"><CiLocationOn /> <span>{selectedProfile.address || "Non renseigné"}</span></div></div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Admin
"use client"

import { useState } from "react"
import { FaArrowLeftLong } from "react-icons/fa6"
import { AiOutlineUsergroupDelete } from "react-icons/ai"
import { BsBox } from "react-icons/bs"
import { LuUserCheck } from "react-icons/lu"
import { FiUserX, FiUsers, FiUserMinus } from "react-icons/fi"
import { CiSearch } from "react-icons/ci"
import { CiFilter } from "react-icons/ci"
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi"
import { MdOutlineAdd } from "react-icons/md"
import { GiClothes } from "react-icons/gi"
import { CiMail } from "react-icons/ci";
import { MdChair ,MdDevices} from "react-icons/md"
import { GiShorts } from "react-icons/gi"
import { MdVisibility, MdBlock, MdDelete } from "react-icons/md"
import { CiPhone } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { IoMdClose } from "react-icons/io";
import { VscDiffModified } from "react-icons/vsc";
import { AiOutlineClose } from "react-icons/ai";

import "./Admin.css"
function Admin() {
  const [isProduct, setisProduct] = useState(false)
  const [Statut, setStatus] = useState("")
  const [openMenu, setOpenMenu] = useState(null)
  const [viewProfile, setViewProfile] = useState(false)
  const [AddForm , setAddForm] = useState(false)
  const [AddModifie , setAddModifie] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    oldPrice: "",
    category: "Hoodies",
    stock: "",
    sizes: "",
    colors: "",
    imageUrl: "",
    description: ""
  });

  const handleProfileView = () => {
    setViewProfile(true)
  }

  const handleModifyProduct = () => {
    setAddModifie(true)
  }
  const CloseModifyProduct = () => {
    setAddModifie(false)
  }

  const OpenFormAdd = ()=>{
    setAddForm(true)
  }
  const CloseFormAdd = ()=>{
    setAddForm(false)
  }

  const handleClick = (val) => {
    setisProduct(val)
  }

  const toggleOptions = (rowId) => {
    setOpenMenu(openMenu === rowId ? null : rowId)
  }

  return (
    <div className="section_container">
      <div className="AdminNav">
        <div className="arrow">
          <FaArrowLeftLong />
        </div>
        <div className="text">
          Administaration <br />
          <span className="gestion">Gestion des clients et produits</span>
        </div>
      </div>
      <div className="buttons_container">
        <button onClick={() => handleClick(false)} className={`client ${!isProduct ? "active" : ""}`}>
          <AiOutlineUsergroupDelete /> Clients
        </button>

        <button onClick={() => handleClick(true)} className={`product ${isProduct ? "active" : ""}`}>
          <BsBox /> Produits
        </button>
      </div>
      {!isProduct && (
        <div className="client_container_box">
          <div className="status_grid">
            <div className="box_grid">
              <FiUsers />
              <div className="number">6</div>
              <div className="description">Total clients</div>
            </div>
            <div className="box_grid">
              <LuUserCheck />
              <div className="number">4</div>
              <div className="description">Actifs</div>
            </div>
            <div className="box_grid">
              <FiUserMinus />
              <div className="number">3</div>
              <div className="description">Inactifs</div>
            </div>
            <div className="box_grid">
              <FiUserX />
              <div className="number">2</div>
              <div className="description">Bloqués</div>
            </div>
          </div>
          <div className="selection_row">
            <div className="input_container">
              <CiSearch />
              <input type="text" />
            </div>
            <div className="filter_clients">
              <CiFilter />
              <select name="filter" value={Statut} onChange={(e) => setStatus(e.target.value)}>
                <option value="" disabled hidden>
                  Filtrer par statut
                </option>
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
                <option value="blocked">Bloqués</option>
              </select>
            </div>
          </div>
          <table>
            <thead>
              <th>Client</th>
              <th>Wilaya</th>
              <th>Commandes</th>
              <th>Total dépensé</th>
              <th>Statut</th>
              <th className="three">
                <PiDotsThreeOutlineVerticalBold />{" "}
              </th>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>Alger</td>
                <td>5</td>
                <td>150,000 DZD</td>
                <td>Actif</td>
                <td className="menu_cell">
                  <button onClick={() => toggleOptions("client-1")} className="menu_btn">
                    <PiDotsThreeOutlineVerticalBold />
                  </button>
                  {openMenu === "client-1" && (
                    <div className="show_options">
                      <div className="option_item">
                        <MdVisibility className="option_icon view" />
                        <span onClick={handleProfileView}>Voir Profil</span>
                      </div>
                      <div className="option_item">
                        <MdBlock className="option_icon block" />
                        <span>Bloquer Client</span>
                      </div>
                      <div className="option_item">
                        <MdDelete className="option_icon delete" />
                        <span>Supprimer Client</span>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>Oran</td>
                <td>3</td>
                <td>90,000 DZD</td>
                <td>Inactif</td>
                <td className="menu_cell">
                  <button onClick={() => toggleOptions("client-2")} className="menu_btn">
                    <PiDotsThreeOutlineVerticalBold />
                  </button>
                  {openMenu === "client-2" && (
                    <div className="show_options">
                      <div className="option_item">
                        <MdVisibility className="option_icon view" />
                        <span onClick={handleProfileView}>Voir Profil</span>
                      </div>
                      <div className="option_item">
                        <MdBlock className="option_icon block" />
                        <span>Bloquer Client</span>
                      </div>
                      <div className="option_item">
                        <MdDelete className="option_icon delete" />
                        <span>Supprimer Client</span>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td>Ahmed Benali</td>
                <td>Constantine</td>
                <td>8</td>
                <td>240,000 DZD</td>
                <td>Bloqué</td>
                <td className="menu_cell">
                  <button onClick={() => toggleOptions("client-3")} className="menu_btn">
                    <PiDotsThreeOutlineVerticalBold />
                  </button>
                  {openMenu === "client-3" && (
                    <div className="show_options">
                      <div className="option_item">
                        <MdVisibility className="option_icon view" />
                        <span onClick={handleProfileView}>Voir Profil</span>
                      </div>
                      <div className="option_item">
                        <MdBlock className="option_icon block" />
                        <span>Bloquer Client</span>
                      </div>
                      <div className="option_item">
                        <MdDelete className="option_icon delete" />
                        <span>Supprimer Client</span>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {isProduct && (
        <div className="products_container_box">
          <div className="status_grid">
            <div className="box_grid">
              <BsBox />
              <div className="number">12</div>
              <div className="description">Total Produits</div>
            </div>
            <div className="box_grid">
              <GiClothes />
              <div className="number">5</div>
              <div className="description">Vêtements</div>
            </div>
            <div className="box_grid">
              <MdDevices />
              <div className="number">4</div>
              <div className="description">Électronique</div>
            </div>
            <div className="box_grid meubles_box">
              <MdChair />
              <div className="number">3</div>
              <div className="description">Meubles</div>
            </div>
            <div className="box_grid">
              <GiShorts />
              <div className="number">2</div>
              <div className="description">Shorts & Bas</div>
            </div>
          </div>

          <div className="selection_row">
            <div className="input_container">
              <CiSearch />
              <input type="text" placeholder="Rechercher un produit..." />
            </div>
            <div className="filter_clients">
              <CiFilter />
              <select>
                <option value="" disabled hidden>
                  Catégorie
                </option>
                <option value="all">Tous</option>
                <option value="clothes">Vêtements</option>
                <option value="electronics">Électronique</option>
                <option value="furniture">Meubles</option>
                <option value="shorts">Shorts & Bas</option>
              </select>
            </div>
            <button onClick={OpenFormAdd} className="add_product_btn">
              <MdOutlineAdd /> Ajouter
            </button>
          </div>
          <table>
            <thead>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th className="three">
                <PiDotsThreeOutlineVerticalBold />{" "}
              </th>
            </thead>
            <tbody>
              <tr>
                <td>T-shirt Blanc</td>
                <td>Vêtements</td>
                <td>1,500 DZD</td>
                <td>50</td>
                <td className="menu_cell">
                  <button onClick={() => toggleOptions("product-1")} className="menu_btn">
                    <PiDotsThreeOutlineVerticalBold />
                  </button>
                  {openMenu === "product-1" && (
                    <div className="show_options">
                      
                      <div className="option_item">
                        <MdDelete className="option_icon delete" />
                        <span>Supprimer Produit</span>
                      </div>
                      <div onClick={handleModifyProduct} className="option_item">
                        <VscDiffModified className="option_icon delete" />
                        <span>Modifier Produit</span>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td>Casque Audio</td>
                <td>Électronique</td>
                <td>8,000 DZD</td>
                <td>25</td>
                <td className="menu_cell">
                  <button onClick={() => toggleOptions("product-2")} className="menu_btn">
                    <PiDotsThreeOutlineVerticalBold />
                  </button>
                  {openMenu === "product-2" && (
                    <div className="show_options">
                      
                      <div className="option_item">
                        <MdDelete className="option_icon delete" />
                        <span>Supprimer Produit</span>
                      </div>
                      <div className="option_item">
                        <VscDiffModified className="option_icon delete" />
                        <span>Modifier Produit</span>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td>Chaise Bureau</td>
                <td>Meubles</td>
                <td>15,000 DZD</td>
                <td>10</td>
                <td className="menu_cell">
                  <button onClick={() => toggleOptions("product-3")} className="menu_btn">
                    <PiDotsThreeOutlineVerticalBold />
                  </button>
                  {openMenu === "product-3" && (
                    <div className="show_options">
                      
                      <div className="option_item">
                        <MdDelete className="option_icon delete" />
                        <span>Supprimer Produit</span>
                      </div>
                      <div className="option_item">
                        <VscDiffModified className="option_icon delete" />
                        <span>Modifier Produit</span>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
     {viewProfile && (
    <div className="profile-overlay">
    <div className="profile-modal">
      {/* Header with title and close button */}
      <div className="profile-header">
        <h2>Détails du client</h2>
        <button onClick={() => setViewProfile(false)} className="close-button" aria-label="Fermer">
          <IoMdClose />
        </button>
      </div>

      {/* Client profile info with avatar */}
      <div className="profile-section">
        <div className="profile-avatar">
          <span>IO</span>
        </div>
        <div className="profile-name-status">
          <h3>ouladsmane issam</h3>
          <p className="status">Statut : actif</p>
        </div>
      </div>

      {/* Contact information */}
      <div className="contact-section">
        <div className="contact-item">
          <CiMail className="contact-icon" />
          <span>ouladsmaneissam@gmail.com
          </span>
        </div>
        <div className="contact-item">
          <CiPhone className="contact-icon" />
          <span>+33 12 23 12 34 12</span>
        </div>
        <div className="contact-item">
          <CiLocationOn className="contact-icon" />
          <span>Tipaza Kolea</span>
        </div>
      </div>

      {/* Registration date */}
      <div className="join-date">
        <SlCalender className="contact-icon" />
        <span>Inscrit le : 26/12/2025</span>
      </div>

      {/* Customer statistics */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-value">12</div>
          <div className="stat-label">Commandes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">45 000</div>
          <div className="stat-label">Total dépensé</div>
        </div>
      </div>

      {/* Footer with close button */}
      <div className="profile-footer">
        <button onClick={() => setViewProfile(false)} className="close-btn">
          Fermer
        </button>
      </div>
    </div>
  </div>
)}
{AddForm && (
  <div className="profile-overlay">
    <div className="profile-modal">
      <div className="profile-header">
        <h2>Ajouter un produit</h2>
        <button onClick={CloseFormAdd} className="close-button">
          <IoMdClose />
        </button>
      </div>

      <form className="add-product-form" onSubmit={(e) => {
        e.preventDefault();
        console.log("Produit ajouté :", formData);
        CloseFormAdd();
      }}>
        <div className="form-group">
          <label>Nom du produit *</label>
          <input
            className="nom_input"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            required
          />
        </div>
        <div className="prix">
        <div className="form-group">
          <label>Ancien prix (DA)</label>
          <input
            type="number"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label> Prix (DA) *</label>
          <input
            type="number"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Catégorie *</label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          >
            <option value="Hoodies">Hoodies</option>
            <option value="Vêtements">Vêtements</option>
            <option value="Électronique">Électronique</option>
            <option value="Meubles">Meubles</option>
            <option value="Shorts">Shorts & Bas</option>
          </select>
        </div>
        <div className="form-group">
          <label>Stock *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            required
          />
        </div>
        </div>
        <div className="form-group">
          <label>Tailles</label>
          <input
            type="text"
            name="sizes"
            value={formData.sizes}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Couleurs</label>
          <input
            type="text"
            name="colors"
            value={formData.colors}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="file"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          ></textarea>
        </div>

        <div className="profile-footer">
          <button type="submit" className="close-btn">Ajouter</button>
          <button type="button" onClick={CloseFormAdd} className="close-btn">Annuler</button>
        </div>
      </form>
    </div>
  </div>
)}
{AddModifie && (
  <div className="profile-overlay">
    <div className="profile-modal">
      <div className="profile-header">
        <h2>Modifier le produit </h2>
        <button onClick={CloseModifyProduct} className="close-button">
          <IoMdClose />
        </button>
      </div>

      <form className="add-product-form" onSubmit={(e) => {
        e.preventDefault();
        console.log("Produit ajouté :", formData);
        CloseFormAdd();
      }}>
        <div className="form-group">
          <label>Nom du produit *</label>
          <input
            className="nom_input"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            required
          />
        </div>
        <div className="prix">
        <div className="form-group">
          <label>Ancien prix (DA)</label>
          <input
            type="number"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label> Prix (DA) *</label>
          <input
            type="number"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Catégorie *</label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          >
            <option value="Hoodies">Hoodies</option>
            <option value="Vêtements">Vêtements</option>
            <option value="Électronique">Électronique</option>
            <option value="Meubles">Meubles</option>
            <option value="Shorts">Shorts & Bas</option>
          </select>
        </div>
        <div className="form-group">
          <label>Stock *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            required
          />
        </div>
        </div>
        <div className="form-group">
          <label>Tailles</label>
          <input
            type="text"
            name="sizes"
            value={formData.sizes}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Couleurs</label>
          <input
            type="text"
            name="colors"
            value={formData.colors}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="file"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          ></textarea>
        </div>

        <div className="profile-footer">
          <button type="submit" className="close-btn">Ajouter</button>
          <button type="button" onClick={CloseFormAdd} className="close-btn">Annuler</button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  )
}

export default Admin

import { useState, useEffect } from 'react';
import './Historial.css';
import { Header } from '../../components/Header/Header';
import { Spinner } from '../../components/Spinner/Spinner';
import { purchaseService } from '../../../data/services/purchaseService';
import { authService } from '../../../data/services/authService';
import { UserIcon } from '../../components/Icons/UserIcon';
import { GamepadIcon } from '../../components/Icons/GamepadIcon';

export const Historial = ({ userName }) => {
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [purchasesData, usersData] = await Promise.all([
          purchaseService.getAllPurchases(),
          authService.getAllUsers()
        ]);
        
        const usersMap = {};
        usersData.forEach(user => {
          usersMap[user.id] = user;
        });
        
        setPurchases(purchasesData);
        setUsers(usersMap);
      } catch (error) {
        console.error('Error cargando compras:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <main className="main-content">
      <Header userName={userName} />

      <section className="historial-page-section">
        <h2 className="section-title">Historial de Compras</h2>
        {loading ? (
          <Spinner />
        ) : (
          <div className="historial-scroll-container">
            <div className="historial-list">
              {purchases.length === 0 ? (
                <p style={{ color: 'var(--text-gray)' }}>No hay compras registradas</p>
              ) : (
                purchases.map((purchase) => {
                  const owner = users[purchase.owner_id];
                  return (
                    <PurchaseItem
                      key={purchase.id}
                      purchase={purchase}
                      owner={owner}
                      onClick={() => {
                        setSelectedPurchase(purchase);
                        setSelectedOwner(owner);
                      }}
                    />
                  );
                })
              )}
            </div>
          </div>
        )}
      </section>
      
      {selectedPurchase && (
        <PurchaseModal
          purchase={selectedPurchase}
          owner={selectedOwner}
          onClose={() => {
            setSelectedPurchase(null);
            setSelectedOwner(null);
          }}
        />
      )}
    </main>
  );
};

const PurchaseItem = ({ purchase, owner, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="purchase-item" onClick={onClick}>
      <div className="purchase-owner">
        {owner?.profile_image && !imageError ? (
          <img 
            src={owner.profile_image} 
            alt={owner.name} 
            className="purchase-owner-img"
            onError={() => setImageError(true)}
            title={`Owner: ${owner.name}`}
          />
        ) : (
          <div className="purchase-owner-placeholder" title={owner?.name || 'Owner'}>
            <UserIcon size={24} />
          </div>
        )}
      </div>
      
      
      <div className="purchase-info">
        <span className="purchase-game-name">{purchase?.title || 'Sin nombre'}</span>
        <span className="purchase-date">{formatDate(purchase?.purchased_at)}</span>
      </div>
      
      <div className="purchase-price">
        <span className="purchase-amount">
          {purchase?.total_price ? new Intl.NumberFormat('es-CO').format(purchase.total_price) : '0'} COP
        </span>
      </div>
    </div>
  );
};

const PurchaseModal = ({ purchase, owner, onClose }) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="modal-title">Detalles de la Compra</h2>
        
        <div className="modal-body">
          <div className="modal-owner">
            {owner?.profile_image && !imageError ? (
              <img 
                src={owner.profile_image} 
                alt={owner.name} 
                className="modal-owner-img"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="modal-owner-placeholder">
                <UserIcon size={60} />
              </div>
            )}
            <h3 className="modal-owner-name">{owner?.name || 'Desconocido'}</h3>
            <p className="modal-owner-role">Propietario (40%)</p>
          </div>

          <div className="modal-details">
            <div className="modal-detail-item">
              <span className="modal-label">Juego:</span>
              <span className="modal-value">{purchase?.title}</span>
            </div>

            <div className="modal-detail-item">
              <span className="modal-label">Precio Total:</span>
              <span className="modal-value modal-price">
                {purchase?.total_price ? new Intl.NumberFormat('es-CO').format(purchase.total_price) : '0'} COP
              </span>
            </div>

            {purchase?.was_on_sale && (
              <div className="modal-detail-item">
                <span className="modal-label">Precio Original:</span>
                <span className="modal-value modal-original-price">
                  {purchase?.original_price ? new Intl.NumberFormat('es-CO').format(purchase.original_price) : '0'} COP
                </span>
              </div>
            )}

            <div className="modal-detail-item">
              <span className="modal-label">Estado:</span>
              <span className={`modal-badge ${purchase?.was_on_sale ? 'on-sale' : ''}`}>
                {purchase?.was_on_sale ? '🔥 En oferta' : 'Precio normal'}
              </span>
            </div>

            <div className="modal-detail-item">
              <span className="modal-label">Fecha de compra:</span>
              <span className="modal-value">{formatDate(purchase?.purchased_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import './Depositos.css';
import { Header } from '../../components/Header/Header';
import { Spinner } from '../../components/Spinner/Spinner';
import { depositService } from '../../../data/services/depositService';
import { authService } from '../../../data/services/authService';
import { UserIcon } from '../../components/Icons/UserIcon';

export const Depositos = ({ userName }) => {
  const [deposits, setDeposits] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar todos los depósitos y usuarios
        const [depositsData, usersData] = await Promise.all([
          depositService.getAllDeposits(),
          authService.getAllUsers()
        ]);
        
        // Crear mapa de usuarios para acceso rápido
        const usersMap = {};
        usersData.forEach(user => {
          usersMap[user.id] = user;
        });
        
        setDeposits(depositsData);
        setUsers(usersMap);
      } catch (error) {
        console.error('Error cargando depósitos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <main className="main-content">
      <Header userName={userName} />

      <section className="depositos-page-section">
        <h2 className="section-title">Historial de Depósitos</h2>
        
        {loading ? (
          <Spinner />
        ) : (
          <div className="depositos-scroll-container">
            <div className="depositos-list">
              {deposits.length === 0 ? (
                <p style={{ color: 'var(--text-gray)' }}>No hay depósitos registrados</p>
              ) : (
                deposits.map((deposit) => {
                  const user = users[deposit.member_id];
                  return (
                    <DepositItem
                      key={deposit.id}
                      deposit={deposit}
                      user={user}
                      formatDate={formatDate}
                    />
                  );
                })
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

const DepositItem = ({ deposit, user, formatDate }) => {
  const [imageError, setImageError] = useState(false);
  
  const formatAmount = (value) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };
  
  return (
    <div className="deposit-item">
      <div className="deposit-avatar">
        {user?.profile_image && !imageError ? (
          <img 
            src={user.profile_image} 
            alt={user.name} 
            className="deposit-avatar-img"
            onError={() => setImageError(true)}
          />
        ) : (
          <UserIcon size={40} />
        )}
      </div>
      
      <div className="deposit-info">
        <div className="deposit-user-name">{user?.name || 'Usuario desconocido'}</div>
        <div className="deposit-note">{deposit.note || 'Sin nota'}</div>
      </div>
      
      <div className="deposit-details">
        <div className="deposit-amount">{formatAmount(deposit.amount)} COP</div>
        <div className="deposit-date">{formatDate(deposit.date)}</div>
      </div>
    </div>
  );
};

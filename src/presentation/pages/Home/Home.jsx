import { useState, useEffect } from 'react';
import './Home.css';
import { Header } from '../../components/Header/Header';
import { BalanceCard } from '../../components/BalanceCard/BalanceCard';
import { HistorialItem } from '../../components/HistorialItem/HistorialItem';
import { DepositoCard } from '../../components/DepositoCard/DepositoCard';
import { Spinner } from '../../components/Spinner/Spinner';
import { authService } from '../../../data/services/authService';
import { depositService } from '../../../data/services/depositService';
import { purchaseService } from '../../../data/services/purchaseService';
import { UserIcon } from '../../components/Icons/UserIcon';
import { ArrowDownIcon } from '../../components/Icons/ArrowDownIcon';

export const Home = ({ userName }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [movements, setMovements] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, depositsData, purchasesData] = await Promise.all([
          authService.getAllUsers(),
          depositService.getAllDeposits(),
          purchaseService.getAllPurchases()
        ]);
        
        const usersMap = {};
        usersData.forEach(user => {
          usersMap[user.id] = user;
        });
        
        setAllUsers(usersData);
        setDeposits(depositsData);
        setPurchases(purchasesData);
        setUsers(usersMap);
        const gastos = [];
        purchasesData.forEach(purchase => {
          if (purchase.shares && Array.isArray(purchase.shares)) {
            purchase.shares.forEach(share => {
              gastos.push({
                id: `share-${purchase.id}-${share.member_id}`,
                member_id: share.member_id,
                amount: -Math.round(share.share_amount),
                date: purchase.purchased_at,
                title: purchase.title,
                type: 'expense',
              });
            });
          }
        });
        const allMovements = [
          ...depositsData.map(dep => ({ ...dep, type: 'deposit', title: dep.note || 'Depósito' })),
          ...gastos
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        setMovements(allMovements);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setError('Error al cargar datos. El servidor puede estar inactivo.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <main className="main-content">
      <Header userName={userName} />

      <section className="balance-section">
        <h2 className="section-title">Balance</h2>
        <div className="balance-grid">
          {loading ? (
            <Spinner />
          ) : error ? (
            <p style={{ color: 'var(--accent-red)' }}>{error}</p>
          ) : allUsers.length === 0 ? (
            <p style={{ color: 'var(--text-gray)' }}>No hay usuarios registrados</p>
          ) : (
            allUsers.map((user) => (
              <BalanceCard key={user.id} user={user} />
            ))
          )}
        </div>
      </section>

      <div className="bottom-section">
        <section className="historial-section">
          <h2 className="section-title">Historial</h2>
          <div className="historial-list">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Spinner size={30} />
              </div>
            ) : error ? (
              <p style={{ color: 'var(--accent-red)' }}>{error}</p>
            ) : purchases.length === 0 ? (
              <p style={{ color: 'var(--text-gray)' }}>No hay compras registradas</p>
            ) : (
              purchases.map((purchase) => {
                const owner = users[purchase.owner_id];
                return (
                  <HistorialItem 
                    key={purchase.id} 
                    game={purchase.title} 
                    amount={purchase.total_price}
                    owner={owner}
                  />
                );
              })
            )}
          </div>
        </section>

        <section className="depositos-section">
          <h2 className="section-title">Depositos</h2>
          <div className="depositos-grid">
            {loading ? (
              <Spinner size={30} />
            ) : error ? (
              <p style={{ color: 'var(--accent-red)' }}>{error}</p>
            ) : movements.length === 0 ? (
              <p style={{ color: 'var(--text-gray)' }}>No hay movimientos registrados</p>
            ) : (
              movements.map((item) => {
                const user = users[item.member_id];
                return (
                  <HomeDepositItem
                    key={item.id}
                    deposit={item}
                    user={user}
                  />
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

const HomeDepositItem = ({ deposit, user }) => {
  const [imageError, setImageError] = useState(false);
  const isExpense = deposit.type === 'expense';
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const formatAmount = (value) => new Intl.NumberFormat('es-CO').format(Math.abs(value));
  return (
    <div className="home-deposit-item">
      <div className="home-deposit-avatar">
        {user?.profile_image && !imageError ? (
          <img 
            src={user.profile_image} 
            alt={user.name} 
            className="home-deposit-avatar-img"
            onError={() => setImageError(true)}
          />
        ) : (
          <UserIcon size={30} />
        )}
      </div>
      <div className="home-deposit-info">
        <span className="home-deposit-amount" style={{ color: isExpense ? '#e53935' : undefined }}>
          {isExpense ? '-' : ''}{formatAmount(deposit.amount)}
        </span>
        <span className="home-deposit-date">({formatDate(deposit.date)})</span>
        {isExpense && (
          <span className="home-deposit-game">{deposit.title}</span>
        )}
      </div>
      <div className="home-deposit-arrow">
        {isExpense ? (
          <ArrowDownIcon size={20} color="#e53935" />
        ) : (
          <ArrowDownIcon size={20} color="#00ff5eff" />
        )}
      </div>
    </div>
  );
};

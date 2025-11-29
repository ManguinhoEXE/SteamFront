import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './presentation/components/Sidebar/Sidebar';
import { Spinner } from './presentation/components/Spinner/Spinner';
import { Home } from './presentation/pages/Home/Home';
import { Propuestas } from './presentation/pages/Propuestas/Propuestas';
import { Historial } from './presentation/pages/Historial/Historial';
import { Depositos } from './presentation/pages/Depositos/Depositos';
import { Login } from './presentation/pages/Login/Login';
import { Compras } from './presentation/pages/Compras/Compras';
import { mockBalances, mockHistorial, mockDepositos } from './data/mock/mockData';
import { DepositosForm } from './presentation/pages/Depositos/DepositosForm';
import PasswordResetRequest from './presentation/pages/PasswordReset/PasswordResetRequest';
import PasswordResetConfirm from './presentation/pages/PasswordReset/PasswordResetConfirm';
import './App.css';

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/home')) return 'Home';
    if (path.includes('/historial')) return 'Historial';
    if (path.includes('/depositos')) return 'Depositos';
    if (path.includes('/propuestas')) return 'Propuestas';
    if (path.includes('/compras')) return 'Compras';
    return 'Home';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner size={50} />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (location.pathname === '/password-reset-request') {
      return <PasswordResetRequest />;
    }
    if (location.pathname === '/password-reset-confirm') {
      return <PasswordResetConfirm />;
    }
    return <Login />;
  }

  return (
    <div className="container">
      <Sidebar 
        userName={user?.name || 'Usuario'}
        activeTab={getActiveTab()}
      />
      <Routes>
        <Route path="/home" element={
          <Home 
            userName={user?.name || 'Usuario'}
            historial={mockHistorial}
            depositos={mockDepositos}
          />
        } />
        <Route path="/historial" element={<Historial userName={user?.name || 'Usuario'} />} />
        <Route path="/depositos" element={<Depositos userName={user?.name || 'Usuario'} />} />
        <Route path="/depositos/agregar" element={<DepositosForm />} />
        <Route path="/propuestas" element={<Propuestas userName={user?.name || 'Usuario'} />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
        <Route path="/password-reset-request" element={<PasswordResetRequest />} />
        <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

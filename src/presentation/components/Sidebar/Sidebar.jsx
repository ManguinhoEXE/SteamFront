import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';
import { UserIcon } from '../Icons/UserIcon';
import { CameraIcon } from '../Icons/CameraIcon';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../data/services/authService';

  const handleProfileImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await authService.uploadProfileImage(file);
    } catch (err) {
      alert('Error al subir la imagen de perfil');
    }
  };

export const Sidebar = ({ userName, activeTab }) => {
  const { logout, user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const tabs = [
    { name: 'Home', path: '/home', match: ['/home'] },
    { name: 'Historial', path: '/historial', match: ['/historial'] },
    { name: 'Depositos', path: '/depositos', match: ['/depositos'] },
    { name: 'Propuestas', path: '/propuestas', match: ['/propuestas'] },
  ];

  if (user?.role === 'master') {
    tabs.push(
      { name: 'Compras', path: '/compras', match: ['/compras'] },
      { name: 'Agregar Depósito', path: '/depositos/agregar', match: ['/depositos/agregar'] }
    );
  }

  const getActiveTab = () => {
    const currentPath = window.location.pathname;
    for (const tab of tabs) {
      if (tab.match.some(m => currentPath === m)) return tab.name;
    }
    return tabs[0].name;
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa - solo visible en móvil */}
      <button className="hamburger-button" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay - solo visible cuando el menú está abierto en móvil */}
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

      <aside className={`sidebar ${isMenuOpen ? 'menu-open' : ''}`}>
      <button onClick={handleLogout} className="logout-button">
      </button>
      
      <div className="profile-section">
        <div className="profile-avatar">
          {user?.profile_image && !imageError ? (
            <img 
              src={user.profile_image} 
              alt={userName} 
              className="profile-avatar-img"
              onError={() => setImageError(true)}
            />
          ) : (
            <UserIcon size={80} />
          )}
        </div>
        <p className="profile-name">{userName}</p>
      </div>
      
      <nav className="nav-menu">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            to={tab.path}
            className={`nav-button ${getActiveTab() === tab.name ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </aside>
    </>
  );
};

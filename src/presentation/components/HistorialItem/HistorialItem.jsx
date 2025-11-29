import { useState } from 'react';
import './HistorialItem.css';
import { UserIcon } from '../Icons/UserIcon';

export const HistorialItem = ({ game, amount, owner }) => {
  const [imageError, setImageError] = useState(false);

  const formatAmount = (value) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  return (
    <div className="historial-item">
      <div className="historial-owner">
        {owner?.profile_image && !imageError ? (
          <img 
            src={owner.profile_image} 
            alt={owner.name} 
            className="historial-owner-img"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="historial-owner-placeholder">
            <UserIcon size={24} />
          </div>
        )}
      </div>
      <span className="historial-game">{game}</span>
      <span className="historial-divider">|</span>
      <span className="historial-amount">{formatAmount(amount)} COP</span>
    </div>
  );
};

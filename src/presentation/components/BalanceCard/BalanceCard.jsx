import { useState } from 'react';
import './BalanceCard.css';
import { UserIcon } from '../Icons/UserIcon';
import { YenIcon } from '../Icons/YenIcon';

export const BalanceCard = ({ user }) => {
  const [imageError, setImageError] = useState(false);
  
  const profileImageUrl = user?.profile_image || null;

  const currentBalance = user?.balance?.current_balance || 0;

  return (
    <div className="balance-card">
      <div className="balance-avatar">
        {profileImageUrl && !imageError ? (
          <img 
            src={profileImageUrl} 
            alt={user.name} 
            className="balance-avatar-img"
            onError={() => setImageError(true)}
          />
        ) : (
          <UserIcon size={40} />
        )}
      </div>
      <span className="balance-amount">{currentBalance.toLocaleString('es-CO')}</span>
      <YenIcon size={24} color="var(--text-white)" />
    </div>
  );
};

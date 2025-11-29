import './DepositoCard.css';
import { UserIcon } from '../Icons/UserIcon';
import { ArrowDownIcon } from '../Icons/ArrowDownIcon';

export const DepositoCard = ({ amount, date }) => {
  return (
    <div className="deposito-card">
      <div className="deposito-avatar">
        <UserIcon size={30} />
      </div>
      <div className="deposito-info">
        <span className="deposito-amount">{amount.toLocaleString('es-CO')}</span>
        <span className="deposito-date">({date})</span>
      </div>
      <ArrowDownIcon size={20} />
    </div>
  );
};

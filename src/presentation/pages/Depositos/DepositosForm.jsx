import React, { useState, useEffect } from 'react';
import { Spinner } from '../../components/Spinner/Spinner';
import { authService } from '../../../data/services/authService';
import { depositService } from '../../../data/services/depositService';
import './DepositosForm.css';

export const DepositosForm = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const usersData = await authService.getAllUsers();
        setUsers(usersData);
      } catch (err) {
        setError('Error al cargar usuarios');
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    if (!selectedUser || !amount) {
      setError('Selecciona un usuario y un monto');
      setLoading(false);
      return;
    }
    try {
      const payload = {
        member_id: Number(selectedUser),
        amount: Number(amount),
        note,
        date: new Date().toISOString()
      };
      console.log('Enviando depósito:', payload);
      await depositService.createDeposit(payload);
      setSuccess('Depósito realizado con éxito');
      setAmount('');
      setNote('');
      setSelectedUser('');
    } catch (err) {
      let msg = 'Error al realizar el depósito';
      const data = err?.response?.data;
      if (Array.isArray(data)) {
        msg = data.map(e => e.msg).join(' | ');
      } else if (data?.detail) {
        if (Array.isArray(data.detail)) {
          msg = data.detail.map(e => e.msg).join(' | ');
        } else if (typeof data.detail === 'string') {
          msg = data.detail;
        }
      } else if (data?.message) {
        msg = data.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="depositos-form-page">
      <h2>Agregar Depósito</h2>
      {loadingUsers ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
          <Spinner size={40} />
        </div>
      ) : (
        <form className="depositos-form" onSubmit={handleSubmit}>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
            <option value="">Selecciona usuario</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nota (opcional)"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <button type="submit" disabled={loading}>{loading ? 'Agregando...' : 'Agregar Depósito'}</button>
          {success && <div className="success-msg">{success}</div>}
          {error && <div className="error-msg">{error}</div>}
        </form>
      )}
    </div>
  );
};

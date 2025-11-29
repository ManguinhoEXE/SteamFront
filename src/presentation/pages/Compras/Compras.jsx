import './Compras.css';
import { purchaseService } from '../../../data/services/purchaseService';
import { authService } from '../../../data/services/authService';
import { proposalService } from '../../../data/services/proposalService';
import { Spinner } from '../../components/Spinner/Spinner';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export const Compras = () => {
  const { user } = useAuth();
  const [propuestas, setPropuestas] = useState([]);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manualTitle, setManualTitle] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [comprandoId, setComprandoId] = useState(null);
  // Oferta
  const [oferta, setOferta] = useState(false);
  const [precioOriginal, setPrecioOriginal] = useState('');
  // Usuarios para el select
  const [allUsers, setAllUsers] = useState([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [propuestasData, comprasData, usersData] = await Promise.all([
        proposalService.getAllProposals(),
        purchaseService.getAllPurchases(),
        authService.getAllUsers(),
      ]);
      setPropuestas(propuestasData.filter(p => p.status === 'voted'));
      setCompras(Array.isArray(comprasData) ? comprasData : []);
      setAllUsers(usersData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleComprarPropuesta = async (proposalId) => {
    setComprandoId(proposalId);
    setError('');
    setSuccess('');
    try {
      let body = undefined;
      if (oferta) {
        const original = Number(precioOriginal);
        if (isNaN(original) || original <= 0) {
          setError('Precio original inválido');
          setComprandoId(null);
          return;
        }
        body = { was_on_sale: true, original_price: original };
      }
      await purchaseService.createFromProposal(proposalId, body);
      setSuccess('Compra realizada con éxito');
      // Refresca compras
      const comprasData = await purchaseService.getAllPurchases();
      setCompras(Array.isArray(comprasData) ? comprasData : []);
    } catch (err) {
      setError('Error al comprar juego por propuesta');
    } finally {
      setComprandoId(null);
    }
  };

  const handleManualPurchase = async (e) => {
    e.preventDefault();
    setManualLoading(true);
    setError('');
    setSuccess('');
    try {
      // Validar y convertir el precio a número
      const priceNumber = Number(manualPrice);
      if (!manualTitle.trim() || isNaN(priceNumber) || priceNumber <= 0 || !selectedOwnerId) {
        setError('Título, precio válido y propietario son requeridos');
        setManualLoading(false);
        return;
      }
      await purchaseService.createManual(selectedOwnerId, { title: manualTitle, total_price: priceNumber });
      setSuccess('Compra manual realizada con éxito');
      setManualTitle('');
      setManualPrice('');
      setSelectedOwnerId('');
      // Refresca compras
      const comprasData = await purchaseService.getAllPurchases();
      setCompras(Array.isArray(comprasData) ? comprasData : []);
    } catch (err) {
      setError('Error al realizar compra manual');
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="compras-page">
      <h2>Compras de Juegos</h2>
      {loading ? (
        <Spinner size={48} color="var(--accent-green)" />
      ) : (
        <>
          <section className="compras-propuestas-section">
            <h3>Comprar juego por propuesta</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ marginRight: '1rem' }}>
                <input
                  type="checkbox"
                  checked={oferta}
                  onChange={e => setOferta(e.target.checked)}
                />{' '}
                ¿El juego estaba en oferta?
              </label>
              {oferta && (
                <input
                  type="number"
                  placeholder="Precio original"
                  value={precioOriginal}
                  onChange={e => setPrecioOriginal(e.target.value)}
                  min={0}
                  style={{ width: 140 }}
                />
              )}
            </div>
            {propuestas.length === 0 ? (
              <p>No hay propuestas disponibles para comprar.</p>
            ) : (
              <ul className="compras-propuestas-list">
                {propuestas.map((p) => (
                  <li key={p.id} className="compras-propuesta-item">
                    <span>{p.title} - {Number(p.price).toLocaleString('es-CO')} COP</span>
                    <button
                      onClick={() => handleComprarPropuesta(p.id)}
                      disabled={comprandoId === p.id}
                      className="btn-comprar-propuesta"
                    >
                      {comprandoId === p.id ? 'Comprando...' : 'Comprar'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="compras-manual-section">
            <h3>Compra manual de juego</h3>
            <form onSubmit={handleManualPurchase} className="compras-manual-form">
              <select
                value={selectedOwnerId}
                onChange={e => setSelectedOwnerId(e.target.value)}
                required
                style={{ minWidth: 120 }}
              >
                <option value="">Selecciona propietario</option>
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Título del juego"
                value={manualTitle}
                onChange={e => setManualTitle(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={manualPrice}
                onChange={e => setManualPrice(e.target.value)}
                required
                min={0}
              />
              <button type="submit" className="btn-comprar-manual" disabled={manualLoading}>
                {manualLoading ? 'Comprando...' : 'Comprar manualmente'}
              </button>
            </form>
          </section>

          {(error || success) && (
            <div className={`compras-message ${error ? 'error' : 'success'}`}>{error || success}</div>
          )}

          <section className="compras-historial-section">
            <h3>Historial de compras</h3>
            {compras.length === 0 ? (
              <p>No hay compras registradas.</p>
            ) : (
              <ul className="compras-historial-list">
                {compras.map((c) => (
                  <li key={c.id} className="compras-historial-item">
                    <span>{c.title} - {Number(c.total_price).toLocaleString('es-CO')} COP</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
};

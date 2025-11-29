
import React, { useState, useRef, useEffect } from 'react';
import './Propuestas.css';
import { Header } from '../../components/Header/Header';
import { FaCrown } from 'react-icons/fa';
import { proposalService } from '../../../data/services/proposalService';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../data/services/authService';
import { UserIcon } from '../../components/Icons/UserIcon';
import { Spinner } from '../../components/Spinner/Spinner';
import { CheckIcon } from '../../components/Icons/CheckIcon';
import { FaEdit } from 'react-icons/fa';

export const Propuestas = ({ userName }) => {
    const titleRef = useRef();
    const priceRef = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      const title = titleRef.current.value.trim();
      const price = priceRef.current.value.trim();
      if (!title || !price || isNaN(Number(price))) {
        setError("Completa todos los campos correctamente");
        setLoading(false);
        return;
      }
      try {
        const nuevaPropuesta = await proposalService.createProposal({ title, price: Number(price) });
        setShowModal(false);
        titleRef.current.value = "";
        priceRef.current.value = "";
        if (nuevaPropuesta && nuevaPropuesta.id) {
          setPropuestas(prev => [...prev, nuevaPropuesta]);
        } else {
          const propuestasData = await proposalService.getAllProposals();
          setPropuestas(propuestasData);
        }
      } catch (err) {
        setError("Error al crear propuesta");
      } finally {
        setLoading(false);
      }
    };
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProposal, setEditProposal] = useState(null);
  const editPriceRef = useRef();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [propuestas, setPropuestas] = useState([]);
  const [votedProposalId, setVotedProposalId] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);
  const [loadingPropuestas, setLoadingPropuestas] = useState(true);
  const [checkingCanPropose, setCheckingCanPropose] = useState(true);

  const [propuestasHabilitadas, setPropuestasHabilitadas] = useState(null);
  const [loadingSwitch, setLoadingSwitch] = useState(false);


  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectingWinner, setSelectingWinner] = useState(false);
  const [winnerError, setWinnerError] = useState('');
  const [selectedWinner, setSelectedWinner] = useState(null);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    async function fetchData() {
      setLoadingPropuestas(true);
      setCheckingCanPropose(true);
      const [propuestasData, usersData, myVoteData, propuestasTurnData] = await Promise.all([
        proposalService.getAllProposals(),
        authService.getAllUsers(),
        proposalService.getMyVote(),
        proposalService.getPropuestasTurn().catch(() => ({ status: false }))
      ]);
      setPropuestas(propuestasData);
      setUsers(usersData);
      if (myVoteData?.has_vote && myVoteData.vote?.proposal_id) {
        setVotedProposalId(myVoteData.vote.proposal_id);
      } else {
        setVotedProposalId(null);
      }
      console.log('propuestasTurnData:', propuestasTurnData);
      let status = propuestasTurnData.status;
      if (typeof status === 'string') status = status === 'true';
      if (typeof status === 'number') status = status === 1;
      setPropuestasHabilitadas(!!status);
      setLoadingPropuestas(false);
      setCheckingCanPropose(false);
    }
    fetchData();
  }, []);

  const propuestasProposed = propuestas.filter(p => p.status === 'proposed');
  const hasOwnProposed = propuestasProposed.some(p => p.proposer_id === user?.id);

  return (
    <main className="main-content">
      <Header userName={userName} />
      {user?.role === 'steam' && propuestasHabilitadas === false ? (
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'60vh'}}>
          {propuestasHabilitadas === null ? (
            <Spinner size={48} color="#4caf50" style={{marginBottom:24}} />
          ) : null}
          <span style={{fontSize:'2rem',color:'#aaa',fontWeight:600}}>Próximamente...</span>
        </div>
      ) : (
        <>
          <div className="propuestas-header-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, width: '100%', marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <h2 className="section-title" style={{ margin: 0, marginBottom: 12 }}>Propuestas</h2>
              {checkingCanPropose ? (
                <Spinner size={36} color="var(--accent-green)" inline />
              ) : (
                !hasOwnProposed && (
                  <button
                    className="btn-add-propuesta"
                    onClick={handleOpenModal}
                    disabled={!propuestasHabilitadas}
                    style={!propuestasHabilitadas ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    Agregar Propuesta
                  </button>
                )
              )}
            </div>
            {user?.role === 'master' && (
              <div style={{ marginTop: 8, minHeight: 32, display: 'flex', alignItems: 'center', position: 'relative' }}>
                {propuestasHabilitadas === null ? (
                  <Spinner size={28} color="#4caf50" />
                ) : (
                  <label className="switch-propuestas" title={propuestasHabilitadas ? 'Propuestas habilitadas' : 'Propuestas deshabilitadas'}>
                    <input
                      type="checkbox"
                      checked={propuestasHabilitadas}
                      disabled={loadingSwitch}
                      onChange={async e => {
                        setLoadingSwitch(true);
                        try {
                          const res = await proposalService.togglePropuestasTurn();
                          setPropuestasHabilitadas(!!res.status);
                        } catch {
                          // error opcional
                        } finally {
                          setLoadingSwitch(false);
                        }
                      }}
                    />
                    <span className="slider-propuestas" style={{ background: propuestasHabilitadas ? '#4caf50' : '#ff4d4f' }}></span>
                  </label>
                )}
              </div>
            )}
          </div>
          <section className="propuestas-section" style={{ position: 'relative' }}>
            {(user?.role === 'master' || propuestasHabilitadas) && (
              <div className="propuestas-content propuestas-content-centered" style={propuestasHabilitadas ? {} : { pointerEvents: 'none', opacity: 0.4, filter: 'blur(2px)', position: 'relative' }}>
                {loadingPropuestas ? (
                  <Spinner size={48} color="var(--accent-green)" />
                ) : (
                  <div className="propuestas-cards-list">
                    {propuestasProposed.length === 0 && <p style={{color:'#aaa'}}>No hay propuestas aún.</p>}
                    {propuestasProposed.map((p) => {
                      const proposer = users.find(u => u.id === p.proposer_id);
                      return (
                        <div className="propuesta-card" key={p.id}>
                          <div className="propuesta-avatar">
                            {proposer?.profile_image ? (
                              <img src={proposer.profile_image} alt={proposer.name} className="propuesta-avatar-img" />
                            ) : (
                              <UserIcon size={40} color="#fff" />
                            )}
                          </div>
                          <div className="propuesta-info">
                            <div className="propuesta-title">{p.title}</div>
                            <div className="propuesta-precio-votos-row">
                              <span className="propuesta-precio">{Number(p.price).toLocaleString('es-CO')} COP</span>
                              {user?.role === 'master' && (
                                <span className="propuesta-votos">Votos: {p.votes_count ?? 0}</span>
                              )}
                            </div>
                          </div>
                          {p.proposer_id !== user?.id && (
                            <button
                              className={`btn-votar-propuesta${animatingId === p.id ? ' animating' : ''}`}
                              onClick={() => handleVote(p.id)}
                              disabled={votedProposalId === p.id}
                            >
                              {votedProposalId === p.id || animatingId === p.id ? (
                                <CheckIcon size={28} color="#4caf50" />
                              ) : (
                                <span className="circle-vote" />
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {!propuestasHabilitadas && user?.role === 'master' && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(30,30,30,0.85)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    zIndex: 10,
                    borderRadius: 20,
                  }}>
                    Propuestas deshabilitadas
                  </div>
                )}
              </div>
            )}
            {user?.role !== 'master' && !propuestasHabilitadas && null}
          </section>

          {showModal && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-propuesta" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseModal} aria-label="Cerrar modal">×</button>
                <h3 className="modal-title">Nueva Propuesta</h3>
                <form className="form-propuesta-modal" onSubmit={handleSubmit}>
                  <input ref={titleRef} className="input-propuesta short" placeholder="Título del juego" maxLength={32} disabled={loading} />
                  <input ref={priceRef} className="input-propuesta short" placeholder="Precio" min="0" maxLength={10} disabled={loading} />
                  {error && <div style={{color:'#ff7675', marginBottom:8}}>{error}</div>}
                  <div className="btn-modal-submit-wrapper">
                    <button className="btn-modal-submit" type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Postular'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showWinnerModal && selectedWinner && (
            <div className="modal-overlay" onClick={() => setShowWinnerModal(false)}>
              <div className="modal-propuesta modal-propuesta-grande" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowWinnerModal(false)} aria-label="Cerrar modal">×</button>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '2rem' }}>
                  <FaCrown color="#ffd600" style={{ marginBottom: 2 }} /> Confirmar ganador
                </h3>
                <div style={{ margin: '2rem 0 1.5rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  {selectedWinner.profileImage && (
                    <img
                      src={selectedWinner.profileImage}
                      alt="Perfil"
                      className="modal-propuesta-img"
                      style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffd600', marginBottom: 12 }}
                    />
                  )}
                  <div style={{ fontWeight: 700, fontSize: '1.4rem', color: '#fff' }}>{selectedWinner.title}</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '0.3rem 1.2rem', margin: '0.5rem 0' }}>
                    {Number(selectedWinner.price).toLocaleString('es-CO')} COP
                  </div>
                  <div style={{ color: '#ffd600', fontWeight: 600, fontSize: '1.1rem', marginTop: 4 }}>
                    Votos: {selectedWinner.votes_count ?? 0}
                  </div>
                </div>
                {winnerError && <div style={{ color: '#ff7675', marginBottom: 8 }}>{winnerError}</div>}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                  <button
                    className="btn-seleccionar-ganador"
                    style={{ background: 'linear-gradient(135deg, #ffd600 0%, #ffe066 100%)', color: '#222', minWidth: 160, fontSize: '1.2rem', padding: '1rem 2.5rem' }}
                    disabled={selectingWinner}
                    onClick={async () => {
                      setWinnerError('');
                      setSelectingWinner(true);
                      try {
                        const updated = await proposalService.selectWinner(selectedWinner.id);
                        setShowWinnerModal(false);
                        // Optimistic update: actualiza solo la propuesta ganadora en el estado local
                        if (updated && updated.id) {
                          setPropuestas(prev => prev.map(p => p.id === updated.id ? updated : p));
                        } else {
                          // fallback: recarga todas si no se devuelve la propuesta actualizada
                          const propuestasData = await proposalService.getAllProposals();
                          setPropuestas(propuestasData);
                        }
                      } catch (err) {
                        setWinnerError('Error al seleccionar ganador');
                      } finally {
                        setSelectingWinner(false);
                      }
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}

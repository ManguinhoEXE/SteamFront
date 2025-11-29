import { useState, useEffect } from 'react';
import '../Login/Login.css';
import { supabase } from '../../../data/api/supabaseClient';

function getParamsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  let access_token = params.get('access_token') || params.get('token');
  let refresh_token = params.get('refresh_token');
  if (!access_token && window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    access_token = hashParams.get('access_token') || hashParams.get('token');
    refresh_token = hashParams.get('refresh_token');
  }
  return { access_token, refresh_token };
}

export default function PasswordResetConfirm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const { access_token, refresh_token } = getParamsFromUrl();

  useEffect(() => {
    async function setSupabaseSession() {
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error) {
          console.error('Supabase setSession error:', error);
          setError('Token inválido o expirado. Solicita un nuevo enlace.');
          setSessionReady(false);
        } else {
          setSessionReady(true);
        }
      } else {
        setError('Token inválido o faltante.');
        setSessionReady(false);
      }
    }
    setSupabaseSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message || 'Error al restablecer la contraseña.');
      } else {
        setMessage('Contraseña restablecida exitosamente. Ahora puedes iniciar sesión.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (err) {
      setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!sessionReady) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-left">
            <p style={{color:'#ff4d4f',fontWeight:600}}>{error || 'Cargando...'}</p>
          </div>
          <div className="login-right">
            <div className="login-illustration">
              <img src="/images/imageLogin.jpg" alt="Illustration" className="illustration-image" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h1 className="login-title">Establecer nueva contraseña</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="reset-message" style={{ color: '#ff4d4f', fontWeight: 600 }}>{error}</div>}
            {message && <div className="reset-message" style={{ color: '#19c37d', fontWeight: 700 }}>{message}</div>}
            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="password">Nueva contraseña</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: '0.7rem',
                  top: '70%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#222',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '2rem',
                  width: '2rem'
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="8" ry="5"/><circle cx="12" cy="12" r="2.5"/><line x1="8.5" y1="15.5" x2="15.5" y2="8.5" stroke="#222" strokeWidth="2.5"/></svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="8" ry="5"/><circle cx="12" cy="12" r="2.5"/></svg>
                )}
              </button>
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: '0.7rem',
                  top: '70%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#222',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '2rem',
                  width: '2rem'
                }}
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="8" ry="5"/><circle cx="12" cy="12" r="2.5"/><line x1="8.5" y1="15.5" x2="15.5" y2="8.5" stroke="#222" strokeWidth="2.5"/></svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="8" ry="5"/><circle cx="12" cy="12" r="2.5"/></svg>
                )}
              </button>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Enviando...' : 'Restablecer'}
            </button>
          </form>
        </div>
        <div className="login-right">
          <div className="login-illustration">
            <img src="/images/imageLogin.jpg" alt="Illustration" className="illustration-image" />
          </div>
        </div>
      </div>
    </div>
  );
}

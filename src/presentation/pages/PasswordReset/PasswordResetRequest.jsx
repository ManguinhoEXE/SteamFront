import { useState } from 'react';
import { API_BASE_URL } from '../../../data/api/axiosConfig';

export default function PasswordResetRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/password-reset-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
        // Si necesitas enviar cookies, agrega credentials: 'include'
        // credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Revisa tu correo para continuar el proceso.');
        setEmail('');
      } else {
        setError(data.message || 'Ocurrió un error. Intenta de nuevo.');
      }
    } catch (err) {
      setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h1 className="login-title">Recuperar contraseña</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              {error && (
                <div className="reset-message" style={{ color: '#ff4d4f', marginTop: '0.5rem', marginBottom: 0, fontWeight: 700 }}>
                  {error}
                </div>
              )}
              {message && (
                <div className="reset-message" style={{ color: '#19c37d', marginTop: '0.5rem', marginBottom: 0, fontWeight: 700 }}>
                  {message}
                </div>
              )}
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Enviando...' : 'GO'}
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

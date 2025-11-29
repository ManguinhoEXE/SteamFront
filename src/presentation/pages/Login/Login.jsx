import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Spinner } from '../../components/Spinner/Spinner';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h1 className="login-title">Grupo Muerto de Steam</h1>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="password">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password" 
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? <Spinner size={20} color="var(--text-white)" inline={true} /> : 'GO'}
            </button>
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <a href="/password-reset-request" style={{ color: 'var(--accent-green)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
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
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const clear = () => { setError(''); setSuccess(''); };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError('Completa todos los campos.');
    setLoading(true); clear();
    try {
      const data = await authApi.login({ username, password });
      const token = data.token || data.jwt || data.accessToken;
      if (!token) return setError(data.message || 'Credenciales incorrectas.');
      login(token, username);
      navigate('/');
    } catch { setError('No se pudo conectar al servidor.'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError('Completa todos los campos.');
    setLoading(true); clear();
    try {
      const res = await authApi.register({ username, password });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        return setError(d.message || 'No se pudo registrar.');
      }
      setSuccess('Cuenta creada. Ahora inicia sesión.');
      setTab('login');
      setUsername(''); setPassword('');
    } catch { setError('No se pudo conectar al servidor.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-icon">⚽</div>
          <div className="auth-title">Real Madrid</div>
          <div className="auth-sub">Gestión Fútbol 5</div>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); clear(); }}>
            Iniciar sesión
          </button>
          <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => { setTab('register'); clear(); }}>
            Registrarse
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={tab === 'login' ? handleLogin : handleRegister}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input className="form-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="tu_usuario" />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : tab === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}

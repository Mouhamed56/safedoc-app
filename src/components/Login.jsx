import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr,  setApiErr]  = useState('');

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    if (!form.password) e.password = 'Mot de passe requis';
    else if (form.password.length < 6) e.password = 'Minimum 6 caractères';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setApiErr('');
    await new Promise(r => setTimeout(r, 900));
    if (form.email === 'demo@safedoc.sn' && form.password === 'demo123') {
      sessionStorage.setItem('safedoc_auth', 'true');
      sessionStorage.setItem('safedoc_user', JSON.stringify({ name: 'Amadou Diallo', email: form.email, initials: 'AD' }));
      navigate('/dashboard');
    } else {
      setApiErr('Identifiants incorrects. Utilisez demo@safedoc.sn / demo123');
    }
    setLoading(false);
  };

  const set = f => e => { setForm(p => ({ ...p, [f]: e.target.value })); setErrors(p => ({ ...p, [f]: '' })); };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">

        <div className="auth-logo">
          <div className="auth-logo-icon">🔐</div>
          <div>
            <div className="auth-logo-text">SafeDoc</div>
            <div className="auth-logo-sub">Impression sécurisée</div>
          </div>
        </div>

        <h1 className="auth-title">Connexion</h1>
        <p className="auth-subtitle">Accédez à votre espace citoyen sécurisé</p>

        <div className="info-box info-box-blue" style={{ marginBottom: 20 }}>
          <span>💡</span>
          <span><strong>Démo :</strong> demo@safedoc.sn / demo123</span>
        </div>

        {apiErr && (
          <div className="info-box info-box-red" style={{ marginBottom: 16 }}>
            <span>⚠️</span><span>{apiErr}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Adresse email</label>
            <input type="email" className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="vous@exemple.sn" value={form.email} onChange={set('email')} autoComplete="email" />
            {errors.email && <div className="form-error">⚠ {errors.email}</div>}
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Mot de passe</label>
              <Link to="/forgot-password" className="auth-link" style={{ fontSize: 12 }}>Oublié ?</Link>
            </div>
            <input type="password" className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••" value={form.password} onChange={set('password')} autoComplete="current-password" />
            {errors.password && <div className="form-error">⚠ {errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <><span style={{ animation: 'spin .8s linear infinite', display: 'inline-block' }}>⚙</span> Connexion…</> : '→ Se connecter'}
          </button>
        </form>

        <hr className="divider" />
        <div className="auth-footer">
          Pas encore de compte ? <Link to="/register" className="auth-link">Créer un compte</Link>
        </div>
        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: 'var(--g400)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          🔒 Connexion chiffrée · Données RGPD protégées
        </div>
      </div>
    </div>
  );
}

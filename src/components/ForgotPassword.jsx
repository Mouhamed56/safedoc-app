import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email)  { setError('Email requis'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Email invalide'); return; }
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false); setSent(true);
  };

  if (sent) return (
    <div className="auth-page">
      <div className="auth-card fade-in" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>📧</div>
        <h2 className="auth-title" style={{ marginBottom: 8 }}>Email envoyé</h2>
        <p style={{ color: 'var(--g500)', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
          Si l'adresse <strong>{email}</strong> est associée à un compte, vous recevrez un lien de réinitialisation.
        </p>
        <p style={{ color: 'var(--g400)', fontSize: 13, marginBottom: 24 }}>Vérifiez aussi vos spams.</p>
        <Link to="/login" className="btn btn-primary btn-full" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  );

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

        <h1 className="auth-title">Mot de passe oublié</h1>
        <p className="auth-subtitle">Entrez votre email pour recevoir un lien de réinitialisation sécurisé</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Adresse email</label>
            <input type="email" className={`form-input ${error ? 'error' : ''}`}
              placeholder="vous@exemple.sn" value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }} autoFocus />
            {error && <div className="form-error">⚠ {error}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span style={{ animation: 'spin .8s linear infinite', display: 'inline-block' }}>⚙</span> Envoi…</> : '📧 Envoyer le lien'}
          </button>
        </form>

        <hr className="divider" />
        <div className="auth-footer"><Link to="/login" className="auth-link">← Retour à la connexion</Link></div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ password: '', confirm: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const strength = (() => {
    const p = form.password; if (!p) return 0; let s = 0;
    if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const sColor = ['','var(--red)','var(--amber)','var(--teal)','var(--green)'][strength];
  const sLabel = ['','Faible','Moyen','Fort','Très fort'][strength];

  const validate = () => {
    const e = {};
    if (!form.password) e.password = 'Nouveau mot de passe requis';
    else if (form.password.length < 8) e.password = 'Minimum 8 caractères';
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false); setDone(true);
  };

  const set = f => e => { setForm(p => ({ ...p, [f]: e.target.value })); setErrors(p => ({ ...p, [f]: '' })); };

  if (done) return (
    <div className="auth-page">
      <div className="auth-card fade-in" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>🔒</div>
        <h2 className="auth-title" style={{ marginBottom: 8 }}>Mot de passe modifié</h2>
        <p style={{ color: 'var(--g500)', fontSize: 14, marginBottom: 24 }}>Votre mot de passe a été réinitialisé avec succès.</p>
        <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>→ Se connecter</button>
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

        <h1 className="auth-title">Nouveau mot de passe</h1>
        <p className="auth-subtitle">Choisissez un mot de passe fort pour sécuriser votre compte</p>

        <div className="info-box info-box-blue" style={{ marginBottom: 20, fontSize: 12 }}>
          <span>🔑</span><span>Token de réinitialisation valide · Expire dans 15 minutes</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Nouveau mot de passe</label>
            <input type="password" className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Minimum 8 caractères" value={form.password} onChange={set('password')} autoFocus autoComplete="new-password" />
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? sColor : 'var(--g200)', transition: 'background .3s' }} />)}
                </div>
                <div style={{ fontSize: 11, color: sColor }}>{sLabel}</div>
              </div>
            )}
            {errors.password && <div className="form-error">⚠ {errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <input type="password" className={`form-input ${errors.confirm ? 'error' : ''}`}
              placeholder="Répétez votre mot de passe" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
            {errors.confirm && <div className="form-error">⚠ {errors.confirm}</div>}
          </div>

          <div style={{ marginBottom: 20 }}>
            {[
              { label: 'Au moins 8 caractères',   ok: form.password.length >= 8 },
              { label: 'Une majuscule (A-Z)',       ok: /[A-Z]/.test(form.password) },
              { label: 'Un chiffre (0-9)',          ok: /[0-9]/.test(form.password) },
              { label: 'Un caractère spécial (!@#)', ok: /[^A-Za-z0-9]/.test(form.password) },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, fontSize: 12, color: r.ok ? 'var(--green)' : 'var(--g400)' }}>
                <span>{r.ok ? '✓' : '○'}</span><span>{r.label}</span>
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span style={{ animation: 'spin .8s linear infinite', display: 'inline-block' }}>⚙</span> Réinitialisation…</> : '🔒 Réinitialiser le mot de passe'}
          </button>
        </form>

        <hr className="divider" />
        <div className="auth-footer"><Link to="/login" className="auth-link">← Retour à la connexion</Link></div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ fullName: '', email: '', phone: '', password: '', confirm: '', agree: false });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())  e.fullName  = 'Nom complet requis';
    if (!form.email)            e.email     = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    if (!form.password)         e.password  = 'Mot de passe requis';
    else if (form.password.length < 8) e.password = 'Minimum 8 caractères';
    if (form.password !== form.confirm) e.confirm  = 'Les mots de passe ne correspondent pas';
    if (!form.agree)            e.agree     = 'Veuillez accepter les conditions';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false); setSuccess(true);
  };

  const set = f => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [f]: val })); setErrors(p => ({ ...p, [f]: '' }));
  };

  const strength = (() => {
    const p = form.password; if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const sColor = ['','var(--red)','var(--amber)','var(--teal)','var(--green)'][strength];
  const sLabel = ['','Faible','Moyen','Fort','Très fort'][strength];

  if (success) return (
    <div className="auth-page">
      <div className="auth-card fade-in" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
        <h2 className="auth-title" style={{ marginBottom: 8 }}>Compte créé !</h2>
        <p style={{ color: 'var(--g500)', fontSize: 14, marginBottom: 24 }}>
          Un email de vérification a été envoyé à <strong>{form.email}</strong>.
        </p>
        <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>Aller à la connexion →</button>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card fade-in" style={{ maxWidth: 460 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">🔐</div>
          <div>
            <div className="auth-logo-text">SafeDoc</div>
            <div className="auth-logo-sub">Impression sécurisée</div>
          </div>
        </div>

        <h1 className="auth-title">Créer un compte</h1>
        <p className="auth-subtitle">Rejoignez SafeDoc et protégez vos documents officiels</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input type="text" className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder="Amadou Diallo" value={form.fullName} onChange={set('fullName')} autoComplete="name" />
            {errors.fullName && <div className="form-error">⚠ {errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Adresse email</label>
            <input type="email" className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="vous@exemple.sn" value={form.email} onChange={set('email')} autoComplete="email" />
            {errors.email && <div className="form-error">⚠ {errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Téléphone <span style={{ color: 'var(--g400)', fontWeight: 400 }}>(optionnel)</span></label>
            <input type="tel" className="form-input" placeholder="+221 77 000 00 00" value={form.phone} onChange={set('phone')} autoComplete="tel" />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input type="password" className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Minimum 8 caractères" value={form.password} onChange={set('password')} autoComplete="new-password" />
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

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.agree} onChange={set('agree')} style={{ marginTop: 3, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--g600)', lineHeight: 1.5 }}>
                J'accepte les <a href="#" className="auth-link">Conditions d'utilisation</a> et la <a href="#" className="auth-link">Politique de confidentialité</a>
              </span>
            </label>
            {errors.agree && <div className="form-error" style={{ marginTop: 6 }}>⚠ {errors.agree}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span style={{ animation: 'spin .8s linear infinite', display: 'inline-block' }}>⚙</span> Création…</> : '→ Créer mon compte'}
          </button>
        </form>

        <hr className="divider" />
        <div className="auth-footer">Déjà un compte ? <Link to="/login" className="auth-link">Se connecter</Link></div>
      </div>
    </div>
  );
}

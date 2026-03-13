import React, { useState } from 'react';

function Toggle({ on, onChange }) {
  return (
    <button className={`toggle ${on ? 'on' : 'off'}`} onClick={() => onChange(!on)} type="button">
      <div className="toggle-thumb" />
    </button>
  );
}

function Row({ label, desc, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--g100)' }}>
      <div>
        <div style={{ fontSize: 14, color: 'var(--g800)' }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--g400)', marginTop: 2 }}>{desc}</div>}
      </div>
      {right}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--g400)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>{title}</div>
      {children}
    </div>
  );
}

export default function Securite() {
  const [mfa,    setMfa]    = useState(false);
  const [notifs, setNotifs] = useState(true);
  const [autoEx, setAutoEx] = useState('15');

  const score      = mfa ? 98 : 74;
  const scoreColor = mfa ? 'var(--teal)' : 'var(--amber)';

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Sécurité</h1>
        <p className="page-sub">Paramètres de protection de votre compte et de vos documents</p>
      </div>

      {/* Score */}
      <div style={{ marginBottom: 20, padding: '20px 24px', background: 'linear-gradient(135deg,var(--teal-soft),var(--blue-soft))', border: '1px solid var(--teal-light)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 52, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 11, color: 'var(--g400)', marginTop: 2 }}>/100</div>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--g900)', marginBottom: 4 }}>Score de sécurité</div>
          <div style={{ fontSize: 13, color: 'var(--g500)' }}>
            {mfa ? 'Excellent — Authentification double facteur activée ✓' : 'Activez le 2FA pour atteindre 98/100'}
          </div>
        </div>
      </div>

      <Section title="Authentification">
        <Row label="Authentification à deux facteurs (TOTP)" desc="Compatible Google Authenticator, Authy" right={<Toggle on={mfa} onChange={setMfa} />} />
        <Row label="Sessions actives" desc="1 session active · Dakar, Sénégal" right={<button className="btn btn-danger btn-sm">Tout déconnecter</button>} />
        <Row label="Modifier le mot de passe" right={<button className="btn btn-ghost btn-sm">Modifier →</button>} />
      </Section>

      <Section title="Liens d'impression">
        <Row
          label="Durée d'expiration par défaut"
          desc="Appliquée à tous les nouveaux liens générés"
          right={
            <select className="form-select" style={{ width: 'auto', padding: '7px 32px 7px 12px' }} value={autoEx} onChange={e => setAutoEx(e.target.value)}>
              <option value="1">1 minute</option>
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
            </select>
          }
        />
        <Row label="Notifications d'impression" desc="Alerte email/SMS après chaque impression" right={<Toggle on={notifs} onChange={setNotifs} />} />
      </Section>

      <Section title="Données & Confidentialité">
        <Row label="Chiffrement des fichiers" desc="AES-256-GCM — actif sur tous vos documents stockés" right={<span className="badge badge-green">● Actif</span>} />
        <Row label="Stockage sécurisé" desc="AWS S3 Europe (Paris) — conformité RGPD garantie" right={<span className="chip chip-teal" style={{ fontSize: 11 }}>AWS S3</span>} />
        <Row label="Exporter mes données" desc="Archive chiffrée de tous vos documents" right={<button className="btn btn-ghost btn-sm">Exporter →</button>} />
        <Row label="Supprimer mon compte" desc="Suppression irréversible de toutes vos données" right={<button className="btn btn-danger btn-sm">Supprimer</button>} />
      </Section>
    </div>
  );
}

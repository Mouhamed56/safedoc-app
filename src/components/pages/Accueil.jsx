import React, { useState, useEffect } from 'react';

function fmt(secs) {
  return `${Math.floor(secs/60).toString().padStart(2,'0')}:${(secs%60).toString().padStart(2,'0')}`;
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + '18' }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div className="stat-val" style={{ color }}>{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

function TokenRow({ token, onRevoke }) {
  const [rem, setRem] = useState(token.remainingSeconds);

  useEffect(() => {
    if (rem <= 0) return;
    const t = setInterval(() => setRem(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const pct    = Math.max(0, (rem / token.totalSeconds) * 100);
  const urgent = rem < 60;

  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--g100)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{token.docIcon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--g900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{token.docName}</div>
          <div style={{ fontSize: 11, color: 'var(--g400)', marginTop: 1 }}>
            Créé à {new Date(token.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className={`countdown ${urgent ? 'urgent' : ''}`} style={{ fontSize: 20 }}>{fmt(rem)}</div>
        <button className="btn btn-danger btn-sm" onClick={() => onRevoke(token.id)}>✕</button>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: urgent ? 'var(--red)' : 'linear-gradient(90deg,var(--blue),var(--teal))' }} />
      </div>
    </div>
  );
}

export default function Accueil({ docs, tokens, logs, setPage, onRevoke }) {
  const ok      = logs.filter(l => l.status === 'success').length;
  const blocked = logs.filter(l => l.status === 'blocked').length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-sub">Vue d'ensemble de vos documents et accès sécurisés</p>
      </div>

      <div className="stats-grid">
        <StatCard icon="📄" value={docs.length}   label="Documents"    color="#1A56DB" />
        <StatCard icon="🔗" value={tokens.length} label="Liens actifs" color="#0D9488" />
        <StatCard icon="✓"  value={ok}            label="Impressions"  color="#16A34A" />
        <StatCard icon="⛔" value={blocked}       label="Bloqués"      color="#DC2626" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Liens actifs */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--g500)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Liens actifs</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage('generer')}>+ Nouveau</button>
          </div>
          {tokens.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--g400)', fontSize: 14 }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>🔗</div>Aucun lien actif
            </div>
          ) : tokens.map(t => <TokenRow key={t.id} token={t} onRevoke={onRevoke} />)}
        </div>

        {/* Accès récents */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--g500)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Accès récents</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage('historique')}>Tout voir</button>
          </div>
          {logs.slice(0, 5).map((log, i) => {
            const cfg = { success: { bg: '#F0FDF4', icon: '✓' }, expired: { bg: '#FFFBEB', icon: '⏱' }, blocked: { bg: '#FEF2F2', icon: '⛔' } }[log.status];
            return (
              <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--g100)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{cfg.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--g800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.doc}</div>
                  <div style={{ fontSize: 11, color: 'var(--g400)', marginTop: 2 }}>{log.time}</div>
                </div>
                <span className={`badge badge-${log.status === 'success' ? 'green' : log.status === 'expired' ? 'amber' : 'red'}`}>
                  {log.status === 'success' ? 'Succès' : log.status === 'expired' ? 'Expiré' : 'Bloqué'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security banner */}
      <div style={{ marginTop: 16, padding: '14px 18px', background: 'var(--teal-soft)', border: '1px solid var(--teal-light)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 22 }}>🛡️</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)' }}>Protection active</div>
          <div style={{ fontSize: 12, color: 'var(--g500)', marginTop: 2 }}>
            Tous vos documents sont chiffrés AES-256. Les kiosques n'ont jamais accès à vos fichiers réels.
          </div>
        </div>
      </div>
    </div>
  );
}

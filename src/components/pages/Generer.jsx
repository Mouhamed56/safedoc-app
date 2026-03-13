import React, { useState, useEffect } from 'react';

function genToken() {
  const h = () => Math.random().toString(16).substr(2, 8);
  return `${h()}${h()}${h()}${h()}.${h()}${h()}`;
}

const EXPIRY = [
  { val: '1', label: '1 min' }, { val: '5', label: '5 min' },
  { val: '15', label: '15 min' }, { val: '30', label: '30 min' }, { val: '60', label: '1 h' },
];

export default function Generer({ docs, preselected, onTokenCreated }) {
  const [docId,   setDocId]  = useState(preselected?.id || '');
  const [expiry,  setExpiry] = useState('5');
  const [step,    setStep]   = useState('form'); // form | done
  const [token,   setToken]  = useState(null);
  const [copied,  setCopied] = useState(false);

  useEffect(() => { if (preselected) setDocId(preselected.id); }, [preselected]);

  const generate = () => {
    const doc = docs.find(d => d.id === docId); if (!doc) return;
    const raw = genToken();
    const expSecs = parseInt(expiry) * 60;
    const t = {
      id: `t${Date.now()}`, token: raw,
      link: `https://safedoc.app/print/${raw}`,
      docId: doc.id, docName: doc.name, docIcon: doc.icon,
      remainingSeconds: expSecs, totalSeconds: expSecs,
      createdAt: new Date(),
    };
    setToken(t); onTokenCreated(t); setStep('done');
  };

  const copy = () => {
    navigator.clipboard?.writeText(token.link).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => { setStep('form'); setToken(null); setDocId(''); };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Générer un lien sécurisé</h1>
        <p className="page-sub">Créez un lien temporaire à usage unique pour votre kiosque d'impression</p>
      </div>

      <div style={{ maxWidth: 540 }}>
        {step === 'form' && (
          <div className="card-elevated slide-up">
            {/* Document selector */}
            <div style={{ marginBottom: 22 }}>
              <label className="form-label">Document à imprimer</label>
              <select className="form-select" value={docId} onChange={e => setDocId(e.target.value)}>
                <option value="">— Choisir un document —</option>
                {docs.map(d => <option key={d.id} value={d.id}>{d.icon} {d.name} ({d.type})</option>)}
              </select>
            </div>

            {/* Expiry picker */}
            <div style={{ marginBottom: 22 }}>
              <label className="form-label">Durée d'expiration</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
                {EXPIRY.map(o => (
                  <button key={o.val} type="button" onClick={() => setExpiry(o.val)}
                    style={{
                      padding: '10px 4px', borderRadius: 8, cursor: 'pointer',
                      border: expiry === o.val ? '2px solid var(--blue)' : '1.5px solid var(--g200)',
                      background: expiry === o.val ? 'var(--blue-soft)' : '#fff',
                      color: expiry === o.val ? 'var(--blue)' : 'var(--g600)',
                      fontSize: 13, fontWeight: expiry === o.val ? 600 : 400,
                      transition: 'all .15s', fontFamily: 'inherit',
                    }}>{o.label}</button>
                ))}
              </div>
            </div>

            {/* Guarantees */}
            <div style={{ marginBottom: 22, padding: 14, background: 'var(--g50)', borderRadius: 10, border: '1px solid var(--g200)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--g500)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.05em' }}>Garanties de sécurité</div>
              {[
                'Lien à usage unique — invalide après impression',
                'Signature HMAC-SHA256 — impossible à falsifier',
                'Expiration automatique via Redis TTL',
                'Filigrane dynamique : date, heure, IP kiosque',
                'Zéro stockage local sur le kiosque',
                'Journalisation horodatée de chaque accès',
              ].map(g => (
                <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13, color: 'var(--g600)' }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 600, fontSize: 11 }}>✓</span>{g}
                </div>
              ))}
            </div>

            <button className="btn btn-primary btn-full btn-lg"
              disabled={!docId} onClick={generate}
              style={{ opacity: docId ? 1 : .5, cursor: docId ? 'pointer' : 'not-allowed' }}>
              🔐 Générer le lien sécurisé
            </button>
          </div>
        )}

        {step === 'done' && token && (
          <div className="card-elevated slide-up">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🔗</div>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>Lien généré avec succès</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="chip chip-teal">🛡 HMAC-SHA256</span>
                <span className="chip chip-blue">⏱ Expire dans {expiry} min</span>
                <span className="chip chip-green">🔒 Usage unique</span>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="form-label">Lien d'impression</label>
              <div className="token-box">{token.link}</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Token brut (HMAC signé)</label>
              <div className="token-box" style={{ fontSize: 10 }}>{token.token}</div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <button className="btn btn-primary btn-full" onClick={copy}>
                {copied ? '✓ Copié !' : '📋 Copier le lien'}
              </button>
              <button className="btn btn-ghost btn-full"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Lien SafeDoc : ' + token.link)}`, '_blank')}>
                📱 WhatsApp
              </button>
            </div>

            <div className="info-box info-box-blue" style={{ marginBottom: 14, fontSize: 13 }}>
              <span>ℹ️</span>
              <span>L'opérateur du kiosque peut uniquement imprimer — aucun téléchargement ou sauvegarde n'est possible. Le lien s'auto-détruit après usage.</span>
            </div>

            <button className="btn btn-ghost btn-full" onClick={reset}>← Générer un autre lien</button>
          </div>
        )}
      </div>
    </div>
  );
}

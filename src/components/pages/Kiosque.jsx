import React, { useState, useRef } from 'react';

function fmt(secs) {
  return `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;
}

export default function Kiosque({ activeTokens }) {
  const [input, setInput] = useState('');
  const [step,  setStep]  = useState('idle'); // idle | viewing | printing | done | error
  const [found, setFound] = useState(null);
  const [cd,    setCd]    = useState(0);
  const timerRef = useRef();
  const now = new Date();

  const open = () => {
    const raw   = input.replace('https://safedoc.app/print/', '').trim();
    const match = activeTokens.find(t => t.token === raw || t.link === input.trim());
    if (!match || match.remainingSeconds <= 0) { setStep('error'); return; }
    setFound(match);
    setCd(match.remainingSeconds);
    setStep('viewing');
    timerRef.current = setInterval(() => {
      setCd(c => {
        if (c <= 1) { clearInterval(timerRef.current); setStep('idle'); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const print = () => {
    clearInterval(timerRef.current);
    setStep('printing');
    setTimeout(() => setStep('done'), 2000);
  };

  const reset = () => { setStep('idle'); setInput(''); setFound(null); setCd(0); };

  const wmText = `SAFEDOC · ${now.toLocaleDateString('fr-FR')} · ${now.toLocaleTimeString('fr-FR')} · IMPRESSION UNIQUE`;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Vue kiosque</h1>
        <p className="page-sub">Simulation de l'interface opérateur — lecture seule, impression sécurisée</p>
      </div>

      <div className="kiosk-frame">
        {/* Browser bar */}
        <div className="kiosk-bar">
          <div className="kiosk-dots">
            {['#FF5F57','#FEBC2E','#28C840'].map(c => (
              <div key={c} className="kiosk-dot" style={{ background: c }} />
            ))}
          </div>
          <div className="kiosk-url">
            <span style={{ color: 'var(--green)', fontSize: 11 }}>🔒</span>
            safedoc.app/print/…
          </div>
          <span className="chip chip-teal" style={{ fontSize: 11 }}>🖨 Mode Kiosque</span>
        </div>

        <div className="kiosk-body">

          {/* IDLE */}
          {step === 'idle' && (
            <div className="slide-up" style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🖨️</div>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>Impression sécurisée SafeDoc</h2>
              <p style={{ fontSize: 14, color: 'var(--g500)', marginBottom: 22 }}>
                Collez le lien reçu par WhatsApp ou entrez-le manuellement
              </p>
              <input className="form-input"
                placeholder="https://safedoc.app/print/…"
                value={input} onChange={e => setInput(e.target.value)}
                style={{ textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, marginBottom: 12 }}
              />
              <button className="btn btn-teal btn-full btn-lg" onClick={open}>Accéder au document →</button>
              <div style={{ marginTop: 14, fontSize: 12, color: 'var(--g400)', lineHeight: 1.7 }}>
                🔒 Aucun fichier ne sera enregistré sur cet appareil.<br />Le lien est à usage unique et expire automatiquement.
              </div>

              {activeTokens.length > 0 && (
                <div style={{ marginTop: 18, padding: 14, background: 'var(--blue-soft)', border: '1px solid var(--blue-light)', borderRadius: 10, textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue)', marginBottom: 10 }}>🎯 Liens disponibles (démo)</div>
                  {activeTokens.slice(0, 3).map(t => (
                    <button key={t.id} onClick={() => setInput(t.link)}
                      style={{ display: 'block', width: '100%', textAlign: 'left', background: '#fff', border: '1px solid var(--blue-light)', borderRadius: 6, padding: '7px 10px', marginBottom: 6, cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--blue)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.docIcon} {t.docName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ERROR */}
          {step === 'error' && (
            <div className="slide-up" style={{ maxWidth: 360, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⛔</div>
              <h2 style={{ fontSize: 20, color: 'var(--red)', marginBottom: 8 }}>Accès refusé</h2>
              <p style={{ fontSize: 14, color: 'var(--g500)', marginBottom: 20 }}>
                Ce lien est invalide, expiré ou a déjà été utilisé. Un lien ne peut être utilisé qu'une seule fois.
              </p>
              <button className="btn btn-ghost" onClick={reset}>← Réessayer</button>
            </div>
          )}

          {/* VIEWING */}
          {step === 'viewing' && found && (
            <div className="slide-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 18, color: 'var(--green)' }}>✓</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>Document vérifié — Token authentique</div>
                  <div style={{ fontSize: 11, color: 'var(--g400)' }}>Signature HMAC-SHA256 valide · Usage unique · Chiffrement actif</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 2 }}>Expire dans</div>
                  <div className={`countdown ${cd < 60 ? 'urgent' : ''}`}>{fmt(cd)}</div>
                </div>
              </div>

              {/* Paper */}
              <div className="kiosk-paper">
                <div className="watermark">{wmText}</div>
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>{found.docIcon}</div>
                  <div style={{ fontSize: 10, letterSpacing: '.14em', color: '#9CA3AF', marginBottom: 6, fontFamily: "'JetBrains Mono',monospace" }}>REPUBLIQUE DU SENEGAL</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{found.docName.toUpperCase()}</div>
                  <div style={{ width: 60, height: 2, background: '#1A56DB', margin: '0 auto 20px' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px', maxWidth: 300, margin: '0 auto', textAlign: 'left' }}>
                    {[['Nom','DIALLO'],['Prénom','Amadou'],['Né le','15/03/1995'],['N° pièce','SN-2019-XXXXX'],['Délivré le','12/01/2025'],['Expire le','12/01/2030']].map(([k,v]) => (
                      <React.Fragment key={k}>
                        <div style={{ fontSize: 10, color: '#9CA3AF' }}>{k}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{v}</div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div style={{ marginTop: 18, fontSize: 9, color: '#9CA3AF', fontFamily: "'JetBrains Mono',monospace" }}>
                    {now.toLocaleDateString('fr-FR')} {now.toLocaleTimeString('fr-FR')} · REF: {found.id.toUpperCase().slice(-8)}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ padding: '8px 12px', background: 'var(--red-soft)', border: '1px solid #FECACA', borderRadius: 8, fontSize: 12, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 5 }}>⛔ Téléchargement désactivé</div>
                  <div style={{ padding: '8px 12px', background: 'var(--g100)', border: '1px solid var(--g200)', borderRadius: 8, fontSize: 12, color: 'var(--g500)', display: 'flex', alignItems: 'center', gap: 5 }}>🚫 Capture écran bloquée</div>
                </div>
                <button className="btn btn-teal" style={{ padding: '11px 24px', fontSize: 15, fontWeight: 600 }} onClick={print}>
                  🖨️ Imprimer maintenant
                </button>
              </div>
            </div>
          )}

          {/* PRINTING */}
          {step === 'printing' && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 14, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>Impression en cours…</h2>
              <p style={{ fontSize: 14, color: 'var(--g500)' }}>Invalidation du token en parallèle</p>
            </div>
          )}

          {/* DONE */}
          {step === 'done' && (
            <div className="slide-up" style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontSize: 22, marginBottom: 10 }}>Impression réussie</h2>
              <p style={{ fontSize: 14, color: 'var(--g500)', maxWidth: 360, margin: '0 auto 20px' }}>
                Le lien a été automatiquement invalidé. Aucune copie supplémentaire n'est possible.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                <span className="badge badge-gray">🔒 Lien expiré</span>
                <span className="badge badge-gray">📋 Accès journalisé</span>
                <span className="badge badge-gray">⛔ Usage consommé</span>
              </div>
              <button className="btn btn-ghost" onClick={reset}>← Nouvelle impression</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

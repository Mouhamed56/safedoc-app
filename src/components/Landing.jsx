import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── tiny hook: intersection observer for reveal animations ── */
function useReveal() {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ── Feature card ── */
function FeatureCard({ icon, title, desc, color, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#fff',
          border: `1.5px solid ${hovered ? color + '55' : '#E8EDF5'}`,
          borderRadius: 20,
          padding: '28px 24px',
          transition: 'all .3s ease',
          transform: hovered ? 'translateY(-4px)' : 'none',
          boxShadow: hovered ? `0 16px 40px ${color}18` : '0 2px 12px rgba(0,0,0,.04)',
          cursor: 'default',
        }}
      >
        <div style={{ width: 52, height: 52, borderRadius: 14, background: color + '15', border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18 }}>
          {icon}
        </div>
        <div style={{ fontFamily: "'Clash Display', 'Syne', sans-serif", fontSize: 17, fontWeight: 600, color: '#0A0F1E', marginBottom: 8, letterSpacing: '-.02em' }}>{title}</div>
        <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.65 }}>{desc}</div>
      </div>
    </Reveal>
  );
}

/* ── Step ── */
function Step({ num, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1A56DB,#0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Clash Display','Syne',sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', flex: '0 0 44px' }}>
          {num}
        </div>
        <div style={{ paddingTop: 6 }}>
          <div style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: 17, fontWeight: 600, color: '#0A0F1E', marginBottom: 6, letterSpacing: '-.01em' }}>{title}</div>
          <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.65 }}>{desc}</div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Stat pill ── */
function Stat({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: 40, fontWeight: 700, background: 'linear-gradient(135deg,#1A56DB,#0D9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 6, letterSpacing: '.02em' }}>{label}</div>
    </div>
  );
}

/* ── Main Landing ── */
export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const FEATURES = [
    { icon: '🔐', color: '#1A56DB', title: 'Chiffrement AES-256', desc: 'Chaque document est chiffré côté client avant tout envoi. Ni SafeDoc, ni le kiosque ne peuvent lire votre fichier original.', delay: 0.0 },
    { icon: '🔗', color: '#0D9488', title: 'Liens à usage unique', desc: 'Chaque lien expire après la première impression. Signés HMAC-SHA256 — impossibles à forger ou à réutiliser.', delay: 0.1 },
    { icon: '🖨️', color: '#7C3AED', title: 'Kiosque lecture seule', desc: 'L\'opérateur appuie sur Imprimer, c\'est tout. Téléchargement désactivé, capture écran bloquée, zéro stockage local.', delay: 0.2 },
    { icon: '💧', color: '#DC2626', title: 'Filigrane dynamique', desc: 'Chaque impression est marquée avec la date, l\'heure et l\'adresse IP du kiosque — traçabilité complète.', delay: 0.3 },
    { icon: '⏱️', color: '#D97706', title: 'Expiration automatique', desc: 'Redis TTL supprime le lien en 1, 5, 15 ou 60 minutes. Aucune intervention manuelle requise.', delay: 0.4 },
    { icon: '📋', color: '#059669', title: 'Audit complet', desc: 'Chaque accès est journalisé : kiosque, IP, horodatage, statut. Exportable pour conformité RGPD.', delay: 0.5 },
  ];

  const STEPS = [
    { num: '1', title: 'Créez votre compte', desc: 'Inscription sécurisée en 30 secondes. Votre identité est vérifiée par email.' },
    { num: '2', title: 'Uploadez votre document', desc: 'PDF, JPG ou PNG — chiffré AES-256 automatiquement avant tout envoi vers AWS S3.' },
    { num: '3', title: 'Générez un lien sécurisé', desc: 'Choisissez la durée d\'expiration (1 à 60 min). Copiez et envoyez par WhatsApp.' },
    { num: '4', title: 'Le kiosque imprime', desc: 'L\'opérateur ouvre le lien, voit le document en lecture seule et imprime. Le lien s\'invalide immédiatement.' },
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        background: scrolled ? 'rgba(255,255,255,.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E8EDF5' : '1px solid transparent',
        transition: 'all .35s ease',
        padding: '0 40px', height: 64, display: 'flex', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1A56DB,#0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🔐</div>
          <span style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: 20, fontWeight: 700, color: '#0A0F1E', letterSpacing: '-.03em' }}>SafeDoc</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate('/login')} style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: 'transparent', color: '#475569', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}
            onMouseEnter={e => e.target.style.background = '#F8FAFC'}
            onMouseLeave={e => e.target.style.background = 'transparent'}>
            Connexion
          </button>
          <button onClick={() => navigate('/register')} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#1A56DB,#0D9488)', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 12px rgba(26,86,219,.3)', transition: 'all .2s' }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px rgba(26,86,219,.4)'; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 2px 12px rgba(26,86,219,.3)'; }}>
            Commencer gratuitement →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 40px 80px', position: 'relative', overflow: 'hidden' }}>

        {/* Background decoration */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,86,219,.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 780, textAlign: 'center', position: 'relative' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 100, background: '#EFF5FF', border: '1px solid #BFDBFE', marginBottom: 28, animation: 'fadeIn .6s ease forwards' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1A56DB', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, color: '#1447B8', fontWeight: 500 }}>Plateforme GovTech · Impression sécurisée</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 700, color: '#0A0F1E', lineHeight: 1.05, letterSpacing: '-.04em', marginBottom: 24, animation: 'slideUp .7s ease forwards' }}>
            Vos documents officiels,<br />
            <span style={{ background: 'linear-gradient(135deg,#1A56DB 30%,#0D9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>imprimés sans risque.</span>
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: 'clamp(16px, 2.5vw, 19px)', color: '#64748B', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px', animation: 'slideUp .7s ease .1s both' }}>
            SafeDoc génère des liens temporaires chiffrés pour que les kiosques et cybercafés puissent imprimer vos documents — sans jamais y accéder.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animation: 'slideUp .7s ease .2s both' }}>
            <button onClick={() => navigate('/register')}
              style={{ padding: '14px 32px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#1A56DB,#0D9488)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(26,86,219,.35)', transition: 'all .25s', letterSpacing: '-.01em' }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 28px rgba(26,86,219,.45)'; }}
              onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 20px rgba(26,86,219,.35)'; }}>
              Créer un compte gratuitement
            </button>
            <button onClick={() => navigate('/login')}
              style={{ padding: '14px 28px', borderRadius: 12, border: '1.5px solid #E2E8F0', background: '#fff', color: '#334155', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .25s' }}
              onMouseEnter={e => { e.target.style.borderColor = '#CBD5E1'; e.target.style.background = '#F8FAFC'; }}
              onMouseLeave={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#fff'; }}>
              Voir la démo →
            </button>
          </div>

          {/* Trust line */}
          <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontSize: 13, color: '#94A3B8', animation: 'slideUp .7s ease .3s both', flexWrap: 'wrap' }}>
            {['🔒 Chiffrement AES-256', '✓ Aucun stockage côté kiosque', '⚡ Lien en 10 secondes'].map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '60px 40px', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {[['256-bit','Chiffrement AES'],['< 10s','Génération du lien'],['0','Stockage kiosque'],['100%','RGPD conforme']].map(([v, l]) => (
            <Reveal key={l} delay={0.1}>
              <Stat value={v} label={l} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#1A56DB', marginBottom: 14 }}>Comment ça marche</div>
              <h2 style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: '#0A0F1E', letterSpacing: '-.03em', lineHeight: 1.15 }}>
                Simple pour vous.<br />Impossible à contourner.
              </h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px 80px' }}>
            {STEPS.map((s, i) => (
              <Step key={s.num} {...s} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '80px 40px', background: '#FAFBFF' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#0D9488', marginBottom: 14 }}>Sécurité de bout en bout</div>
              <h2 style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: '#0A0F1E', letterSpacing: '-.03em' }}>
                Conçu pour zéro compromis.
              </h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── SECURITY DEEP DIVE ── */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <Reveal>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#1A56DB', marginBottom: 16 }}>Architecture de sécurité</div>
              <h2 style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: 36, fontWeight: 700, color: '#0A0F1E', letterSpacing: '-.03em', marginBottom: 20, lineHeight: 1.15 }}>
                Le kiosque ne voit jamais votre fichier.
              </h2>
              <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.75, marginBottom: 28 }}>
                Votre document est chiffré <strong style={{ color: '#334155' }}>avant</strong> de quitter votre appareil. Le lien donne accès à un rendu temporaire — jamais au fichier réel. Après impression, tout est supprimé.
              </p>
              {[
                ['🔐', 'Chiffrement AES-256-GCM côté client'],
                ['🛡️', 'Token HMAC-SHA256 à usage unique'],
                ['🌊', 'Streaming PDF — jamais d\'URL S3 exposée'],
                ['🗑️', 'Suppression Redis automatique post-impression'],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '10px 16px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E8EDF5' }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 14, color: '#334155', fontWeight: 450 }}>{text}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            {/* Visual: flow diagram */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E8EDF5', borderRadius: 24, padding: 32 }}>
              {[
                { icon: '👤', label: 'Citoyen', sub: 'Upload + chiffrement', color: '#1A56DB' },
                { icon: '☁️', label: 'AWS S3', sub: 'Stockage chiffré AES-256', color: '#7C3AED' },
                { icon: '🔗', label: 'Lien sécurisé', sub: 'HMAC-SHA256 · expiration TTL', color: '#0D9488' },
                { icon: '🖨️', label: 'Kiosque', sub: 'Lecture seule · impression unique', color: '#059669' },
              ].map((node, i, arr) => (
                <div key={node.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: '#fff', borderRadius: 12, border: `1.5px solid ${node.color}22`, boxShadow: `0 2px 12px ${node.color}10` }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: node.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{node.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0A0F1E' }}>{node.label}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{node.sub}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: node.color }} />
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 28px' }}>
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,#CBD5E1,transparent)' }} />
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>↓</span>
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,#CBD5E1,transparent)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '100px 40px', background: 'linear-gradient(135deg, #0A1628 0%, #0D2444 50%, #0A1E3A 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,86,219,.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Reveal>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🔐</div>
            <h2 style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: 'clamp(28px,5vw,48px)', fontWeight: 700, color: '#fff', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: 20 }}>
              Protégez vos documents<br />dès aujourd'hui.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, marginBottom: 40 }}>
              Gratuit, sécurisé, sans installation. Vos documents officiels ne méritent pas moins.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')}
                style={{ padding: '15px 36px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#1A56DB,#0D9488)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 24px rgba(26,86,219,.5)', transition: 'all .25s' }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 32px rgba(26,86,219,.6)'; }}
                onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 24px rgba(26,86,219,.5)'; }}>
                Créer un compte gratuitement
              </button>
              <button onClick={() => navigate('/login')}
                style={{ padding: '15px 28px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.85)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(8px)', transition: 'all .25s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,.12)'; e.target.style.borderColor = 'rgba(255,255,255,.35)'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,.06)'; e.target.style.borderColor = 'rgba(255,255,255,.2)'; }}>
                Voir la démo →
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '32px 40px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#1A56DB,#0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🔐</div>
          <span style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: 16, fontWeight: 700, color: '#0A0F1E' }}>SafeDoc</span>
        </div>
        <div style={{ fontSize: 13, color: '#94A3B8' }}>
          © 2025 SafeDoc · Impression sécurisée de documents officiels · RGPD conforme
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Confidentialité', 'CGU', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => e.target.style.color = '#1A56DB'}
              onMouseLeave={e => e.target.style.color = '#94A3B8'}>
              {l}
            </a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  );
}

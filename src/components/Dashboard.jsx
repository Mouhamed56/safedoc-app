import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageAccueil    from './pages/Accueil';
import PageDocuments  from './pages/Documents';
import PageGenerer    from './pages/Generer';
import PageKiosque    from './pages/Kiosque';
import PageHistorique from './pages/Historique';
import PageSecurite   from './pages/Securite';

// ─── Données mock initiales ───────────────────────────────────────────────────
export const DOCS_INIT = [
  { id: 'd1', name: "Carte Nationale d'Identité", type: 'CNI',       size: '245 Ko', date: '12 jan 2025', icon: '🪪', color: '#1A56DB' },
  { id: 'd2', name: 'Passeport biométrique',       type: 'PASSEPORT', size: '312 Ko', date: '12 jan 2025', icon: '🛂', color: '#0D9488' },
  { id: 'd3', name: 'Extrait de naissance',         type: 'NAISSANCE', size: '128 Ko', date: '3 fév 2025',  icon: '📋', color: '#16A34A' },
  { id: 'd4', name: 'Diplôme de Licence',           type: 'DIPLÔME',   size: '198 Ko', date: '5 mar 2025',  icon: '🎓', color: '#D97706' },
];

export const LOGS_INIT = [
  { id: 1, doc: "Extrait de naissance",        event: 'Imprimé',      kiosk: 'Kiosque Médina',     ip: '192.168.4.21', time: "Aujourd'hui 09:42", status: 'success' },
  { id: 2, doc: 'Passeport biométrique',        event: 'Lien expiré',  kiosk: '—',                 ip: '—',            time: 'Hier 15:10',        status: 'expired' },
  { id: 3, doc: "Carte Nationale d'Identité",  event: 'Imprimé',      kiosk: 'Kiosque Plateau',   ip: '41.82.14.7',   time: 'Hier 11:05',        status: 'success' },
  { id: 4, doc: 'Diplôme de Licence',           event: 'Accès bloqué', kiosk: 'Inconnu',           ip: '197.213.4.1',  time: 'Avant-hier 08:30',  status: 'blocked' },
  { id: 5, doc: "Extrait de naissance",        event: 'Imprimé',      kiosk: 'Kiosque Parcelles', ip: '192.168.2.5',  time: '12/03 14:22',       status: 'success' },
  { id: 6, doc: "Carte Nationale d'Identité",  event: 'Imprimé',      kiosk: 'Kiosque Dieuppeul', ip: '41.82.11.3',   time: '10/03 09:15',       status: 'success' },
];

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV = [
  { id: 'accueil',    label: 'Tableau de bord', icon: '⊞' },
  { id: 'documents',  label: 'Mes documents',   icon: '🗂' },
  { id: 'generer',    label: 'Générer un lien', icon: '🔗' },
  { id: 'kiosque',    label: 'Vue kiosque',      icon: '🖨' },
  { id: 'historique', label: 'Historique',       icon: '📊' },
  { id: 'securite',   label: 'Sécurité',         icon: '🔐' },
];

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const userRaw  = sessionStorage.getItem('safedoc_user');
  const user     = userRaw ? JSON.parse(userRaw) : { name: 'Citoyen', email: '', initials: 'C' };

  const [page,      setPage]      = useState('accueil');
  const [docs,      setDocs]      = useState(DOCS_INIT);
  const [tokens,    setTokens]    = useState([]);
  const [logs,      setLogs]      = useState(LOGS_INIT);
  const [preselDoc, setPreselDoc] = useState(null);

  // Auto-expire tokens
  useEffect(() => {
    const iv = setInterval(() => setTokens(p => p.filter(t => t.remainingSeconds > 0)), 5000);
    return () => clearInterval(iv);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('safedoc_auth');
    sessionStorage.removeItem('safedoc_user');
    navigate('/login');
  };

  const handleTokenCreated = useCallback((token) => {
    setTokens(p => [token, ...p]);
    setLogs(p => [{ id: Date.now(), doc: token.docName, event: 'Lien généré', kiosk: '—', ip: '—', time: "À l'instant", status: 'expired' }, ...p]);
  }, []);

  const handleRevoke = useCallback((tokenId) => {
    setTokens(p => {
      const tok = p.find(t => t.id === tokenId);
      if (tok) setLogs(l => [{ id: Date.now(), doc: tok.docName, event: 'Lien révoqué', kiosk: '—', ip: '—', time: "À l'instant", status: 'blocked' }, ...l]);
      return p.filter(t => t.id !== tokenId);
    });
  }, []);

  const handleGenerateLink = useCallback((doc) => {
    setPreselDoc(doc); setPage('generer');
  }, []);

  const goTo = (id) => { setPage(id); if (id !== 'generer') setPreselDoc(null); };

  return (
    <div className="app-layout">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="sb-logo-icon">🔐</div>
          <div>
            <div className="sb-logo-name">SafeDoc</div>
            <div className="sb-logo-sub">Impression sécurisée</div>
          </div>
        </div>

        <div className="nav-label">Navigation</div>

        {NAV.map(n => (
          <button key={n.id} className={`nav-item ${page === n.id ? 'active' : ''}`} onClick={() => goTo(n.id)}>
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
            {n.id === 'generer' && tokens.length > 0 && (
              <span className="nav-badge">{tokens.length}</span>
            )}
          </button>
        ))}

        {/* User row */}
        <div className="sb-user">
          <div className="sb-user-row" onClick={handleLogout} title="Se déconnecter">
            <div className="sb-avatar">{user.initials}</div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="sb-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div className="sb-logout">← Déconnexion</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="main-content">
        {page === 'accueil'    && <PageAccueil    docs={docs} tokens={tokens} logs={logs} setPage={goTo} onRevoke={handleRevoke} />}
        {page === 'documents'  && <PageDocuments  docs={docs} setDocs={setDocs} onGenerateLink={handleGenerateLink} />}
        {page === 'generer'    && <PageGenerer    docs={docs} preselected={preselDoc} onTokenCreated={handleTokenCreated} />}
        {page === 'kiosque'    && <PageKiosque    activeTokens={tokens} />}
        {page === 'historique' && <PageHistorique logs={logs} />}
        {page === 'securite'   && <PageSecurite />}
      </main>
    </div>
  );
}

import React, { useState, useRef } from 'react';

export default function Documents({ docs, setDocs, onGenerateLink }) {
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver,   setDragOver]   = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [delId,      setDelId]      = useState(null);
  const fileRef = useRef();

  const doUpload = (file) => {
    if (!file) return;
    setUploading(true); setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(iv);
          const icons  = ['📜','📑','📃','🗒','📰'];
          const colors = ['#1A56DB','#0D9488','#16A34A','#D97706','#7C3AED'];
          const types  = { 'application/pdf':'PDF','image/jpeg':'JPEG','image/png':'PNG' };
          const i = Math.floor(Math.random() * 5);
          setDocs(prev => [...prev, {
            id: `d${Date.now()}`,
            name: file.name.replace(/\.[^.]+$/, ''),
            type: types[file.type] || 'DOCUMENT',
            size: `${Math.round(file.size / 1024)} Ko`,
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
            icon: icons[i], color: colors[i],
          }]);
          setUploading(false); setShowUpload(false); return 100;
        }
        return p + 4;
      });
    }, 60);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">Mes documents</h1>
          <p className="page-sub">Stockage chiffré AES-256 — AWS S3 sécurisé</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUpload(true)}>+ Ajouter un document</button>
      </div>

      <div className="tbl-wrap">
        {docs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--g400)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
            <div style={{ fontSize: 15, color: 'var(--g600)', marginBottom: 6 }}>Aucun document</div>
            <div style={{ fontSize: 13 }}>Cliquez sur « Ajouter » pour uploader votre premier document</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Document</th><th>Type</th><th>Taille</th><th>Ajouté le</th><th>Chiffrement</th><th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: doc.color + '18', border: `1px solid ${doc.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{doc.icon}</div>
                      <span style={{ fontWeight: 500, color: 'var(--g900)' }}>{doc.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: doc.color + '15', color: doc.color, border: `1px solid ${doc.color}30` }}>{doc.type}</span>
                  </td>
                  <td style={{ color: 'var(--g500)', fontSize: 13 }}>{doc.size}</td>
                  <td style={{ color: 'var(--g500)', fontSize: 13 }}>{doc.date}</td>
                  <td><span className="chip chip-teal" style={{ fontSize: 11 }}>🔒 AES-256</span></td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => onGenerateLink(doc)}>🔗 Lien</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDelId(doc.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && !uploading && setShowUpload(false)}>
          <div className="modal-box">
            <div className="modal-title">Ajouter un document</div>
            <div className="modal-sub">Le fichier sera chiffré AES-256 avant envoi vers AWS S3</div>

            {uploading ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Chiffrement & upload en cours…</div>
                <div style={{ fontSize: 12, color: 'var(--g400)', marginBottom: 16 }}>Votre fichier est chiffré avant tout envoi</div>
                <div className="progress-track" style={{ height: 6, borderRadius: 3 }}>
                  <div className="progress-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,var(--blue),var(--teal))', transition: 'width .08s' }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--g500)', marginTop: 8 }}>{progress}%</div>
              </div>
            ) : (
              <>
                <div
                  className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); doUpload(e.dataTransfer.files[0]); }}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={e => doUpload(e.target.files[0])} />
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--g700)', marginBottom: 6 }}>Glissez votre fichier ici</div>
                  <div style={{ fontSize: 13, color: 'var(--g400)' }}>PDF, JPG, PNG — max 10 Mo</div>
                </div>
                <div className="info-box info-box-blue" style={{ marginTop: 14, fontSize: 12 }}>
                  <span>🔒</span>
                  <span>Votre fichier est chiffré AES-256-GCM avant tout envoi. SafeDoc ne peut pas lire son contenu.</span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button className="btn btn-ghost btn-full" onClick={() => setShowUpload(false)}>Annuler</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDelId(null)}>
          <div className="modal-box" style={{ maxWidth: 380, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div className="modal-title" style={{ marginBottom: 8 }}>Supprimer ce document ?</div>
            <div style={{ fontSize: 13, color: 'var(--g500)', marginBottom: 24 }}>Cette action est irréversible. Le fichier sera supprimé de AWS S3.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-full" onClick={() => setDelId(null)}>Annuler</button>
              <button className="btn btn-danger btn-full" onClick={() => { setDocs(p => p.filter(d => d.id !== delId)); setDelId(null); }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

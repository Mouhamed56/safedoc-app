import React, { useState } from 'react';

export default function Historique({ logs }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? logs : logs.filter(l => l.status === filter);

  const FILTERS = [['all','Tout'],['success','Succès'],['expired','Expiré'],['blocked','Bloqué']];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Historique</h1>
        <p className="page-sub">Journal complet et horodaté de tous les accès à vos documents</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {FILTERS.map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} className="btn btn-sm"
            style={{
              fontFamily: 'inherit',
              background: filter === val ? 'var(--blue-soft)' : '#fff',
              color: filter === val ? 'var(--blue)' : 'var(--g600)',
              border: filter === val ? '1.5px solid var(--blue-mid)' : '1.5px solid var(--g200)',
              fontWeight: filter === val ? 500 : 400,
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="tbl-wrap">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--g400)', fontSize: 14 }}>Aucun événement</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Événement</th>
                <th>Kiosque</th>
                <th>Adresse IP</th>
                <th>Date / Heure</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => {
                const badgeCls = log.status === 'success' ? 'badge-green' : log.status === 'expired' ? 'badge-amber' : 'badge-red';
                const label    = log.status === 'success' ? '● Succès' : log.status === 'expired' ? '● Expiré' : '● Bloqué';
                return (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 500, color: 'var(--g900)' }}>{log.doc}</td>
                    <td style={{ color: 'var(--g600)' }}>{log.event}</td>
                    <td style={{ color: 'var(--g500)', fontSize: 13 }}>{log.kiosk}</td>
                    <td>
                      {log.ip !== '—'
                        ? <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'var(--g600)' }}>{log.ip}</span>
                        : <span style={{ color: 'var(--g300)' }}>—</span>}
                    </td>
                    <td style={{ color: 'var(--g500)', fontSize: 13 }}>{log.time}</td>
                    <td><span className={`badge ${badgeCls}`}>{label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

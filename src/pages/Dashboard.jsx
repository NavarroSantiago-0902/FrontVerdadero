import { useEffect, useState } from 'react';
import { playersApi, trainingsApi, resultsApi } from '../api';

function ScoreBar({ score }) {
  return (
    <div className="score-bar">
      <span className="score-num">{score}</span>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${Math.min(score * 10, 100)}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ players: 0, trainings: 0, results: 0, avg: '—' });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [players, trainings, results] = await Promise.all([
          playersApi.getAll(), trainingsApi.getAll(), resultsApi.getAll()
        ]);
        const pl = players || []; const tr = trainings || []; const rs = results || [];
        const avg = rs.length ? (rs.reduce((a, r) => a + r.score, 0) / rs.length).toFixed(1) : '—';
        setStats({ players: pl.length, trainings: tr.length, results: rs.length, avg });
        setRecent([...rs].reverse().slice(0, 6));
      } finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Resumen general del equipo</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Jugadores</div><div className="stat-value stat-accent">{stats.players}</div></div>
        <div className="stat-card"><div className="stat-label">Entrenamientos</div><div className="stat-value">{stats.trainings}</div></div>
        <div className="stat-card"><div className="stat-label">Resultados</div><div className="stat-value">{stats.results}</div></div>
        <div className="stat-card"><div className="stat-label">Prom. Score</div><div className="stat-value stat-accent">{stats.avg}</div></div>
      </div>

      <div className="card">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem' }}>Últimos resultados</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Jugador</th><th>Entrenamiento</th><th>Velocidad</th><th>Potencia</th><th>Score</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5"><div className="loading"><span className="spinner" /> Cargando...</div></td></tr>
              ) : recent.length === 0 ? (
                <tr><td colSpan="5"><div className="empty"><div className="empty-icon">📊</div><div className="empty-text">Sin resultados aún</div></div></td></tr>
              ) : recent.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.player?.name || '—'}</strong></td>
                  <td><span className="badge badge-blue">S{r.training?.sessionNumber} — W{r.training?.weekNumber}</span></td>
                  <td>{r.speed} km/h</td>
                  <td>{r.shotPower} km/h</td>
                  <td><ScoreBar score={r.score} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

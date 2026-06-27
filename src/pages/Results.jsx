import { useEffect, useState } from 'react';
import { resultsApi, playersApi, trainingsApi } from '../api';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

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

export default function Results() {
  const [list, setList] = useState([]);
  const [players, setPlayers] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast, show } = useToast();

  const [form, setForm] = useState({
    playerId: '', trainingId: '', shotPower: '', speed: '', passes: '', score: ''
  });

  const load = async () => {
    setLoading(true);
    try { setList(await resultsApi.getAll() || []); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openModal = async () => {
    try {
      const [pl, tr] = await Promise.all([playersApi.getAll(), trainingsApi.getAll()]);
      setPlayers(pl || []);
      setTrainings(tr || []);
      setForm({ playerId: pl?.[0]?.id || '', trainingId: tr?.[0]?.id || '', shotPower: '', speed: '', passes: '', score: '' });
      setModalOpen(true);
    } catch { show('Error cargando datos', 'err'); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    const { playerId, trainingId, shotPower, speed, passes, score } = form;
    if (!playerId || !trainingId || !shotPower || !speed || !passes || !score)
      return show('Completa todos los campos', 'err');
    try {
      await resultsApi.create({
        shotPower: parseFloat(shotPower),
        speed: parseFloat(speed),
        passes: parseInt(passes),
        score: parseFloat(score),
        player: { id: parseInt(playerId) },
        training: { id: parseInt(trainingId) },
      });
      show('Resultado registrado');
      setModalOpen(false);
      load();
    } catch (e) { show(e.message, 'err'); }
  };

  const del = async (id) => {
    if (!window.confirm('¿Eliminar este resultado?')) return;
    try { await resultsApi.delete(id); show('Resultado eliminado'); load(); }
    catch (e) { show(e.message, 'err'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Resultados</div>
          <div className="page-sub">Métricas por jugador y sesión</div>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          + Registrar resultado
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Jugador</th><th>Semana / Sesión</th><th>Velocidad</th><th>Potencia</th><th>Pases</th><th>Score</th><th></th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7"><div className="loading"><span className="spinner" /> Cargando...</div></td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan="7"><div className="empty"><div className="empty-icon">📈</div><div className="empty-text">Sin resultados registrados</div></div></td></tr>
              ) : list.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="row">
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {(r.player?.name || '?').charAt(0).toUpperCase()}
                      </div>
                      {r.player?.name || '—'}
                    </div>
                  </td>
                  <td><span className="badge badge-blue">S{r.training?.sessionNumber} — W{r.training?.weekNumber}</span></td>
                  <td>{r.speed} km/h</td>
                  <td>{r.shotPower} km/h</td>
                  <td>{r.passes}</td>
                  <td><ScoreBar score={r.score} /></td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => del(r.id)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar resultado" wide>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Jugador</label>
            <select className="form-input" value={form.playerId} onChange={set('playerId')}>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Entrenamiento</label>
            <select className="form-input" value={form.trainingId} onChange={set('trainingId')}>
              {trainings.map(t => <option key={t.id} value={t.id}>Semana {t.weekNumber} — Sesión {t.sessionNumber}</option>)}
            </select>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Potencia de tiro (km/h)</label>
            <input className="form-input" type="number" step="0.1" value={form.shotPower} onChange={set('shotPower')} placeholder="85.5" />
          </div>
          <div className="form-group">
            <label className="form-label">Velocidad (km/h)</label>
            <input className="form-input" type="number" step="0.1" value={form.speed} onChange={set('speed')} placeholder="28.0" />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Pases completados</label>
            <input className="form-input" type="number" min="0" value={form.passes} onChange={set('passes')} placeholder="15" />
          </div>
          <div className="form-group">
            <label className="form-label">Score</label>
            <input className="form-input" type="number" step="0.01" value={form.score} onChange={set('score')} placeholder="8.5" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={save}>Guardar</button>
        </div>
      </Modal>

      <Toast toast={toast} />
    </div>
  );
}

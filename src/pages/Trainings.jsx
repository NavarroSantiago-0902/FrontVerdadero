import { useEffect, useState } from 'react';
import { trainingsApi } from '../api';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

function formatDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Trainings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [week, setWeek] = useState('');
  const [session, setSession] = useState('');
  const { toast, show } = useToast();

  const load = async () => {
    setLoading(true);
    try { setList(await trainingsApi.getAll() || []); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!week || !session) return show('Completa semana y sesión', 'err');
    try {
      await trainingsApi.create({ weekNumber: parseInt(week), sessionNumber: parseInt(session) });
      show('Entrenamiento creado');
      setModalOpen(false); setWeek(''); setSession('');
      load();
    } catch (e) { show(e.message, 'err'); }
  };

  const del = async (id) => {
    if (!window.confirm('¿Eliminar este entrenamiento?')) return;
    try { await trainingsApi.delete(id); show('Entrenamiento eliminado'); load(); }
    catch (e) { show(e.message, 'err'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Entrenamientos</div>
          <div className="page-sub">Sesiones programadas</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + Nuevo entrenamiento
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Semana</th><th>Sesión</th><th>Creado</th><th>Acciones</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5"><div className="loading"><span className="spinner" /> Cargando...</div></td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan="5"><div className="empty"><div className="empty-icon">📅</div><div className="empty-text">Sin entrenamientos registrados</div></div></td></tr>
              ) : list.map(t => (
                <tr key={t.id}>
                  <td><span style={{ color: 'var(--muted)', fontSize: 12 }}>#{t.id}</span></td>
                  <td><span className="badge badge-gold">Semana {t.weekNumber}</span></td>
                  <td><span className="badge badge-blue">Sesión {t.sessionNumber}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{formatDate(t.createdDay)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => del(t.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo entrenamiento">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Número de semana</label>
            <input className="form-input" type="number" min="1" value={week} onChange={e => setWeek(e.target.value)} placeholder="1" />
          </div>
          <div className="form-group">
            <label className="form-label">Número de sesión</label>
            <input className="form-input" type="number" min="1" value={session} onChange={e => setSession(e.target.value)} placeholder="1" />
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

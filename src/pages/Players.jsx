import { useEffect, useState } from 'react';
import { playersApi } from '../api';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState(null);
  const [name, setName] = useState('');
  const { toast, show } = useToast();

  const load = async () => {
    setLoading(true);
    try { setPlayers(await playersApi.getAll() || []); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditPlayer(null); setName(''); setModalOpen(true); };
  const openEdit = (p) => { setEditPlayer(p); setName(p.name); setModalOpen(true); };

  const save = async () => {
    if (!name.trim()) return show('El nombre es obligatorio', 'err');
    try {
      if (editPlayer) {
        await playersApi.update(editPlayer.id, { name });
        show('Jugador actualizado');
      } else {
        await playersApi.create({ name });
        show('Jugador creado');
      }
      setModalOpen(false);
      load();
    } catch (e) { show(e.message, 'err'); }
  };

  const del = async (id) => {
    if (!window.confirm('¿Eliminar este jugador?')) return;
    try { await playersApi.delete(id); show('Jugador eliminado'); load(); }
    catch (e) { show(e.message, 'err'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Jugadores</div>
          <div className="page-sub">Gestiona el plantel</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Agregar jugador
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Nombre</th><th>Acciones</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3"><div className="loading"><span className="spinner" /> Cargando...</div></td></tr>
              ) : players.length === 0 ? (
                <tr><td colSpan="3"><div className="empty"><div className="empty-icon">👥</div><div className="empty-text">Sin jugadores registrados</div></div></td></tr>
              ) : players.map(p => (
                <tr key={p.id}>
                  <td><span style={{ color: 'var(--muted)', fontSize: 12 }}>#{p.id}</span></td>
                  <td>
                    <div className="row">
                      <div className="avatar" style={{ width: 30, height: 30, fontSize: 12 }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      {p.name}
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editPlayer ? 'Editar jugador' : 'Nuevo jugador'}>
        <div className="form-group">
          <label className="form-label">Nombre completo</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Cristiano Ronaldo" />
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

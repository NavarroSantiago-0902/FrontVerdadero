export default function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'modal-wide' : ''}`}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

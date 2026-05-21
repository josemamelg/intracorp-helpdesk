export function StatusBadge({ status }) {
  const labels = {
    open: 'Abierto',
    in_progress: 'En progreso',
    waiting_user: 'Esperando usuario',
    resolved: 'Resuelto',
    closed: 'Cerrado'
  };
  return <span className={`badge status-${status}`}>{labels[status] || status}</span>;
}

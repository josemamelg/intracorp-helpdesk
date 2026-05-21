export function PriorityBadge({ priority }) {
  const labels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    critical: 'Critica'
  };
  return <span className={`badge priority-${priority}`}>{labels[priority] || priority}</span>;
}

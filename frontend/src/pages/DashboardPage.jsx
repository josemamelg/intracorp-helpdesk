import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { MetricCard } from '../components/MetricCard.jsx';
import { PriorityBadge } from '../components/PriorityBadge.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';

export function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/dashboard/metrics')
      .then((data) => setMetrics(data.metrics))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="alert error">{error}</div>;
  if (!metrics) return <div className="panel">Cargando metricas...</div>;

  return (
    <section className="page-grid">
      <div className="metrics-grid">
        <MetricCard label="Tickets abiertos" value={metrics.openTickets} detail="open + in_progress + waiting_user" />
        <MetricCard label="Tickets cerrados" value={metrics.closedTickets} detail="resolved + closed" />
        <MetricCard label="Usuarios activos" value={metrics.activeUsers} detail="cuentas habilitadas" />
        <MetricCard label="Prioridades" value={metrics.byPriority.length} detail="niveles con actividad" />
      </div>

      <div className="split-grid">
        <div className="panel">
          <h2>Tickets por prioridad</h2>
          <div className="stack-list">
            {metrics.byPriority.map((row) => (
              <div className="list-row" key={row.priority}>
                <PriorityBadge priority={row.priority} />
                <strong>{row.count}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>Tickets recientes</h2>
          <div className="stack-list">
            {metrics.recentTickets.map((ticket) => (
              <div className="list-row ticket-row" key={ticket.id}>
                <div className="ticket-summary">
                  <strong>#{ticket.id} {ticket.title}</strong>
                  <span>Solicitado por {ticket.creator_name}</span>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

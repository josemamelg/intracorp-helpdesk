import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { MetricCard } from '../components/MetricCard.jsx';

export function SystemStatusPage() {
  const [system, setSystem] = useState(null);
  const [error, setError] = useState('');

  async function loadStatus() {
    setError('');
    try {
      const data = await api('/system/status');
      setSystem(data.system);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <section className="page-grid">
      <div className="panel-heading">
        <div>
          <h2>Estado del sistema</h2>
          <span>API, PostgreSQL, memoria y pool de conexiones</span>
        </div>
        <button className="icon-button" onClick={loadStatus} title="Refrescar">
          <RefreshCw size={18} />
        </button>
      </div>
      {error && <div className="alert error">{error}</div>}
      {system && (
        <>
          <div className="metrics-grid">
            <MetricCard label="Estado" value={system.status} detail={system.timestamp} />
            <MetricCard label="API" value={system.api} detail={`${system.uptimeSeconds}s uptime`} />
            <MetricCard label="PostgreSQL" value={system.database} detail={`${system.dbLatencyMs}ms latency`} />
            <MetricCard label="Memoria RSS" value={`${system.memory.rssMb} MB`} detail={`heap ${system.memory.heapUsedMb} MB`} />
          </div>
          <div className="panel">
            <h2>Pool PostgreSQL</h2>
            <div className="metrics-grid">
              <MetricCard label="Total" value={system.postgresPool.total} />
              <MetricCard label="Idle" value={system.postgresPool.idle} />
              <MetricCard label="Waiting" value={system.postgresPool.waiting} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

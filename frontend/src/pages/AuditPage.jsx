import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/audit').then((data) => setLogs(data.auditLogs)).catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="alert error">{error}</div>;

  return (
    <section className="panel">
      <h2>Registro de auditoria</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Actor</th>
            <th>Accion</th>
            <th>Entidad</th>
            <th>Metadata</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.created_at).toLocaleString()}</td>
              <td>{log.actor_name || 'system'}</td>
              <td>{log.action}</td>
              <td>{log.entity_type} {log.entity_id || ''}</td>
              <td><code>{JSON.stringify(log.metadata)}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

import { useState } from 'react';
import { api } from '../api/client.js';

const simulations = [
  ['/system/simulate/error-500', 'Forzar error 500'],
  ['/system/simulate/slow', 'Simular latencia'],
  ['/system/simulate/db-error', 'Simular error SQL']
];

export function SimulatePage() {
  const [result, setResult] = useState('');
  const [maintenance, setMaintenance] = useState(false);

  async function run(path) {
    setResult('Ejecutando...');
    try {
      const data = await api(path);
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(err.message);
    }
  }

  async function toggleMaintenance() {
    const data = await api('/system/maintenance', {
      method: 'POST',
      body: JSON.stringify({ enabled: !maintenance })
    });
    setMaintenance(data.maintenanceMode);
    setResult(`Modo mantenimiento: ${data.maintenanceMode}`);
  }

  return (
    <section className="split-grid">
      <div className="panel">
        <h2>Simulacion de incidentes</h2>
        <div className="stack-list">
          {simulations.map(([path, label]) => (
            <button className="secondary-button" key={path} onClick={() => run(path)}>
              {label}
            </button>
          ))}
          <button className="secondary-button" onClick={toggleMaintenance}>
            {maintenance ? 'Desactivar mantenimiento' : 'Activar mantenimiento'}
          </button>
        </div>
      </div>
      <div className="panel">
        <h2>Resultado</h2>
        <pre>{result || 'Selecciona una simulacion para generar logs y sintomas.'}</pre>
      </div>
    </section>
  );
}

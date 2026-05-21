import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const demoUsers = [
  ['admin@intracorp.local', 'admin'],
  ['soporte@intracorp.local', 'soporte'],
  ['empleado@intracorp.local', 'empleado']
];

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@intracorp.local');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-panel">
        <div className="login-copy">
          <span className="eyebrow">Mesa de ayuda corporativa</span>
          <h1>IntraCorp Helpdesk</h1>
          <p>Entorno interno para tickets, auditoria, monitoreo y practica SysAdmin/DevOps.</p>
          <div className="demo-users">
            {demoUsers.map(([demoEmail, role]) => (
              <button key={demoEmail} onClick={() => setEmail(demoEmail)}>
                {role}
              </button>
            ))}
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-icon"><LockKeyhole size={22} /></div>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </label>
          {error && <div className="alert error">{error}</div>}
          <button className="primary-button" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          <small>Password demo: Password123!</small>
        </form>
      </section>
    </main>
  );
}

import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'Password123!',
    role: 'empleado',
    department: 'General'
  });
  const [message, setMessage] = useState('');

  async function loadUsers() {
    const data = await api('/users');
    setUsers(data.users);
  }

  useEffect(() => {
    loadUsers().catch((err) => setMessage(err.message));
  }, []);

  async function createUser(event) {
    event.preventDefault();
    await api('/users', { method: 'POST', body: JSON.stringify(form) });
    setForm({ name: '', email: '', password: 'Password123!', role: 'empleado', department: 'General' });
    setMessage('Usuario creado');
    await loadUsers();
  }

  async function toggleUser(user) {
    await api(`/users/${user.id}`, { method: 'PATCH', body: JSON.stringify({ active: !user.active }) });
    await loadUsers();
  }

  return (
    <section className="split-grid">
      <div className="panel">
        <h2>Usuarios</h2>
        {message && <div className="alert info">{message}</div>}
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Depto</th>
              <th>Activo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.department}</td>
                <td>
                  <button className="small-button" onClick={() => toggleUser(user)}>
                    {user.active ? 'Si' : 'No'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Crear usuario</h2>
        <form className="compact-form" onSubmit={createUser}>
          <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="empleado">empleado</option>
            <option value="soporte">soporte</option>
            <option value="admin">admin</option>
          </select>
          <input placeholder="Departamento" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <button className="primary-button">Crear</button>
        </form>
      </div>
    </section>
  );
}

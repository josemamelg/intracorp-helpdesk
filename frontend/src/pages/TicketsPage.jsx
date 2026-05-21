import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PriorityBadge } from '../components/PriorityBadge.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';

const emptyTicket = { title: '', description: '', priority: 'medium', category: 'General' };

export function TicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState(emptyTicket);
  const [comment, setComment] = useState('');
  const [internal, setInternal] = useState(false);
  const [message, setMessage] = useState('');

  async function loadTickets() {
    const data = await api('/tickets');
    setTickets(data.tickets);
    if (!selected && data.tickets[0]) loadTicket(data.tickets[0].id);
  }

  async function loadTicket(id) {
    const data = await api(`/tickets/${id}`);
    setSelected(data.ticket);
    setComments(data.comments);
  }

  useEffect(() => {
    loadTickets().catch((err) => setMessage(err.message));
  }, []);

  async function createTicket(event) {
    event.preventDefault();
    await api('/tickets', { method: 'POST', body: JSON.stringify(form) });
    setForm(emptyTicket);
    setMessage('Ticket creado correctamente');
    await loadTickets();
  }

  async function updateTicket(updates) {
    const data = await api(`/tickets/${selected.id}`, { method: 'PATCH', body: JSON.stringify(updates) });
    setSelected(data.ticket);
    setMessage('Ticket actualizado');
    await loadTickets();
  }

  async function addComment(event) {
    event.preventDefault();
    await api(`/tickets/${selected.id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body: comment, internal })
    });
    setComment('');
    setInternal(false);
    await loadTicket(selected.id);
    await loadTickets();
  }

  return (
    <section className="tickets-layout">
      <div className="panel">
        <div className="panel-heading">
          <h2>Tickets</h2>
          <span>{tickets.length} registros</span>
        </div>
        {message && <div className="alert info">{message}</div>}
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              className={selected?.id === ticket.id ? 'selected ticket-card' : 'ticket-card'}
              onClick={() => loadTicket(ticket.id)}
            >
              <div>
                <strong>#{ticket.id} {ticket.title}</strong>
                <span>{ticket.category} · {ticket.creator_name}</span>
              </div>
              <div className="badge-row">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Crear ticket</h2>
        <form className="compact-form" onSubmit={createTicket}>
          <input placeholder="Titulo" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Descripcion" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="form-row">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Critica</option>
            </select>
            <input placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <button className="primary-button">Crear ticket</button>
        </form>
      </div>

      <div className="panel ticket-detail">
        {!selected ? (
          <p>Selecciona un ticket.</p>
        ) : (
          <>
            <div className="panel-heading">
              <div>
                <h2>#{selected.id} {selected.title}</h2>
                <span>{selected.category} · creado por {selected.creator_name}</span>
              </div>
              <div className="badge-row">
                <PriorityBadge priority={selected.priority} />
                <StatusBadge status={selected.status} />
              </div>
            </div>
            <p>{selected.description}</p>

            {(user.role === 'admin' || user.role === 'soporte') && (
              <div className="admin-controls">
                <select value={selected.status} onChange={(e) => updateTicket({ status: e.target.value })}>
                  <option value="open">Abierto</option>
                  <option value="in_progress">En progreso</option>
                  <option value="waiting_user">Esperando usuario</option>
                  <option value="resolved">Resuelto</option>
                  <option value="closed">Cerrado</option>
                </select>
                <select value={selected.priority} onChange={(e) => updateTicket({ priority: e.target.value })}>
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Critica</option>
                </select>
              </div>
            )}

            <h3>Conversacion</h3>
            <div className="comment-list">
              {comments.map((item) => (
                <div className={item.internal ? 'comment internal' : 'comment'} key={item.id}>
                  <strong>{item.author_name} · {item.author_role}</strong>
                  <p>{item.body}</p>
                  {item.internal && <span>Nota interna</span>}
                </div>
              ))}
            </div>
            <form className="compact-form" onSubmit={addComment}>
              <textarea placeholder="Responder" value={comment} onChange={(e) => setComment(e.target.value)} />
              {(user.role === 'admin' || user.role === 'soporte') && (
                <label className="checkbox-line">
                  <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} />
                  Comentario interno
                </label>
              )}
              <button className="primary-button">Agregar respuesta</button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

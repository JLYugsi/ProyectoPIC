import { LitElement, html, css, unsafeCSS } from 'lit';
import { auth } from '../services/auth-service.js';
import { Router } from '@vaadin/router';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';

const API_URL = 'http://localhost:3000/api/users';

export class UsersManager extends LitElement {
  static properties = {
    users: { type: Array }
  };

  static styles = [
    unsafeCSS(bootstrapStyles),
    css`
      :host { display: block; min-height: 100vh; background-color: #000; color: white; padding-top: 2rem; }
      h2 { font-family: 'Metal Mania', cursive; color: #dc3545; text-align: center; margin-bottom: 2rem; }
      .table-container { background: #111; border: 1px solid #333; border-radius: 8px; padding: 1rem; }
      table { color: #ddd; width: 100%; }
      th { color: #dc3545; text-transform: uppercase; border-bottom: 1px solid #444; padding: 1rem; }
      td { border-bottom: 1px solid #222; padding: 1rem; vertical-align: middle; }
      tr:hover { background-color: #1a1a1a; }
      .badge-admin { background-color: #dc3545; color: white; padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; }
      .badge-user { background-color: #444; color: #aaa; padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; }
      .btn-action { border: none; background: none; font-size: 1.2rem; cursor: pointer; margin-right: 10px; }
      .btn-action:hover { transform: scale(1.2); }
    `
  ];

  constructor() {
    super();
    this.users = [];
    this._fetchUsers();
  }

  async _fetchUsers() {
    // Usamos el nuevo isAdmin() robusto
    if (!auth.isAdmin()) {
        console.warn("Acceso denegado: No se detecta rol de administrador.");
        return Router.go('/'); // Si esto se activa, mira la consola
    }

    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        this.users = Array.isArray(data) ? data : [];
        this.requestUpdate();
    } catch (e) { 
        console.error("Error cargando usuarios:", e);
    }
  }

  render() {
    const currentUser = auth.getUser();

    return html`
      <div class="container">
        <h2>GESTIÓN DE LA DEATHBAT NATION</h2>
        
        <div class="table-container">
          <table class="table table-dark table-borderless mb-0">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${this.users.map(user => html`
                <tr>
                  <td class="fw-bold">${user.nombre}</td>
                  <td class="text-secondary">${user.correo}</td>
                  <td>
                    <span class="${user.rol === 'admin' ? 'badge-admin' : 'badge-user'}">
                        ${user.rol === 'admin' ? '👑 ADMIN' : '👤 FAN'}
                    </span>
                  </td>
                  <td class="text-end">
                    ${user._id !== currentUser._id ? html`
                        <button class="btn-action" title="Cambiar Rol" @click="${() => this._toggleRole(user)}">
                            ${user.rol === 'admin' ? '⬇️' : '👑'}
                        </button>
                        <button class="btn-action text-danger" title="Expulsar" @click="${() => this._deleteUser(user)}">
                            🗑️
                        </button>
                    ` : html`<span class="text-muted small">Tú</span>`}
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async _deleteUser(user) {
    if (!confirm(`¿Expulsar a ${user.nombre}?`)) return;
    try {
        await fetch(`${API_URL}/${user._id}`, { method: 'DELETE' });
        this._fetchUsers();
    } catch (e) { alert("Error al eliminar"); }
  }

  async _toggleRole(user) {
    const newRole = user.rol === 'admin' ? 'fan' : 'admin'; // Lógica simple fan/admin
    if (!confirm(`¿Cambiar rol de ${user.nombre} a ${newRole}?`)) return;

    try {
        await fetch(`${API_URL}/${user._id}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });
        this._fetchUsers();
    } catch (e) { alert("Error al cambiar rol"); }
  }
}
customElements.define('users-manager', UsersManager);
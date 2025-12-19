import { LitElement, html, css, unsafeCSS } from 'lit';
import { auth } from '../services/auth-service.js';
import { Router } from '@vaadin/router';
import { Modal } from 'bootstrap'; 
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';

const API_URL = 'http://localhost:3000/api/users';

export class UsersManager extends LitElement {
  static properties = {
    users: { type: Array },
    targetUser: { type: Object },
    actionType: { type: String }, // 'delete', 'role', 'edit'
    
    // Variables de edición
    editName: { type: String },
    editEmail: { type: String },

    modalTitle: { type: String },
    modalBody: { type: String }
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
      
      .badge-admin { background-color: #dc3545; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
      .badge-user { background-color: #444; color: #aaa; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
      .btn-action { border: none; background: none; font-size: 1.2rem; cursor: pointer; margin-right: 5px; color: #fff; }
      .btn-action:hover { transform: scale(1.2); }
      .text-danger { color: #dc3545 !important; }

      /* El estilo del modal ahora se fuerza en el HTML, pero dejamos esto de respaldo */
      .btn-close { filter: invert(1); } /* Hace la X blanca */
    `
  ];

  constructor() {
    super();
    this.users = [];
    this.modalInstance = null;
    this.editName = '';
    this.editEmail = '';
    this._fetchUsers();
  }

  firstUpdated() {
    const modalEl = this.shadowRoot.getElementById('actionModal');
    this.modalInstance = new Modal(modalEl);
  }

  async _fetchUsers() {
    if (!auth.isAdmin()) return Router.go('/');
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        this.users = Array.isArray(data) ? data : [];
        this.requestUpdate();
    } catch (e) { console.error(e); }
  }

  render() {
    const currentUser = auth.getUser();
    const modalStyle = "background-color: #222; color: white; border: 1px solid #444;";
    const inputStyle = "background-color: #333; color: white; border: 1px solid #555;";

    return html`
      <div class="container">
        <h2>GESTIÓN DE LA DEATHBAT NATION</h2>
        
        <div class="table-container">
          <table class="table table-dark table-borderless mb-0">
            <thead>
              <tr><th>Usuario</th><th>Email</th><th>Rol</th><th class="text-end">Acciones</th></tr>
            </thead>
            <tbody>
              ${this.users.map(user => html`
                <tr>
                  <td class="fw-bold">${user.nombre}</td>
                  <td class="text-secondary">${user.correo}</td>
                  <td><span class="${user.rol === 'admin' ? 'badge-admin' : 'badge-user'}">${user.rol === 'admin' ? '👑 ADMIN' : '👤 FAN'}</span></td>
                  <td class="text-end">
                    ${user._id !== currentUser._id ? html`
                        <button class="btn-action" title="Editar" @click="${() => this._promptEdit(user)}">✎</button>
                        <button class="btn-action" title="Rol" @click="${() => this._promptToggleRole(user)}">${user.rol === 'admin' ? '⬇️' : '👑'}</button>
                        <button class="btn-action text-danger" title="Borrar" @click="${() => this._promptDelete(user)}">🗑️</button>
                    ` : html`<span class="text-muted small">Tú</span>`}
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>

        <div class="modal fade" id="actionModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                
                <div class="modal-content" style="${modalStyle}">
                    
                    <div class="modal-header" style="border-bottom: 1px solid #444;">
                        <h5 class="modal-title" style="color: #dc3545; font-family: 'Metal Mania'; font-size: 1.5rem;">
                            ${this.modalTitle}
                        </h5>
                        <button type="button" class="btn-close" @click="${() => this.modalInstance.hide()}"></button>
                    </div>
                    
                    <div class="modal-body">
                        ${this.actionType === 'edit' ? html`
                            <div class="mb-3">
                                <label style="color: #aaa;">Usuario</label>
                                <input type="text" class="form-control" 
                                    style="${inputStyle}"
                                    .value="${this.editName}" 
                                    @input="${e => this.editName = e.target.value}">
                            </div>
                            <div class="mb-3">
                                <label style="color: #aaa;">Email</label>
                                <input type="email" class="form-control" 
                                    style="${inputStyle}"
                                    .value="${this.editEmail}" 
                                    @input="${e => this.editEmail = e.target.value}">
                            </div>
                        ` : html`
                            <p class="fs-5">${this.modalBody}</p>
                            <p class="text-secondary small mt-2">Usuario: <strong style="color: #dc3545;">${this.targetUser?.nombre}</strong></p>
                        `}
                    </div>

                    <div class="modal-footer" style="border-top: 1px solid #444;">
                        <button type="button" class="btn btn-secondary" @click="${() => this.modalInstance.hide()}">Cancelar</button>
                        
                        <button type="button" 
                            class="btn ${this.actionType === 'delete' ? 'btn-danger' : 'btn-warning'} fw-bold" 
                            @click="${this._confirmAction}">
                            ${this.actionType === 'edit' ? 'Guardar' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `;
  }

  _promptDelete(user) {
    this.targetUser = user; this.actionType = 'delete';
    this.modalTitle = '🗑️ Expulsar Usuario';
    this.modalBody = `¿Estás seguro de eliminar a este usuario permanentemente?`;
    this.requestUpdate(); this.modalInstance.show();
  }

  _promptToggleRole(user) {
    this.targetUser = user; this.actionType = 'role';
    const newRole = user.rol === 'admin' ? 'fan' : 'admin';
    this.modalTitle = '🛡️ Cambiar Permisos';
    this.modalBody = `¿Deseas ${newRole === 'admin' ? 'ascender a Admin' : 'degradar a Fan'}?`;
    this.requestUpdate(); this.modalInstance.show();
  }

  _promptEdit(user) {
    this.targetUser = user; this.actionType = 'edit';
    this.modalTitle = '✏️ Editar Usuario';
    this.editName = user.nombre; this.editEmail = user.correo;
    this.requestUpdate(); this.modalInstance.show();
  }

  async _confirmAction() {
    this.modalInstance.hide();
    const uid = this.targetUser._id;
    try {
        if (this.actionType === 'delete') await fetch(`${API_URL}/${uid}`, { method: 'DELETE' });
        else if (this.actionType === 'role') {
            const newRole = this.targetUser.rol === 'admin' ? 'fan' : 'admin';
            await fetch(`${API_URL}/${uid}/role`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({role: newRole})});
        }
        else if (this.actionType === 'edit') {
            await fetch(`${API_URL}/${uid}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({nombre: this.editName, correo: this.editEmail})});
        }
        this._fetchUsers();
    } catch (e) { console.error(e); }
  }
}
customElements.define('users-manager', UsersManager);
import { LitElement, html, css, unsafeCSS } from 'lit';
import { auth } from '../services/auth-service.js';
import { Router } from '@vaadin/router';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class LoginView extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            .login-bg {
                min-height: 85vh;
                display: flex; align-items: center; justify-content: center;
                background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('https://upload.wikimedia.org/wikipedia/commons/b/b3/Avenged_Sevenfold_2011.jpg');
                background-size: cover; background-position: center;
            }
            .card { background: rgba(20, 20, 20, 0.95); border: 1px solid #dc3545; color: white; width: 100%; max-width: 400px; }
            h2 { font-family: 'Metal Mania', cursive; color: #dc3545; }
            .form-control { background: #333; border: 1px solid #555; color: white; }
            .form-control:focus { background: #444; color: white; border-color: #dc3545; box-shadow: 0 0 5px rgba(220, 53, 69, 0.5); }
            
            /* Estilo para el mensaje de error */
            .error-box {
                background-color: rgba(220, 53, 69, 0.2);
                border: 1px solid #dc3545;
                color: #ffb3b3;
                padding: 10px;
                border-radius: 4px;
                font-size: 0.9rem;
                text-align: center;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
        `
    ];

    static properties = {
        isRegistering: { type: Boolean },
        identifier: { type: String },
        password: { type: String },
        username: { type: String },
        email: { type: String },
        errorMessage: { type: String } // <--- NUEVA PROPIEDAD PARA ERRORES
    };

    constructor() {
        super();
        this.isRegistering = false;
        this.identifier = '';
        this.password = '';
        this.username = '';
        this.email = '';
        this.errorMessage = ''; // Inicialmente vacío
    }

    render() {
        return html`
            <div class="login-bg">
                <div class="card p-4 shadow-lg">
                    <div class="text-center mb-4">
                        <h2>DEATHBAT NATION</h2>
                        <h5 class="text-secondary">${this.isRegistering ? 'Únete a la Familia' : 'Acceso'}</h5>
                    </div>

                    ${this.errorMessage ? html`
                        <div class="error-box">
                            ⚠️ ${this.errorMessage}
                        </div>
                    ` : ''}

                    <form @submit="${this._handleSubmit}">
                        
                        ${this.isRegistering ? html`
                            <div class="mb-3">
                                <label class="form-label">Nombre de Usuario</label>
                                <input type="text" class="form-control" .value="${this.username}" 
                                    @input="${e => { this.username = e.target.value.replace(/\s/g, ''); this.errorMessage = ''; }}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Correo Electrónico</label>
                                <input type="email" class="form-control" .value="${this.email}" 
                                    @input="${e => { this.email = e.target.value; this.errorMessage = ''; }}" required>
                            </div>
                        ` : html`
                            <div class="mb-3">
                                <label class="form-label">Usuario o Correo</label>
                                <input type="text" class="form-control" .value="${this.identifier}" 
                                    @input="${e => { this.identifier = e.target.value; this.errorMessage = ''; }}" required>
                            </div>
                        `}

                        <div class="mb-3">
                            <label class="form-label">Contraseña (Máx 16)</label>
                            <input type="password" class="form-control" maxlength="16" autocomplete="new-password"
                                .value="${this.password}" @input="${e => { this.password = e.target.value; this.errorMessage = ''; }}" required>
                        </div>

                        <button type="submit" class="btn btn-danger w-100 fw-bold py-2">
                            ${this.isRegistering ? 'CREAR CUENTA' : 'ENTRAR'}
                        </button>
                    </form>

                    <div class="text-center mt-3">
                        <button class="btn btn-link text-white text-decoration-none small" 
                            @click="${() => this._toggleMode()}">
                            ${this.isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    _toggleMode() {
        this.isRegistering = !this.isRegistering;
        this.password = ''; 
        this.identifier = '';
        this.username = '';
        this.email = '';
        this.errorMessage = '';
    }

    async _handleSubmit(e) {
        e.preventDefault();
        this.errorMessage = '';

        if (this.isRegistering) {
            if (this.username.includes(' ')) {
                this.errorMessage = "El usuario no puede contener espacios.";
                return;
            }
            if (this.password.length > 16) {
                this.errorMessage = "La contraseña es muy larga.";
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                this.errorMessage = "El formato del correo no es válido.";
                return;
            }
            
            await this._register();
        } else {
            await this._login();
        }
    }

    async _login() {
        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: this.identifier, password: this.password })
            });
            const data = await res.json();
            
            if (res.ok) {
                auth.login(data);
                Router.go('/'); 
            } else {
                // En lugar de alert, asignamos a la variable
                this.errorMessage = data.message || "Credenciales incorrectas";
            }
        } catch (e) { 
            this.errorMessage = "Error de conexión con el servidor."; 
        }
    }

    async _register() {
        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: this.username, correo: this.email, password: this.password })
            });
            
            if (res.ok) {
                this._toggleMode(); 
                // Opcional: Mostrar mensaje de éxito temporalmente si quisieras
            } else {
                const data = await res.json();
                this.errorMessage = data.message || "Error al registrar.";
            }
        } catch (e) { 
            this.errorMessage = "Error de conexión al registrar."; 
        }
    }
}
customElements.define('login-view', LoginView);
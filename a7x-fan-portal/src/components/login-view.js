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
                background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3bISOcKqnywHPJ768LjtJD9-6v3XVuwfLyg&s');
                background-size: cover; background-position: center;
            }
            .card { background: rgba(20, 20, 20, 0.95); border: 1px solid #dc3545; color: white; width: 100%; max-width: 400px; }
            h2 { font-family: 'Metal Mania', cursive; color: #dc3545; }
            .form-control { background: #333; border: 1px solid #555; color: white; }
            .form-control:focus { background: #444; color: white; border-color: #dc3545; box-shadow: none; }
        `
    ];

    static properties = {
        isRegistering: { type: Boolean },
        identifier: { type: String }, // Usuario o Correo (Login)
        password: { type: String },
        username: { type: String },   // Nombre (Registro)
        email: { type: String }       // Correo (Registro)
    };

    constructor() {
        super();
        this.isRegistering = false;
        this.identifier = '';
        this.password = '';
        this.username = '';
        this.email = '';
    }

    render() {
        return html`
            <div class="login-bg">
                <div class="card p-4 shadow-lg">
                    <div class="text-center mb-4">
                        <h2>DEATHBAT NATION</h2>
                        <h5 class="text-secondary">${this.isRegistering ? 'Únete a la Familia' : 'Acceso'}</h5>
                    </div>

                    <form @submit="${this._handleSubmit}">
                        
                        ${this.isRegistering ? html`
                            <div class="mb-3">
                                <label class="form-label">Nombre de Usuario</label>
                                <input type="text" class="form-control" .value="${this.username}" 
                                    @input="${e => this.username = e.target.value.replace(/\s/g, '')}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Correo Electrónico</label>
                                <input type="email" class="form-control" .value="${this.email}" 
                                    @input="${e => this.email = e.target.value}" required>
                            </div>
                        ` : html`
                            <div class="mb-3">
                                <label class="form-label">Usuario o Correo</label>
                                <input type="text" class="form-control" .value="${this.identifier}" 
                                    @input="${e => this.identifier = e.target.value}" required>
                            </div>
                        `}

                        <div class="mb-3">
                            <label class="form-label">Contraseña (Máx 16)</label>
                            <input type="password" class="form-control" maxlength="16" autocomplete="new-password"
                                .value="${this.password}" @input="${e => this.password = e.target.value}" required>
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

    // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
    _toggleMode() {
        this.isRegistering = !this.isRegistering;
        
        // Limpiamos TODAS las variables para que los inputs queden vacíos
        this.password = ''; 
        this.identifier = '';
        this.username = '';
        this.email = '';
    }

    async _handleSubmit(e) {
        e.preventDefault();

        if (this.isRegistering) {
            if (this.username.includes(' ')) return alert("El nombre de usuario no puede tener espacios.");
            if (this.password.length > 16) return alert("La contraseña no puede superar los 16 caracteres.");
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) return alert("El formato del correo es inválido.");
            
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
                alert(data.message);
            }
        } catch (e) { alert('Error de conexión'); }
    }

    async _register() {
        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: this.username, correo: this.email, password: this.password })
            });
            if (res.ok) {
                this._toggleMode(); // Cambiamos a modo login automáticamente y limpia campos
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch (e) { alert('Error al registrar'); }
    }
}
customElements.define('login-view', LoginView);
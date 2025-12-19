import { LitElement, html, css, unsafeCSS } from 'lit';
import { Router } from '@vaadin/router';
import { auth } from './services/auth-service.js';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';

// --- IMPORTAR COMPONENTES ---
import './components/album-manager.js';
import './components/band-history.js';
import './components/member-card.js';
import './components/login-view.js';
import './components/members-view.js';
import './components/album-detail.js';
import './components/favorites-view.js';
import './components/users-manager.js';

// --- VISTA HOME ---
class HomeView extends LitElement {
  static styles = [ unsafeCSS(bootstrapStyles), css`
      h1 { font-family: 'Metal Mania'; color: #dc3545; font-size: 4rem; }
      .hero-section { text-align: center; padding: 4rem 1rem; }
  `];
  render() {
    return html`
      <div class="container hero-section text-white">
        <h1>DEATHBAT NATION</h1>
        <p class="lead mb-4">El portal oficial para los fans de Avenged Sevenfold.</p>
        <img src="https://www.spirit-of-metal.com/les%20goupes/A/Avenged%20Sevenfold/pics/1523075_logo.jpg" class="img-fluid rounded border border-danger shadow-lg">
        <img src="https://www.spirit-of-metal.com/les%20goupes/A/Avenged%20Sevenfold/pics/9e0a_1.jpg" class="img-fluid rounded border border-danger shadow-lg">
        <div class="mt-5">
          <a href="/discografia" class="btn btn-danger btn-lg fw-bold me-2">Ver Discografía</a>
        </div>
      </div>
    `;
  }
}
customElements.define('home-view', HomeView);

// --- APP PRINCIPAL ---
export class A7XApp extends LitElement {
  static styles = [
    unsafeCSS(bootstrapStyles),
    css`
      :host { display: block; min-height: 100vh; }
      nav { border-bottom: 2px solid #444; background-color: #000 !important; }
      
      .brand { font-family: 'Metal Mania'; font-size: 1.8rem; color: #dc3545; text-decoration: none; margin-right: 20px; transition: transform 0.2s; }
      .brand:hover { transform: scale(1.05); color: #ff0000; }

      .nav-link { color: #ddd !important; margin: 0 10px; font-weight: bold; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; transition: color 0.3s; }
      .nav-link:hover { color: #dc3545 !important; }

      .user-section { color: white; font-weight: bold; display: flex; align-items: center; gap: 15px; }
      .username { color: #dc3545; }
      
      .btn-logout { color: #fff; text-decoration: none; font-size: 0.9rem; border: 1px solid #555; padding: 5px 15px; border-radius: 20px; transition: all 0.3s; }
      .btn-logout:hover { background: #dc3545; border-color: #dc3545; }

      .btn-login { border: 1px solid #dc3545; color: #dc3545 !important; padding: 5px 20px; border-radius: 20px; }
      .btn-login:hover { background: #dc3545; color: white !important; }
    `
  ];

  constructor() {
    super();
    window.addEventListener('auth-changed', () => this.requestUpdate());
  }

  firstUpdated() {
    const router = new Router(this.shadowRoot.querySelector('#outlet'));
    router.setRoutes([
      { path: '/', component: 'home-view' },
      { path: '/discografia', component: 'album-manager' },
      { path: '/albums/:id', component: 'album-detail' }, 
      { path: '/historia', component: 'band-history' },
      { path: '/miembros', component: 'members-view' },
      { path: '/login', component: 'login-view' },
      { path: '/favoritos', component: 'favorites-view' },
      
      // 2. IMPORTANTE: AQUÍ REGISTRAMOS LA RUTA
      { path: '/usuarios', component: 'users-manager' }, 

      { path: '(.*)', component: 'home-view' }
    ]);
  }

  render() {
    const user = auth.getUser();
    // Verificamos si es admin usando la propiedad 'role' que arreglamos antes
    const isAdmin = user && user.role === 'admin';

    return html`
      <nav class="navbar navbar-expand-lg navbar-dark sticky-top p-3">
        <div class="container-fluid px-5">
          <a class="brand" href="/">A7X</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <div class="navbar-nav me-auto">
              <a class="nav-link" href="/historia">HISTORIA</a>
              <a class="nav-link" href="/miembros">MIEMBROS</a>
              <a class="nav-link" href="/discografia">DISCOGRAFÍA</a>
              
              ${user 
                ? (isAdmin 
                    ? html`<a class="nav-link text-danger" href="/usuarios">👥 GESTIÓN USUARIOS</a>`
                    : html`<a class="nav-link text-warning" href="/favoritos">★ MIS FAVORITOS</a>`
                  )
                : ''
              }
            </div>

            <div class="navbar-nav ms-auto">
              ${user 
                ? html`
                    <div class="user-section">
                      <span class="welcome-text">
                        ${isAdmin ? 'Mando:' : 'Hola!'} 
                        <span class="username">${user.nombre}</span>
                      </span>
                      <span class="text-muted">|</span>
                      <a href="#" class="btn-logout" @click="${this._logout}">Cerrar Sesión</a>
                    </div>
                  `
                : html`<a class="nav-link btn-login" href="/login">LOGIN / REGISTRO</a>`
              }
            </div>
          </div>
        </div>
      </nav>

      <div id="outlet"></div>
    `;
  }

  _logout(e) {
    e.preventDefault();
    auth.logout();
  }
}
customElements.define('a7x-app', A7XApp);
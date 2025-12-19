import { LitElement, html, css, unsafeCSS } from 'lit';
import { Router } from '@vaadin/router';
import { auth } from '../services/auth-service.js';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';

const API_URL = 'http://localhost:3000/api';

export class FavoritesView extends LitElement {
  static properties = {
    favorites: { type: Array },
    loading: { type: Boolean },
    // Filtros
    sortCriteria: { type: String }, // 'added' | 'title' | 'year'
    sortDirection: { type: String } // 'asc' | 'desc'
  };

  static styles = [
    unsafeCSS(bootstrapStyles),
    css`
      :host { display: block; min-height: 100vh; background-color: #000; color: white; }
      h2 { font-family: 'Metal Mania', cursive; color: #dc3545; font-size: 3rem; text-align: center; margin-bottom: 2rem; }
      .fav-container { max-width: 800px; margin: 0 auto; padding-top: 3rem; }
      
      /* BARRA DE CONTROL */
      .control-bar {
        display: flex; justify-content: space-between; align-items: center;
        background: #111; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #333;
      }
      .filter-select { background: #222; color: #fff; border: 1px solid #444; padding: 5px; border-radius: 4px; }
      .btn-sort { background: none; border: 1px solid #dc3545; color: #dc3545; padding: 5px 15px; border-radius: 4px; transition: 0.3s; }
      .btn-sort:hover { background: #dc3545; color: white; }

      /* Tarjetas */
      .fav-card {
        background: #111; border: 1px solid #333; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;
        display: flex; align-items: center; transition: 0.2s; cursor: pointer;
      }
      .fav-card:hover { transform: translateX(10px); border-color: #dc3545; background: #1a1a1a; }
      
      .album-thumb { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #dc3545; margin-right: 1.5rem; }
      .song-info { flex-grow: 1; }
      .song-title { font-size: 1.2rem; font-weight: bold; display: block; }
      .album-name { color: #aaa; font-size: 0.9rem; }
      .arrow-icon { color: #444; font-size: 1.5rem; }
      .fav-card:hover .arrow-icon { color: #dc3545; }

      .empty-state { text-align: center; color: #666; margin-top: 3rem; }
    `
  ];

  constructor() {
    super();
    this.favorites = [];
    this.loading = true;
    this.sortCriteria = 'added'; // Default: Orden de agregación
    this.sortDirection = 'asc';  // Default: Ascendente (Más antiguos primero)
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadFavorites();
  }

  async _loadFavorites() {
    if (!auth.isLoggedIn()) return Router.go('/login');
    const user = auth.getUser();
    try {
        const response = await fetch(`${API_URL}/users/${user._id}/favorites`);
        if (response.ok) {
            const data = await response.json();
            // Agregamos un índice original para poder volver al orden por defecto (added)
            this.favorites = data.map((item, index) => ({ ...item, originalIndex: index }));
        }
    } catch (error) { console.error("Error cargando favoritos:", error); } 
    finally { this.loading = false; }
  }

  // Lógica de ordenamiento dinámica
  get sortedFavorites() {
    const list = [...this.favorites];

    return list.sort((a, b) => {
      let valA, valB;

      if (this.sortCriteria === 'added') {
        // Usamos el índice original que guardamos al cargar
        valA = a.originalIndex;
        valB = b.originalIndex;
      } else if (this.sortCriteria === 'title') {
        valA = a.songTitle.toLowerCase();
        valB = b.songTitle.toLowerCase();
      } else if (this.sortCriteria === 'year') {
        valA = a.albumYear;
        valB = b.albumYear;
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  _toggleDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  _goToAlbum(albumId) { Router.go(`/albums/${albumId}`); }

  render() {
    return html`
      <div class="container fav-container">
        <h2>Mis Himnos Favoritos 🤘</h2>

        <div class="control-bar">
          <div>
            <span class="text-secondary fw-bold me-2">ORDENAR POR:</span>
            <select class="filter-select" @change="${e => this.sortCriteria = e.target.value}">
              <option value="added">🕒 Agregado (Default)</option>
              <option value="title">🅰️ Nombre Canción</option>
              <option value="year">📅 Año Álbum</option>
            </select>
          </div>
          <button class="btn-sort" @click="${this._toggleDirection}">
            ${this.sortDirection === 'asc' ? '⬆ ASC' : '⬇ DESC'}
          </button>
        </div>

        ${this.loading ? html`<div class="text-center mt-5"><div class="spinner-border text-danger"></div></div>` : ''}

        ${!this.loading && this.favorites.length === 0 ? html`
            <div class="empty-state">
                <h4>Tu lista está vacía.</h4>
                <p>Ve a la discografía y marca las canciones que te definen.</p>
                <a href="/discografia" class="btn btn-outline-danger mt-3">Ir a Discografía</a>
            </div>
        ` : ''}

        <div class="list-group">
            ${this.sortedFavorites.map(fav => html`
                <div class="fav-card" @click="${() => this._goToAlbum(fav.albumId)}">
                    <img src="${fav.albumCover}" class="album-thumb" alt="${fav.albumTitle}">
                    <div class="song-info">
                        <span class="song-title">${fav.songTitle}</span>
                        <span class="album-name">Álbum: ${fav.albumTitle} (${fav.albumYear})</span>
                    </div>
                    <div class="arrow-icon">➜</div>
                </div>
            `)}
        </div>
      </div>
    `;
  }
}
customElements.define('favorites-view', FavoritesView);
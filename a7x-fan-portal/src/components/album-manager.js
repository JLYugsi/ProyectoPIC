import { LitElement, html, css, unsafeCSS } from 'lit';
import { map } from 'lit/directives/map.js';
import { auth } from '../services/auth-service.js';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import './album-card.js';

const API_URL = 'http://localhost:3000/api/albums';

export class AlbumManager extends LitElement {
  static properties = {
    albums: { type: Array },
    // Filtros
    sortCriteria: { type: String }, // 'year' | 'title'
    sortDirection: { type: String }, // 'asc' | 'desc'

    editingId: { type: String },
    editingTitle: { type: String },
    inputTitle: { type: String },
    inputYear: { type: String },
    inputCover: { type: String },
    inputSongs: { type: String },
    inputDesc: { type: String },
    inputSpotify: { type: String },
    inputAudio: { type: String }
  };

  static styles = [
    unsafeCSS(bootstrapStyles),
    css`
      /* Estilos Formulario Admin */
      .card-form { background-color: #222 !important; border: 1px solid #444; box-shadow: 0 4px 15px rgba(0,0,0,0.8); border-radius: 8px; overflow: hidden; }
      .card-header { background-color: #111 !important; border-bottom: 2px solid #dc3545 !important; color: #fff !important; padding: 1.5rem; font-family: 'Metal Mania', cursive; text-align: center; font-size: 1.5rem; }
      .form-control { background-color: #333 !important; border: 1px solid #555 !important; color: #fff !important; }
      .form-control:focus { background-color: #444 !important; border-color: #dc3545 !important; box-shadow: 0 0 8px rgba(220, 53, 69, 0.6) !important; color: #fff !important; }
      label { color: #dc3545 !important; font-weight: bold; text-transform: uppercase; font-size: 0.85rem; }
      ::placeholder { color: #aaa !important; opacity: 1; }

      /* BARRA DE FILTROS */
      .filter-bar {
        background-color: #111;
        border-bottom: 1px solid #333;
        padding: 1rem;
        margin-bottom: 2rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
      }
      .filter-select {
        background-color: #222;
        color: white;
        border: 1px solid #444;
        padding: 5px 10px;
        border-radius: 4px;
      }
      .btn-sort {
        background: transparent;
        border: 1px solid #444;
        color: #dc3545;
        padding: 5px 15px;
        border-radius: 4px;
        transition: 0.3s;
      }
      .btn-sort:hover { background: #dc3545; color: white; }
    `
  ];

  constructor() {
    super();
    this.albums = [];
    this.sortCriteria = 'year'; // Default: Año
    this.sortDirection = 'asc'; // Default: Ascendente
    
    this._resetForm();
    this._fetchAlbums();
    window.addEventListener('auth-changed', () => this.requestUpdate());
  }

  async _fetchAlbums() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar datos');
      this.albums = await response.json();
    } catch (e) { console.error(e); }
  }

  // Lógica de ordenamiento
  get sortedAlbums() {
    // Creamos una copia para no mutar el array original
    const list = [...this.albums];

    return list.sort((a, b) => {
      let valA, valB;

      if (this.sortCriteria === 'year') {
        valA = a.year;
        valB = b.year;
      } else {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  _toggleDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  // ... (Tus funciones _handleSpotifyInput, _handleSubmit, etc. se mantienen igual) ...
  _handleSpotifyInput(e) {
    const textoPegado = e.target.value;
    const regex = /src="([^"]+)"/;
    const coincidencia = textoPegado.match(regex);
    this.inputSpotify = (coincidencia && coincidencia[1]) ? coincidencia[1] : textoPegado;
    if (coincidencia) e.target.value = this.inputSpotify;
  }

  render() {
    const isAdmin = auth.isAdmin();

    return html`
      <div class="container py-4">
        
        <div class="filter-bar">
          <div class="d-flex align-items-center gap-3">
            <span class="fw-bold text-secondary">ORDENAR POR:</span>
            <select class="filter-select" @change="${e => this.sortCriteria = e.target.value}">
              <option value="year">📅 Año de Lanzamiento</option>
              <option value="title">🅰️ Alfabético (A-Z)</option>
            </select>
          </div>
          
          <button class="btn-sort" @click="${this._toggleDirection}">
            ${this.sortDirection === 'asc' ? '⬆ ASCENDENTE' : '⬇ DESCENDENTE'}
          </button>
        </div>

        ${isAdmin ? html`
            <div class="card card-form mb-5">
            <div class="card-header ${this.editingId ? 'text-warning' : ''}">
                ${this.editingId ? `✏️ EDITANDO: ${this.editingTitle}` : '➕ AGREGAR NUEVO ÁLBUM'}
            </div>
            <div class="card-body p-4">
                <form @submit="${this._handleSubmit}">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label>Título</label>
                        <input type="text" class="form-control" placeholder="Ej: City of Evil" required 
                            .value="${this.inputTitle}" @input="${e => this.inputTitle = e.target.value}">
                    </div>
                    <div class="col-md-6">
                        <label>Año</label>
                        <input type="number" class="form-control" placeholder="2005" required
                            .value="${this.inputYear}" @input="${e => this.inputYear = e.target.value}">
                    </div>
                    <div class="col-12">
                        <label>Portada (URL)</label>
                        <input type="url" class="form-control" placeholder="https://..." required
                            .value="${this.inputCover}" @input="${e => this.inputCover = e.target.value}">
                    </div>
                    <div class="col-md-6">
                        <label>Spotify Embed Code</label>
                        <input type="text" class="form-control" placeholder="Pega el código iframe..." 
                            .value="${this.inputSpotify}" @input="${this._handleSpotifyInput}">
                    </div>
                    <div class="col-md-6">
                        <label>Audio Preview (MP3)</label>
                        <input type="text" class="form-control" placeholder="URL MP3" 
                            .value="${this.inputAudio}" @input="${e => this.inputAudio = e.target.value}">
                    </div>
                    <div class="col-12">
                        <label>Canciones</label>
                        <input type="text" class="form-control" placeholder="Cancion 1, Cancion 2..." required
                            .value="${this.inputSongs}" @input="${e => this.inputSongs = e.target.value}">
                    </div>
                    <div class="col-12">
                        <label>Descripción</label>
                        <textarea class="form-control" rows="2" placeholder="Descripción..." required
                            .value="${this.inputDesc}" @input="${e => this.inputDesc = e.target.value}"></textarea>
                    </div>
                    <div class="col-12 text-end mt-3">
                        ${this.editingId ? html`<button type="button" class="btn btn-outline-light me-2" @click="${this._resetForm}">Cancelar</button>` : ''}
                        <button type="submit" class="btn ${this.editingId ? 'btn-warning' : 'btn-danger'} fw-bold px-4">
                            ${this.editingId ? 'GUARDAR' : 'REGISTRAR'}
                        </button>
                    </div>
                </div>
                </form>
            </div>
            </div>
        ` : ''}

        <div class="row g-4">
          ${map(this.sortedAlbums, (album) => html`
            <div class="col-md-6 col-lg-4">
              <album-card
                .id="${album._id}"
                .title="${album.title}"
                .year="${album.year}"
                .cover="${album.cover}"
                .desc="${album.desc}"
                .songs="${album.songs}"
                .spotifyUrl="${album.spotifyUrl}"
                .audioPreview="${album.audioPreview}"
                @delete-album="${this._handleDelete}"
                @edit-album="${this._handleEditRequest}"
              ></album-card>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  // --- MÉTODOS DE ACCIÓN (Sin cambios en lógica) ---
  async _handleSubmit(e) {
    e.preventDefault();
    const body = JSON.stringify({
        title: this.inputTitle, year: this.inputYear, cover: this.inputCover,
        desc: this.inputDesc, songs: this.inputSongs,
        spotifyUrl: this.inputSpotify, audioPreview: this.inputAudio
    });
    const headers = { 'Content-Type': 'application/json' };
    try {
        if (this.editingId) await fetch(`${API_URL}/${this.editingId}`, { method: 'PUT', headers, body });
        else await fetch(API_URL, { method: 'POST', headers, body });
        this._fetchAlbums(); this._resetForm();
    } catch (e) { alert('Error al guardar'); }
  }

  async _handleDelete(e) {
    if (confirm("¿Eliminar este álbum?")) {
        try { await fetch(`${API_URL}/${e.detail.id}`, { method: 'DELETE' }); this._fetchAlbums(); } 
        catch (e) { alert('Error al eliminar'); }
    }
  }

  _handleEditRequest(e) {
    const album = this.albums.find(a => a.title === e.detail.title);
    if(!album) return;
    this.editingId = album._id; this.editingTitle = album.title;
    this.inputTitle = album.title; this.inputYear = album.year;
    this.inputCover = album.cover; this.inputDesc = album.desc;
    this.inputSongs = album.songs || ''; this.inputSpotify = album.spotifyUrl || '';
    this.inputAudio = album.audioPreview || '';
    const form = this.shadowRoot.querySelector('form');
    if(form) form.scrollIntoView({ behavior: 'smooth' });
  }

  _resetForm() {
    this.editingId = null; this.editingTitle = null;
    this.inputTitle = ''; this.inputYear = ''; this.inputCover = '';
    this.inputDesc = ''; this.inputSongs = ''; this.inputSpotify = ''; this.inputAudio = '';
  }
}
customElements.define('album-manager', AlbumManager);
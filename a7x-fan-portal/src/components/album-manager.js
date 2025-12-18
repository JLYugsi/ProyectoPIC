import { LitElement, html, css, unsafeCSS } from 'lit';
import { map } from 'lit/directives/map.js';
import { auth } from '../services/auth-service.js';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import './album-card.js';
import './song-modal.js';

const API_URL = 'http://localhost:3000/api/albums';

export class AlbumManager extends LitElement {
  static properties = {
    albums: { type: Array },
    editingId: { type: String },
    editingTitle: { type: String },
    // Inputs
    inputTitle: { type: String },
    inputYear: { type: String },
    inputCover: { type: String },
    inputSongs: { type: String },
    inputDesc: { type: String },
    inputSpotify: { type: String }, // Nuevo
    inputAudio: { type: String }    // Nuevo
  };

  static styles = [
    unsafeCSS(bootstrapStyles),
    css`
      /* Estilos Formulario Admin */
      .card-form {
        background-color: #1a1a1a; 
        border: 1px solid #444;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      }
      .card-header {
        background-color: #000;
        border-bottom: 1px solid #dc3545;
        color: white;
        padding: 1rem;
        font-size: 1.2rem;
      }
      input.form-control, textarea.form-control {
        background-color: #2c2c2c !important;
        border: 1px solid #555 !important;
        color: white !important;
      }
      input.form-control:focus, textarea.form-control:focus {
        background-color: #333 !important;
        border-color: #dc3545 !important;
        box-shadow: 0 0 5px rgba(220, 53, 69, 0.5);
        color: white !important;
      }
      label { font-weight: bold; color: #ccc; margin-bottom: 5px; display: block; }
      ::placeholder { color: #888 !important; opacity: 1; }
    `
  ];

  constructor() {
    super();
    this.albums = [];
    this._resetForm();
    this._fetchAlbums();
    window.addEventListener('auth-changed', () => this.requestUpdate());
  }

  async _fetchAlbums() {
    try {
      const response = await fetch(API_URL);
      this.albums = await response.json();
    } catch (e) { console.error(e); }
  }

  render() {
    const isAdmin = auth.isAdmin();

    return html`
      <song-modal id="mySongModal"></song-modal>

      <div class="container py-4">
        
        ${isAdmin ? html`
            <div class="card card-form mb-5">
            <div class="card-header text-center fw-bold ${this.editingId ? 'text-warning' : ''}">
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
                        <label>Spotify Embed URL (src)</label>
                        <input type="text" class="form-control" placeholder="https://open.spotify.com/embed/album/..." 
                            .value="${this.inputSpotify}" @input="${e => this.inputSpotify = e.target.value}">
                    </div>
                    <div class="col-md-6">
                        <label>Audio Preview (MP3 URL)</label>
                        <input type="text" class="form-control" placeholder="/audio/preview.mp3 o URL externa" 
                            .value="${this.inputAudio}" @input="${e => this.inputAudio = e.target.value}">
                    </div>

                    <div class="col-12">
                        <label>Canciones (para votar)</label>
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
          ${map(this.albums, (album) => html`
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
                @view-songs="${this._handleViewSongs}"
              ></album-card>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  async _handleSubmit(e) {
    e.preventDefault();
    const body = JSON.stringify({
        title: this.inputTitle, year: this.inputYear, cover: this.inputCover,
        desc: this.inputDesc, songs: this.inputSongs,
        spotifyUrl: this.inputSpotify, // Guardar
        audioPreview: this.inputAudio  // Guardar
    });
    const headers = { 'Content-Type': 'application/json' };

    try {
        if (this.editingId) {
            await fetch(`${API_URL}/${this.editingId}`, { method: 'PUT', headers, body });
        } else {
            await fetch(API_URL, { method: 'POST', headers, body });
        }
        this._fetchAlbums();
        this._resetForm();
    } catch (e) { alert('Error al guardar'); }
  }

  async _handleDelete(e) {
    const { id } = e.detail;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        this._fetchAlbums();
    } catch (e) { alert('Error al eliminar'); }
  }

  _handleEditRequest(e) {
    const album = this.albums.find(a => a.title === e.detail.title);
    if(!album) return;

    this.editingId = album._id;
    this.editingTitle = album.title;
    this.inputTitle = album.title;
    this.inputYear = album.year;
    this.inputCover = album.cover;
    this.inputDesc = album.desc;
    this.inputSongs = album.songs || '';
    this.inputSpotify = album.spotifyUrl || ''; // Cargar
    this.inputAudio = album.audioPreview || ''; // Cargar
    
    const form = this.shadowRoot.querySelector('form');
    if(form) form.scrollIntoView({ behavior: 'smooth' });
  }

  _handleViewSongs(e) {
    const modal = this.shadowRoot.getElementById('mySongModal');
    // Pasamos el spotifyUrl al modal
    modal.openModal(e.detail.title, e.detail.songs, e.detail.spotifyUrl);
  }

  _resetForm() {
    this.editingId = null;
    this.editingTitle = null;
    this.inputTitle = '';
    this.inputYear = '';
    this.inputCover = '';
    this.inputDesc = '';
    this.inputSongs = '';
    this.inputSpotify = '';
    this.inputAudio = '';
  }
}
customElements.define('album-manager', AlbumManager);
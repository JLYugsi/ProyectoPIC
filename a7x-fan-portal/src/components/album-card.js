import { LitElement, html, css, unsafeCSS } from 'lit';
import { Router } from '@vaadin/router';
import { auth } from '../services/auth-service.js';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class AlbumCard extends LitElement {
  static properties = {
    id: { type: String },
    title: { type: String },
    year: { type: Number },
    cover: { type: String },
    desc: { type: String },
    songs: { type: String },
    spotifyUrl: { type: String },
    audioPreview: { type: String }
  };

  static styles = [
    unsafeCSS(bootstrapStyles),
    css`
      :host { display: block; height: 100%; }
      .card { 
        background: #1a1a1a; 
        border: 1px solid #333; 
        height: 100%; 
        color: white; 
        cursor: pointer; 
        transition: 0.3s;
      }
      .card:hover { transform: translateY(-5px); border-color: #dc3545; box-shadow: 0 0 15px rgba(220,53,69,0.3); }
      img { width: 100%; aspect-ratio: 1/1; object-fit: contain; background: black; border-bottom: 2px solid #dc3545; }
      .card-body { padding: 1rem; }
      .card-title { font-family: 'Metal Mania'; font-size: 1.4rem; color: #fff; }
    `
  ];

  constructor() {
    super();
    this.audio = null;
  }

  disconnectedCallback() { super.disconnectedCallback(); this._stopAudio(); }

  render() {
    const isAdmin = auth.isAdmin();
    return html`
      <div class="card" 
           @mouseenter="${this._playAudio}" 
           @mouseleave="${this._stopAudio}"
           @click="${this._handleViewSongs}"> <img src="${this.cover}" class="card-img-top" alt="${this.title}">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
             <h3 class="card-title m-0">${this.title}</h3>
             <span class="badge bg-danger">${this.year}</span>
          </div>
          <p class="text-secondary small mt-2 mb-0">${this.desc}</p>
          
          ${this.audioPreview ? html`<small class="text-danger d-block mt-2"><i class="fas fa-volume-up"></i> Hit Preview</small>` : ''}

          ${isAdmin ? html`
            <div class="mt-3 pt-2 border-top border-secondary d-flex justify-content-between" @click="${e => e.stopPropagation()}">
              <button class="btn btn-sm btn-outline-warning" @click="${this._handleEdit}">✏️</button>
              <button class="btn btn-sm btn-outline-danger" @click="${this._handleDelete}">🗑️</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  _playAudio() {
    if (this.audioPreview) {
      if (!this.audio) this.audio = new Audio(this.audioPreview);
      this.audio.volume = 0.4;
      this.audio.play().catch(() => {});
    }
  }

  _stopAudio() {
    if (this.audio) { this.audio.pause(); this.audio.currentTime = 0; }
  }

  _handleViewSongs() {
    // Si no está logueado, redirigir
    if (!auth.isLoggedIn()) return Router.go('/login');

    // NAVEGACIÓN: Usamos el Router para ir a la nueva página de detalle
    Router.go(`/albums/${this.id}`);
  }

  _handleEdit() {
    this.dispatchEvent(new CustomEvent('edit-album', {
      detail: { 
        title: this.title, year: this.year, cover: this.cover, 
        desc: this.desc, songs: this.songs,
        spotifyUrl: this.spotifyUrl,
        audioPreview: this.audioPreview
      },
      bubbles: true, composed: true
    }));
  }
  
  _handleDelete() {
    if(confirm("¿Borrar álbum?")) this.dispatchEvent(new CustomEvent('delete-album', { detail: { id: this.id }, bubbles: true, composed: true }));
  }
}
customElements.define('album-card', AlbumCard);
import { LitElement, html, css, unsafeCSS } from 'lit';
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
        transition: transform 0.3s, border-color 0.3s; 
        height: 100%; 
        color: white; 
        cursor: pointer; /* Mano al pasar el mouse */
      }
      .card:hover { 
        transform: translateY(-10px) scale(1.02); 
        border-color: #dc3545; 
        box-shadow: 0 0 20px rgba(220, 53, 69, 0.4);
      }
      img { width: 100%; aspect-ratio: 1/1; object-fit: contain; background-color: black; border-bottom: 2px solid #dc3545; }
      .card-title { font-family: 'Metal Mania', cursive; font-size: 1.5rem; color: #fff; }
      .card-body { display: flex; flex-direction: column; padding: 1rem; }
      
      /* Botones de acción (Admin) */
      .admin-actions { z-index: 10; position: relative; }
    `
  ];

  constructor() {
    super();
    this.audio = null;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAudio();
  }

  render() {
    const isAdmin = auth.isAdmin();
    
    return html`
      <div class="card" 
           @mouseenter="${this._playAudio}" 
           @mouseleave="${this._stopAudio}"
           @click="${this._handleViewSongs}"> <img src="${this.cover}" class="card-img-top" alt="${this.title}">
        
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h3 class="card-title mb-0">${this.title}</h3>
            <span class="badge bg-danger">${this.year}</span>
          </div>
          <p class="card-text text-secondary flex-grow-1">${this.desc}</p>
          
          ${this.audioPreview ? html`<small class="text-danger"><i class="fas fa-volume-up"></i></small>` : ''}

          ${isAdmin ? html`
            <div class="d-flex justify-content-between border-top border-secondary pt-3 mt-3 admin-actions" 
                 @click="${(e) => e.stopPropagation()}"> <button class="btn btn-outline-warning btn-sm w-45" @click="${this._handleEdit}">✏️ Editar</button>
              <button class="btn btn-outline-danger btn-sm w-45" @click="${this._handleDelete}">🗑️ Borrar</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  _playAudio() {
    if (this.audioPreview) {
      if (!this.audio) this.audio = new Audio(this.audioPreview);
      this.audio.volume = 0.5; 
      this.audio.play().catch(e => console.log("Autoplay bloqueado:", e));
    }
  }

  _stopAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0; 
    }
  }

  _handleViewSongs() {
    // Si no está logueado, redirigir o mostrar alerta (opcional, según tu gusto)
    if (!auth.isLoggedIn()) {
        window.location.href = '/login';
        return;
    }

    this.dispatchEvent(new CustomEvent('view-songs', {
      detail: { 
        title: this.title, 
        songs: this.songs,
        spotifyUrl: this.spotifyUrl 
      },
      bubbles: true, composed: true
    }));
  }

  _handleDelete() {
    if(confirm(`¿Eliminar álbum "${this.title}"?`)) {
        this.dispatchEvent(new CustomEvent('delete-album', {
            detail: { id: this.id },
            bubbles: true, composed: true
        }));
    }
  }

  _handleEdit() {
    this.dispatchEvent(new CustomEvent('edit-album', {
      detail: { 
        title: this.title, year: this.year, cover: this.cover, 
        desc: this.desc, songs: this.songs,
        spotifyUrl: this.spotifyUrl,     // Enviamos datos nuevos
        audioPreview: this.audioPreview  // Enviamos datos nuevos
      },
      bubbles: true, composed: true
    }));
  }
}
customElements.define('album-card', AlbumCard);
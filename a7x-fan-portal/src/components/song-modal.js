import { LitElement, html, css, unsafeCSS } from 'lit';
import { Modal } from 'bootstrap'; // <--- IMPORTACIÓN DIRECTA CLAVE
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class SongModal extends LitElement {
  static properties = {
    title: { type: String },
    songs: { type: Array },
    spotifyUrl: { type: String }
  };

  static styles = [
    unsafeCSS(bootstrapStyles),
    css`
      /* Aseguramos que el modal tenga z-index alto para verse sobre todo */
      .modal { z-index: 1055 !important; }
      .modal-backdrop { z-index: 1050 !important; }
      
      .modal-content { background-color: #212529; color: #fff; border: 1px solid #dc3545; }
      .modal-header { border-bottom: 1px solid #444; }
      .track-list { max-height: 250px; overflow-y: auto; margin-top: 1rem;}
      .song-item {
        background: #2c3034; margin-bottom: 5px; padding: 10px; border-radius: 4px;
        display: flex; justify-content: space-between; align-items: center;
      }
      .btn-fav { background: none; border: none; color: #666; transition: 0.3s; font-size: 1.2rem; cursor: pointer; }
      .btn-fav:hover, .btn-fav.active { color: #dc3545; transform: scale(1.2); }
      .btn-fav.active { text-shadow: 0 0 5px red; }
    `
  ];

  constructor() {
    super();
    this.title = '';
    this.songs = [];
    this.spotifyUrl = '';
    this.modalInstance = null;
  }

  firstUpdated() {
    const modalEl = this.shadowRoot.getElementById('songsModal');
    // Usamos la clase Modal importada directamente
    this.modalInstance = new Modal(modalEl);
  }

  openModal(albumTitle, songsString, spotifyUrl) {
    console.log("Intentando abrir modal para:", albumTitle); // Debug
    this.title = albumTitle;
    // Convertimos la cadena de canciones en Array
    this.songs = songsString ? songsString.split(',').map(s => s.trim()) : [];
    this.spotifyUrl = spotifyUrl; 
    
    this.requestUpdate();
    
    // Pequeño timeout para asegurar que Lit actualizó el DOM antes de mostrar
    setTimeout(() => {
        if(this.modalInstance) this.modalInstance.show();
    }, 0);
  }

  render() {
    return html`
      <div class="modal fade" id="songsModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">💿 ${this.title}</h5>
              <button type="button" class="btn-close btn-close-white" @click="${() => this.modalInstance.hide()}"></button>
            </div>
            <div class="modal-body">
              
              ${this.spotifyUrl ? html`
                <div class="ratio ratio-16x9 mb-3" style="max-height: 352px;">
                  <iframe style="border-radius:12px" 
                          src="${this.spotifyUrl}" 
                          width="100%" height="352" 
                          frameBorder="0" 
                          allowfullscreen="" 
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                          loading="lazy">
                  </iframe>
                </div>
              ` : html`<div class="alert alert-dark text-center small">No hay preview de Spotify para este álbum.</div>`}

              <h6 class="text-danger fw-bold border-bottom border-secondary pb-2 mt-4">
                TRACKLIST & FAVORITOS
              </h6>
              <div class="track-list">
                ${this.songs.length === 0 
                  ? html`<p class="text-muted text-center">No hay lista de canciones registrada.</p>`
                  : this.songs.map((song, i) => html`
                      <div class="song-item">
                        <span><span class="text-danger fw-bold me-2">#${i + 1}</span> ${song}</span>
                        <button class="btn-fav" @click="${(e) => this._toggleFav(e, song)}" title="Agregar a Favoritos">
                          ❤
                        </button>
                      </div>
                    `)
                }
              </div>

            </div>
          </div>
        </div>
      </div>
    `;
  }

  _toggleFav(e, songName) {
    const btn = e.target;
    btn.classList.toggle('active');
    if(btn.classList.contains('active')) {
        alert(`¡"${songName}" agregada a tus favoritos!`);
    }
  }
}
customElements.define('song-modal', SongModal);
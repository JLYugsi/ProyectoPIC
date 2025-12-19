import { LitElement, html, css, unsafeCSS } from 'lit';
import { Router } from '@vaadin/router';
import { auth } from '../services/auth-service.js'; // <--- 1. IMPORTACIÓN FALTANTE
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';

// URL base de la API
const API_URL = 'http://localhost:3000/api';

export class AlbumDetail extends LitElement {
  static properties = {
    location: { type: Object },
    album: { type: Object },
    userFavorites: { type: Array } // <--- 2. NUEVA PROPIEDAD: Para recordar los likes
  };

  static styles = [
    unsafeCSS(bootstrapStyles),
    css`
      :host { display: block; min-height: 100vh; background-color: #000; color: white; }
      
      .detail-container { padding-top: 2rem; padding-bottom: 5rem; }
      
      .btn-back { color: #aaa; text-decoration: none; font-size: 1.1rem; display: inline-flex; align-items: center; margin-bottom: 20px; transition: 0.3s; }
      .btn-back:hover { color: #dc3545; transform: translateX(-5px); }

      .cover-img { width: 100%; border-radius: 8px; box-shadow: 0 0 20px rgba(220, 53, 69, 0.3); border: 1px solid #333; }
      
      h1 { font-family: 'Metal Mania', cursive; font-size: 3.5rem; color: #dc3545; margin-bottom: 0.5rem; }
      .year-badge { font-size: 1.2rem; background: #333; padding: 5px 15px; border-radius: 20px; color: #fff; }

      .track-list-container {
        background-color: #111;
        border: 1px solid #333;
        border-radius: 10px;
        padding: 2rem;
        margin-top: 2rem;
      }
      
      .song-item {
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 15px;
        border-bottom: 1px solid #222;
        transition: 0.2s;
      }
      .song-item:hover { background-color: #1a1a1a; }
      .song-number { color: #dc3545; font-weight: bold; width: 30px; }
      .song-title { color: #fff; font-size: 1.1rem; flex-grow: 1; }
      
      .btn-fav { 
        background: transparent; border: 1px solid #444; color: #666; 
        border-radius: 50%; width: 40px; height: 40px; 
        display: flex; align-items: center; justify-content: center;
        transition: 0.3s; cursor: pointer;
      }
      .btn-fav:hover { border-color: #dc3545; color: #dc3545; }
      
      /* CLASE ACTIVA (ROJO) */
      .btn-fav.active { 
        background: #dc3545; 
        color: white; 
        border-color: #dc3545; 
        box-shadow: 0 0 10px #dc3545; 
        transform: scale(1.1);
      }
    `
  ];

  constructor() {
    super();
    this.album = null;
    this.userFavorites = []; // Inicializamos vacío
  }

  async firstUpdated() {
    const albumId = this.location.params.id; 
    await this._fetchAlbumData(albumId);
    this._loadUserFavorites(); // <--- 3. CARGAMOS LOS FAVORITOS AL INICIAR
  }

  async _fetchAlbumData(id) {
    try {
      const response = await fetch(`${API_URL}/albums/${id}`);
      if (!response.ok) throw new Error("No encontrado");
      this.album = await response.json();
    } catch (error) {
      console.error(error);
      alert("Error cargando el álbum.");
    }
  }

  // Obtenemos los favoritos de la sesión actual
  _loadUserFavorites() {
    const user = auth.getUser();
    if (user && user.favorites) {
        this.userFavorites = user.favorites;
    }
  }

  // 4. FUNCIÓN PARA VER SI UNA CANCIÓN YA ES FAVORITA
  _isFavorite(songName) {
    if (!this.album) return false;
    // Comparamos si esta canción Y este álbum están en la lista del usuario
    return this.userFavorites.some(f => f.songTitle === songName && f.albumId === this.album._id);
  }

  render() {
    if (!this.album) return html`<div class="text-center text-white mt-5">Cargando... 💀</div>`;

    const songsArray = this.album.songs ? this.album.songs.split(',').map(s => s.trim()) : [];

    return html`
      <div class="container detail-container">
        
        <a href="/discografia" class="btn-back">⬅ Volver a la Discografía</a>

        <div class="row g-5">
          <div class="col-lg-5">
            <img src="${this.album.cover}" class="cover-img mb-4" alt="${this.album.title}">
            
            ${this.album.spotifyUrl ? html`
               <div class="ratio ratio-1x1" style="max-height: 400px; border-radius: 12px; overflow: hidden; border: 1px solid #333;">
                  <iframe src="${this.album.spotifyUrl}" 
                          width="100%" height="100%" 
                          frameBorder="0" 
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                          loading="lazy">
                  </iframe>
               </div>
            ` : html`<div class="alert alert-dark text-center">Spotify no disponible</div>`}
          </div>

          <div class="col-lg-7">
            <h1>${this.album.title}</h1>
            <div class="mb-4">
               <span class="year-badge">${this.album.year}</span>
            </div>
            
            <p class="lead text-secondary">${this.album.desc}</p>

            <div class="track-list-container">
              <h3 class="text-white border-bottom border-secondary pb-3 mb-3">
                <i class="fas fa-list"></i> Lista de Canciones
              </h3>
              
              ${songsArray.length === 0 
                ? html`<p class="text-muted">No hay canciones registradas.</p>`
                : songsArray.map((song, i) => html`
                    <div class="song-item">
                      <span class="song-number">${i + 1}.</span>
                      <span class="song-title">${song}</span>
                      
                      <button class="btn-fav ${this._isFavorite(song) ? 'active' : ''}" 
                              @click="${(e) => this._toggleFav(e, song)}" 
                              title="Favoritos">
                        ❤
                      </button>
                    </div>
                  `)
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 6. LA LÓGICA REAL DE CONEXIÓN AL BACKEND
  async _toggleFav(e, songTitle) {
    // Si no está logueado, lo mandamos al login
    if (!auth.isLoggedIn()) {
        alert("Debes iniciar sesión para guardar favoritos.");
        return Router.go('/login');
    }

    const user = auth.getUser();
    const btn = e.target.closest('.btn-fav');
    
    // Feedback visual inmediato (para que se sienta rápido)
    btn.classList.toggle('active');

    try {
        const response = await fetch(`${API_URL}/users/${user._id}/favorites`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                albumId: this.album._id, // Usamos el ID de Mongo
                songTitle: songTitle 
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Actualizamos la sesión local del usuario con la nueva lista de favoritos
            // Esto es vital para que al cambiar de página no se pierdan los corazones
            const updatedUser = { ...user, favorites: data.favorites };
            auth.login(updatedUser); 
            
            // Actualizamos la vista
            this.userFavorites = data.favorites;
            this.requestUpdate();
        } else {
            // Si falló, revertimos el color
            btn.classList.toggle('active');
            alert("Error al guardar favorito");
        }
    } catch (error) {
        console.error(error);
        btn.classList.toggle('active');
    }
  }
}
customElements.define('album-detail', AlbumDetail);
import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class BandHistory extends LitElement {
  static styles = [
    unsafeCSS(bootstrapStyles),
    css`
      :host { display: block; }
      .history-container {
        background-color: #111;
        border-radius: 10px;
        padding: 2rem;
        border: 1px solid #333;
        color: #ddd;
      }
      .timeline-item {
        border-left: 3px solid #dc3545;
        padding-left: 20px;
        margin-bottom: 30px;
        position: relative;
      }
      .timeline-item::before {
        content: '';
        width: 15px;
        height: 15px;
        background: #dc3545;
        border-radius: 50%;
        position: absolute;
        left: -9px;
        top: 5px;
      }
      .year {
        font-family: 'Metal Mania', cursive;
        font-size: 1.4rem;
        color: #dc3545;
        display: block;
        margin-bottom: 5px;
      }
      .event-title { font-weight: bold; font-size: 1.1rem; color: white; }
      .event-desc { color: #aaa; font-size: 0.95rem; }
      .quote-box {
        border-left: 4px solid #fff;
        background: #222;
        padding: 15px;
        font-style: italic;
        margin-top: 20px;
        color: #fff;
      }
    `
  ];

  render() {
    return html`
      <div class="container py-5">
        <h2 class="text-center mb-5" style="font-family: 'Metal Mania'; color: #fff; font-size: 3rem;">Historia de la Bestia</h2>
        
        <div class="history-container">
          <div class="timeline">
            
            <div class="timeline-item">
              <span class="year">1999</span>
              <div class="event-title">Génesis 4:24</div>
              <p class="event-desc">
                Cansados de la rigurosidad de la escuela católica en Huntington Beach, M. Shadows y The Rev forman la banda. 
                El nombre surge de la historia bíblica de Caín y Abel: <em>"Si Caín ha de ser vengado siete veces..."</em>.
                Lanzan sus primeros demos con un sonido Metalcore agresivo.
              </p>
            </div>

            <div class="timeline-item">
              <span class="year">2003</span>
              <div class="event-title">Waking the Fallen</div>
              <p class="event-desc">
                El álbum que definió su identidad temprana. Con himnos como <em>"Unholy Confessions"</em>, la banda empieza a generar una fiebre local 
                y atrae la atención de grandes discográficas. Se consolida la alineación clásica con Synyster Gates y Johnny Christ.
              </p>
            </div>

            <div class="timeline-item">
              <span class="year">2005</span>
              <div class="event-title">La Evolución: City of Evil</div>
              <p class="event-desc">
                M. Shadows decide abandonar los gritos desgarradores para buscar un sonido más melódico y épico. 
                Nace <em>"Bat Country"</em> y la banda gana el premio MTV a "Mejor Artista Nuevo", catapultándolos a la fama mundial.
              </p>
            </div>

            <div class="timeline-item">
              <span class="year">2007</span>
              <div class="event-title">Avenged Sevenfold (Homónimo)</div>
              <p class="event-desc">
                Un año de experimentación y libertad creativa. Temas como <em>"A Little Piece of Heaven"</em> demuestran que no tienen miedo a lo teatral.
                Sería el último álbum completo con The Rev en la batería.
              </p>
            </div>

            <div class="timeline-item">
              <span class="year">2009</span>
              <div class="event-title">La Muerte de The Rev</div>
              <p class="event-desc">
                El 28 de diciembre, el mundo del metal se detiene. Jimmy "The Rev" Sullivan fallece, dejando a la banda devastada. 
                Consideraron separarse, pero decidieron continuar para honrar su legado.
              </p>
            </div>

            <div class="timeline-item">
              <span class="year">2010</span>
              <div class="event-title">Nightmare</div>
              <p class="event-desc">
                Con Mike Portnoy (Dream Theater) en la batería como tributo a Jimmy, lanzan su disco más oscuro y emotivo.
                Alcanzan el <strong>#1 en Billboard 200</strong>, destronando a artistas pop y demostrando que el metal seguía vivo en la cima.
              </p>
            </div>

            <div class="timeline-item">
              <span class="year">2013</span>
              <div class="event-title">Hail to the King</div>
              <p class="event-desc">
                Un homenaje directo a los reyes del rock y metal de los 80s (Metallica, Guns N' Roses). 
                Un sonido más simple, pesado y contundente que los llevó a encabezar los festivales más grandes del mundo como Rock in Rio.
              </p>
            </div>

            <div class="timeline-item">
              <span class="year">2016</span>
              <div class="event-title">The Stage & Brooks Wackerman</div>
              <p class="event-desc">
                Brooks Wackerman se une como el baterista definitivo. Lanzan por sorpresa <em>The Stage</em>, 
                un álbum conceptual progresivo sobre Inteligencia Artificial y la autodestrucción humana.
              </p>
            </div>

            <div class="timeline-item">
              <span class="year">2023 - 2025</span>
              <div class="event-title">Life Is But a Dream...</div>
              <p class="event-desc">
                Tras años de silencio, regresan con su obra más vanguardista y experimental. 
                Inspirados en la filosofía de Albert Camus y el existencialismo, la banda explora sonidos que mezclan metal, jazz y electrónica, 
                consolidándose como artistas que no siguen reglas.
              </p>
            </div>

          </div>

          <div class="quote-box text-center">
            "He who makes a beast of himself gets rid of the pain of being a man." 
            <br><small class="text-muted">- Dr. Johnson (Intro de Bat Country)</small>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('band-history', BandHistory);
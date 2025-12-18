import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import './member-card.js';

export class MembersView extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
      /* Títulos con la fuente de la banda */
      h2 { font-family: 'Metal Mania'; color: #fff; font-size: 3rem; margin-bottom: 1rem; }
      h3 { 
        font-family: 'Metal Mania'; 
        color: #dc3545; 
        font-size: 2.2rem; 
        margin-top: 3rem; 
        margin-bottom: 2rem; 
        border-bottom: 1px solid #333; 
        padding-bottom: 10px;
        text-shadow: 0 0 10px rgba(220, 53, 69, 0.3);
      }
      .members-container { padding: 2rem 0; }
    `
    ];

    render() {
        return html`
      <div class="container members-container">
        <h2 class="text-center">La Familia A7X</h2>
        <p class="text-center text-muted lead">Quienes están y quienes construyeron el camino.</p>

        <h3 class="text-center">Alineación Actual</h3>
        <div class="row justify-content-center g-4">
            
            <div class="col-md-4 col-6">
                <member-card 
                    name="Matthew Charles Sanders (aka M. Shadows)" 
                    role="Voz" 
                    img="https://i.pinimg.com/736x/1b/4f/01/1b4f01347d10ef354e4e821b7c005d4a.jpg">
                </member-card>
            </div>
            
            <div class="col-md-4 col-6">
                <member-card 
                    name="Brian Elwin Haner (aka Synyster Gates)" 
                    role="Guitarra Líder, Coros" 
                    img="https://i.pinimg.com/736x/26/83/c9/2683c9501ef0eb5d44c3dd78a2b26c05.jpg">
                </member-card>
            </div>
            
            <div class="col-md-4 col-6">
                <member-card 
                    name="Zachary James Baker (aka Zacky Vengeance)" 
                    role="Guitarra Rítmica, Coros" 
                    img="https://i.pinimg.com/736x/50/a6/d2/50a6d25df42c35a3075df969ad4a14f9.jpg">
                </member-card>
            </div>
            
            <div class="col-md-4 col-6">
                <member-card 
                    name="Jonathan Lewis Seward (aka Johnny Christ)" 
                    role="Bajo, Coros" 
                    img="https://i.pinimg.com/736x/89/33/f4/8933f42f484e308d286f0468ad8dd21e.jpg">
                </member-card>
            </div>
            
            <div class="col-md-4 col-6">
                <member-card 
                    name="Brooks Wackerman" 
                    role="Batería" 
                    img="https://i.pinimg.com/736x/71/7f/b9/717fb971dfedae9236c03179cbe2dfb8.jpg">
                </member-card>
            </div>
        </div>

        <h3 class="text-center">Miembros Pasados (Legado)</h3>
        <div class="row justify-content-center g-4">
            
            <div class="col-md-4 col-6">
                <member-card 
                    name="James Owen Sullivan (aka The Rev)" 
                    role="Batería, Voz, Piano (1999 - 2009)" 
                    img="https://i.pinimg.com/1200x/71/f9/9d/71f99d61e7c669fb9348f41ab70a4557.jpg">
                </member-card>
            </div>

            <div class="col-md-4 col-6">
                <member-card 
                    name="Mike Portnoy" 
                    role="Batería (2010)" 
                    img="https://i.pinimg.com/736x/db/67/28/db67280719d946cfe8521b07f35f46a3.jpg">
                </member-card>
            </div>

            <div class="col-md-4 col-6">
                <member-card 
                    name="Arin Ilejay" 
                    role="Batería (2011 - 2015)" 
                    img="https://i.pinimg.com/736x/73/4f/98/734f98b7ed50c1122393fd259bb331bc.jpg">
                </member-card>
            </div>

            <div class="col-md-4 col-6">
                <member-card 
                    name="Matt Wendt" 
                    role="Bajo (1999 - 2000)" 
                    img="https://m.media-amazon.com/images/I/41vvlw+P0uL._AC_UF894,1000_QL80_.jpg">
                </member-card>
            </div>

            <div class="col-md-4 col-6">
                <member-card 
                    name="Justin David Meacham" 
                    role="Bajo (2000 - 2001)" 
                    img="https://m.media-amazon.com/images/I/41vvlw+P0uL._AC_UF894,1000_QL80_.jpg">
                </member-card>
            </div>

            <div class="col-md-4 col-6">
                <member-card 
                    name="Frank L. Melcom (aka Dameon Ash)" 
                    role="Bajo (2002)" 
                    img="https://m.media-amazon.com/images/I/41vvlw+P0uL._AC_UF894,1000_QL80_.jpg">
                </member-card>
            </div>
        </div>
      </div>
    `;
    }
}
customElements.define('members-view', MembersView);
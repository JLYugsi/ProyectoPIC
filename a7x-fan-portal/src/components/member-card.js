import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class MemberCard extends LitElement {
  static properties = {
    name: { type: String },
    role: { type: String },
    img: { type: String }
  };

  static styles = [
    unsafeCSS(bootstrapStyles),
    css`
      :host { display: block; text-align: center; }
      .member-img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #dc3545;
        margin-bottom: 1rem;
        transition: transform 0.3s;
      }
      .member-img:hover { transform: scale(1.1); box-shadow: 0 0 15px #dc3545; }
      h4 { color: white; font-weight: bold; margin: 0; }
      small { color: #dc3545; text-transform: uppercase; letter-spacing: 1px; }
      .card { background: transparent; border: none; }
    `
  ];

  render() {
    return html`
      <div class="card">
        <center>
          <img src="${this.img}" class="member-img" alt="${this.name}">
        </center>
        <h4>${this.name}</h4>
        <small>${this.role}</small>
      </div>
    `;
  }
}
customElements.define('member-card', MemberCard);
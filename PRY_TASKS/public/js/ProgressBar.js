// 1. Definimos el template
const template = document.createElement('template');
template.innerHTML = `
    <style>
        .progress-bar-container {
            width: 100%;
            background-color: #343a40;
            border: 1px solid #495057;
            border-radius: .375rem;
            overflow: hidden;
        }
        
        .progress-bar-inner {
            width: 0%; /* Inicia en 0 */
            height: 25px;
            background-color: var(--bs-success, #198754);
            transition: width 0.3s ease;
            text-align: center;
            line-height: 25px;
            color: white;
            font-weight: bold;
        }
    </style>
    
    <div class="progress-bar-container">
        <div class="progress-bar-inner">0%</div>
    </div>
`;

export class ProgressBar extends HTMLElement {
    #innerBar; // (C) Referencia interna privada
    #label;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        // (D) Clonamos el template
        shadow.appendChild(template.content.cloneNode(true));
        
        // (E) Guardamos las referencias a los elementos internos
        this.#innerBar = shadow.querySelector('.progress-bar-inner');
        this.#label = shadow.querySelector('.progress-bar-inner');
    }

    /**
     * (F) API Pública: Este método permite al componente padre
     * (TaskList) actualizar el valor de esta barra.
     * @param {number} value - El valor de progreso (ej. 60)
     */
    setValue(value) {
        const percentage = Math.max(0, Math.min(100, value)); // Asegura entre 0 y 100
        this.#innerBar.style.width = `${percentage}%`;
        this.#label.textContent = `${Math.round(percentage)}%`;
    }
}
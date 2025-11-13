const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host { /* :host se refiere al elemento <task-item> */
            display: block;
        }

        .task-item {
            display: flex;
            align-items: center;
            padding: 0.8rem;
            border-bottom: 1px solid #495057;
        }

        .task-item:last-child {
            border-bottom: none;
        }

        input[type="checkbox"] {
            margin-right: 1rem;
            transform: scale(1.3);
        }

        label {
            flex-grow: 1;
            font-size: 1.1rem;
            cursor: pointer;
        }

        :host([checked]) label { /* (A) Estilo si el <task-item> tiene el atributo 'checked' */
            text-decoration: line-through;
            color: #6c757d;
        }
    </style>
    
    <div class="task-item">
        <input type="checkbox" id="checkbox">
        <label for="checkbox"><slot></slot></label>
    </div>
`;

export class TaskItem extends HTMLElement {
    #checkbox; // Referencia interna

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));

        this.#checkbox = shadow.querySelector('#checkbox');

        // (C) Verificamos si el elemento ya venía 'checked' desde el HTML
        if (this.hasAttribute('checked')) {
            this.#checkbox.checked = true;
            this._reflectAttribute(true);
        }

        // (D) Listener para el cambio en el checkbox
        this.#checkbox.addEventListener('change', () => {
            const isChecked = this.#checkbox.checked;
            this._reflectAttribute(isChecked);

            // (E) ¡La interacción! Disparamos un evento que el padre (TaskList) escuchará
            this.dispatchEvent(new CustomEvent('task-toggled', {
                bubbles: true,
                composed: true,
                detail: { checked: isChecked }
            }));
        });
    }

    // (F) Buena práctica: reflejar el estado en el DOM
    _reflectAttribute(isChecked) {
        if (isChecked) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
        }
    }

    // (G) Propiedad pública para que el padre sepa si está marcado
    get isChecked() {
        return this.hasAttribute('checked');
    }
}
const template = document.createElement('template');
template.innerHTML = `
    <div class="card">
        <div class="card-header">
            <progress-bar value="0"></progress-bar>
        </div>
        <div class="card-body p-0">
            <slot id="task-slot"></slot>
        </div>
    </div>
`;

export class TaskList extends HTMLElement {
    #progressBar;
    #slot;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));

        // (D) Obtenemos la referencia a la barra de progreso DENTRO del Shadow DOM
        this.#progressBar = shadow.querySelector('progress-bar');
        this.#slot = shadow.querySelector('#task-slot');

        // (E) Escuchamos el evento 'task-toggled' que disparan los <task-item>
        this.addEventListener('task-toggled', () => {
            this.updateProgress();
        });

        // (F) Un truco para actualizar el progreso cuando los elementos se cargan
        // por primera vez (los <task-item> del <slot>)
        this.#slot.addEventListener('slotchange', () => {
             this.updateProgress();
        });
    }

    // (G) Método que calcula y actualiza el progreso
    updateProgress() {
        // Obtenemos todos los <task-item> que están en el slot (Light DOM)
        const tasks = this.querySelectorAll('task-item');
        if (tasks.length === 0) {
            this.#progressBar.setValue(0);
            return;
        }

        // Contamos cuántos tienen la propiedad 'isChecked' (que definimos en TaskItem)
        const checkedTasks = Array.from(tasks).filter(task => task.isChecked).length;
        
        const progress = (checkedTasks / tasks.length) * 100;
        
        // (H) Llamamos a la API pública de <progress-bar>
        this.#progressBar.setValue(progress);
    }
}
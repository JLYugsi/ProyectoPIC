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
    #loading = false; // Nueva bandera para evitar guardar mientras se cargan las tareas

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));

        // (D) Obtenemos la referencia a la barra de progreso DENTRO del Shadow DOM
        this.#progressBar = shadow.querySelector('progress-bar');
        this.#slot = shadow.querySelector('#task-slot');

        // (E) Escuchamos el evento 'task-toggled' que disparan los <task-item>
        this.addEventListener('task-toggled', () => {
            if (!this.#loading) { // 🔹 Solo guardar si no se está cargando desde localStorage
                this.updateProgress();
                this.saveTasks();
            }
        });

        // (F) Un truco para actualizar el progreso cuando los elementos se cargan
        // por primera vez (los <task-item> del <slot>)
        this.#slot.addEventListener('slotchange', () => {
            this.updateProgress();
        });
    }

    // (G) Cargar tareas desde localStorage 
    // (Se ejecuta cuando el componente se agrega al DOM)
    connectedCallback() {
        this.loadTasks(); // Cargar tareas guardadas
    }

    // (H) Método que calcula y actualiza el progreso
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
        
        // (I) Llamamos a la API pública de <progress-bar>
        this.#progressBar.setValue(progress);
    }

    // (J) Guarda las tareas en localStorage
    saveTasks() {
        // Creamos un array con el estado de las tareas
        const tasks = Array.from(this.querySelectorAll('task-item')).map(item => ({
            text: item.textContent.trim(), // Guardamos el texto de la tarea
            checked: item.isChecked // Guardamos si está marcada o no
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Guardamos en localStorage
    }

    // (K) Carga las tareas almacenadas al iniciar
    loadTasks() {
        // Obtenemos las tareas almacenadas en localStorage
        const stored = localStorage.getItem('tasks');
        if (stored) { 
            this.#loading = true; // Pausar guardado temporalmente mientras se cargan
            // Borrar tareas existentes para evitar duplicados
            this.querySelectorAll('task-item').forEach(t => t.remove());
            
            const tasks = JSON.parse(stored); 
            tasks.forEach(t => {
                const item = document.createElement('task-item');
                item.textContent = t.text;
                // 🔹 Establecer el estado checked correctamente
                if (t.checked) {
                    item.setAttribute('checked', '');
                    // 🔹 Forzar que el input interno se marque también
                    requestAnimationFrame(() => {
                        const checkbox = item.shadowRoot?.querySelector('#checkbox');
                        if (checkbox) checkbox.checked = true;
                    });
                }
                this.appendChild(item); // Agregamos al TaskList
            });

            this.#loading = false; // Reanudar guardado normal
            this.updateProgress(); // Actualizar la barra de progreso
        }
    }
}

// Evita definir dos veces el mismo componente
if (!customElements.get('task-list')) {
    customElements.define('task-list', TaskList);
}

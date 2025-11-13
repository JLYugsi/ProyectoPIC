/* ==========================================================
   COMPONENTE <task-item>
   ========================================================== */

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
        }

        .task-item {
            display: flex;
            flex-direction: column;
            padding: 0.8rem;
            border-bottom: 1px solid #024a91ff;
        }

        .row-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        input[type="checkbox"] {
            margin-left: 1rem;
            transform: scale(1.3);
        }

        label {
            flex-grow: 1;
            font-size: 1.1rem;
            cursor: pointer;
        }

        :host([checked]) label {
            text-decoration: line-through;
            color: #1068b5ff;
        }

        .actions {
            margin-top: 10px;
        }

        video, img {
            width: 100%;
            margin-top: 12px;
            border-radius: 10px;
            display: none;
        }

    </style>
    
    <div class="task-item">
        <div class="row-head">
            <label for="checkbox"><slot></slot></label>
            <input type="checkbox" id="checkbox">
        </div>

        <div class="actions"></div>

        <!-- contenedor local multimedia -->
        <video id="localVideo" autoplay></video>
        <img id="localImage">
    </div>
`;

export class TaskItem extends HTMLElement {
    #checkbox;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));

        this.#checkbox = shadow.querySelector('#checkbox');
        this.actions = shadow.querySelector(".actions");

        /* Bandera para validar acción completada */
        this.actionCompleted = false;

        /* Elementos multimedia locales */
        this.localVideo = shadow.querySelector("#localVideo");
        this.localImage = shadow.querySelector("#localImage");

        const taskName = this.getAttribute("task");

        /* BOTONES SEGÚN LA TAREA */
        if (taskName === "tarea1") {
            this.actions.innerHTML = `<button class="btn btn-primary btn-sm">Activar cámara</button>`;
        }
        if (taskName === "tarea2") {
            this.actions.innerHTML = `<button class="btn btn-primary btn-sm">Mostrar imagen</button>`;
        }
        if (taskName === "tarea3") {
            this.actions.innerHTML = `<button class="btn btn-primary btn-sm">Cambiar fondo</button>`;
        }
        if (taskName === "tarea4") {
            this.actions.innerHTML = `<button class="btn btn-primary btn-sm">Reproducir sonido</button>`;
        }

        /* EVENTO DEL BOTÓN */
        const actionBtn = this.actions.querySelector("button");
        if (actionBtn) {
            actionBtn.addEventListener("click", () => {

                this.dispatchEvent(new CustomEvent("task-action", {
                    bubbles: true,
                    composed: true,
                    detail: { task: taskName, item: this }
                }));

            });
        }

        /* CHECKBOX — validación */
        this.#checkbox.addEventListener('change', () => {

            // Bloqueo antes de cumplir acción
            if (!this.actionCompleted) {
                this.#checkbox.checked = false;
                alert("Debes ejecutar la acción primero.");
                return;
            }

            const isChecked = this.#checkbox.checked;
            this._reflectAttribute(isChecked);

            this.dispatchEvent(new CustomEvent('task-toggled', {
                bubbles: true,
                composed: true,
                detail: {
                    checked: isChecked,
                    taskName: taskName,
                    item: this
                }
            }));
        });
    }

    /* MOSTRAR VIDEO LOCAL */
    showLocalVideo(stream) {
        this.localVideo.style.display = "block";
        this.localVideo.srcObject = stream;

        this.actionCompleted = true;
        this.setAttribute("checked", "");
    }

    /* MOSTRAR IMAGEN LOCAL */
    showLocalImage(url) {
        this.localImage.style.display = "block";
        this.localImage.src = url;

        this.actionCompleted = true;
        this.setAttribute("checked", "");
    }

    _reflectAttribute(isChecked) {
        if (isChecked) this.setAttribute('checked', '');
        else this.removeAttribute('checked');
    }

    get isChecked() {
        return this.hasAttribute('checked');
    }
}

customElements.define('task-item', TaskItem);


/* ==========================================================
   ADMINISTRADOR DE TAREAS
   ========================================================== */

export class TaskManager {

    constructor(progressSelector) {
        this.progressBar = document.querySelector(progressSelector);

        this.loadState();
        this.setupListeners();
        this.updateProgress();
    }

    /* Inicialización — siempre desde 0 */
    loadState() {
        document.querySelectorAll('task-item').forEach(item => {
            item.removeAttribute("checked");
            item.actionCompleted = false;
        });
    }

    setupListeners() {

        /* Ejecutar acciones */
        document.addEventListener("task-action", async (e) => {

            const task = e.detail.task;
            const item = e.detail.item;

            this.executeTask(task, item);

        });

        /* Checkbox */
        document.addEventListener("task-toggled", (e) => {
            const { checked, taskName } = e.detail;
            localStorage.setItem(taskName, checked ? "true" : "false");
            this.updateProgress();
        });
    }

    /* FUNCIÓN COMPLETA DE ACCIONES */
    executeTask(taskName, item) {

        switch (taskName) {

            case "tarea1":
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        item.showLocalVideo(stream);

                        item.actionCompleted = true;
                        item.setAttribute("checked", "");

                        this.updateProgress();
                    })
                    .catch(() => alert("No se pudo acceder a la cámara"));
                break;

            case "tarea2":
                item.showLocalImage("https://picsum.photos/300");

                item.actionCompleted = true;
                item.setAttribute("checked", "");
                this.updateProgress();
                break;

            case "tarea3":
                document.body.style.backgroundColor = "#0e35d0ff";

                item.actionCompleted = true;
                item.setAttribute("checked", "");
                this.updateProgress();
                break;

            case "tarea4":
                new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();

                item.actionCompleted = true;
                item.setAttribute("checked", "");
                this.updateProgress();
                break;
        }
    }

    /* Barra de progreso */
    updateProgress() {
        const items = document.querySelectorAll("task-item");
        let done = 0;

        items.forEach(i => {
            if (i.isChecked) done++;
        });

        const percent = (done / items.length) * 100;
        this.progressBar.style.width = percent + "%";
        this.progressBar.textContent = Math.round(percent) + "%";
    }
}

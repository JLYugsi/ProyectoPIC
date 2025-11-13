# 🧩 Proyecto PRY_TASKS — Web Components

**Universidad de las Fuerzas Armadas ESPE**  
**Carrera:** Ingeniería en Tecnologías de la Información  
**Asignatura:** Programación Integrativa de Componentes  
**Docente:** Ing. Vilmer Criollo  
**Autores:** Cristopher Lasluisa, Saul Insuasti, Vanessa Ayala, Jorge Yugsi, Christian Vasconez  
**Fecha:** 12 de noviembre de 2025  

---

## 📘 Introducción

El desarrollo web moderno se orienta hacia la modularidad, reutilización y encapsulamiento del código.  
En este contexto, los **Web Components** permiten crear interfaces dinámicas y personalizadas mediante tecnologías como **Custom Elements**, **Shadow DOM**, **ES Modules** y **HTML Templates**.

El presente proyecto tiene como finalidad aplicar estos principios para construir una mini biblioteca de componentes reutilizables que conforman una interfaz de tareas denominada **PRY_TASKS**.

---

## 🎯 Objetivo General

Aplicar los conceptos y especificaciones de los Web Components para desarrollar una **colección modular y funcional de componentes web reutilizables**.

### 🧠 Objetivos Específicos

- Implementar componentes personalizados mediante **Custom Elements**, utilizando **Shadow DOM** y **HTML Templates**.  
- Integrar varios componentes que interactúen entre sí dentro de una interfaz funcional, utilizando **ES Modules** para su modularización y carga dinámica.

---

## ⚙️ Estructura del Proyecto

/proyecto-web-components
│
├── index.html
├── public/
│ ├── js/
│ │ ├── main.js
│ │ ├── TaskItem.js
│ │ ├── TaskList.js
│ │ ├── ProgressBar.js
│ └── vendor/bootstrap/
│ └── css/



### Archivos principales

- **index.html:** Estructura base e importación de los módulos.  
- **main.js:** Punto de entrada que inicializa y conecta los componentes.  
- **TaskItem.js:** Define el componente `<task-item>`.  
- **TaskList.js:** Define el componente `<task-list>`.  
- **ProgressBar.js:** Define el componente `<progress-bar>`.

---

## 🧱 Componentes Personalizados

### 1. `<task-item>`
Representa una tarea individual.  
- Usa **Shadow DOM** para encapsular sus estilos.  
- Emite eventos personalizados al completarse o eliminarse una tarea.  

### 2. `<task-list>`
Contenedor de múltiples tareas.  
- Gestiona la creación, eliminación y actualización de `<task-item>`.  
- Sincroniza el progreso general con `<progress-bar>`.  

### 3. `<progress-bar>`
Muestra el progreso global de tareas completadas.  
- Se actualiza en tiempo real mediante eventos del `<task-list>`.  
- Implementa **Shadow DOM** para estilos aislados.  

### 4. `main.js`
Orquesta el sistema.  
- Importa los tres componentes.  
- Garantiza la comunicación indirecta entre ellos.  

---

## 🔄 Flujo de Interacción

1. El usuario agrega una tarea.  
2. `<task-list>` la inserta como un nuevo `<task-item>`.  
3. Al marcarla como completada, se emite un evento hacia `<task-list>`.  
4. `<task-list>` recalcula el progreso y actualiza `<progress-bar>`.  

Todo el proceso ocurre sin recargar la página.

---

## 💾 Persistencia con LocalStorage

El sistema guarda las tareas y su estado en **LocalStorage**, lo que permite conservar los datos entre sesiones.  
Cada vez que se marca o desmarca una tarea, el componente `<task-list>` actualiza la clave `tasks` en el almacenamiento local.  
Al iniciar la aplicación, se cargan automáticamente las tareas guardadas.

📍 *Para verificar:*  
`F12 → pestaña Application → Local Storage → clave "tasks"`  

---

## ✅ Conclusiones

- Se cumplieron los objetivos del proyecto, demostrando el dominio de **Web Components**.  
- Los componentes creados son **reutilizables, encapsulados y modulares**.  
- La arquitectura facilita la **mantenibilidad y escalabilidad** del sistema.  

---

## 💡 Recomendaciones

- Implementar **IndexedDB** o APIs REST para persistencia avanzada.  
- Añadir nuevos componentes como `<task-filter>` o `<task-summary>`.  
- Mejorar accesibilidad (A11y) con **atributos ARIA**.  
- Documentar la API de cada componente.  
- Implementar **tests automáticos** (Jest o Web Test Runner).  

---

## 📚 Referencias Bibliográficas

- Mozilla Developer Network (MDN). (2024). *Using Web Components*. https://developer.mozilla.org/en-US/docs/Web/Web_Components  
- W3C. (2023). *Custom Elements Specification*. https://www.w3.org/TR/custom-elements/  
- Google Developers. (2024). *Introduction to Shadow DOM*. https://developers.google.com/web/fundamentals/web-components/shadowdom  
- WHATWG. (2023). *HTML Living Standard — Templates and Slots*. https://html.spec.whatwg.org/  

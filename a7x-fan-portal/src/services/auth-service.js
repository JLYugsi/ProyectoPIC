class AuthService {
    constructor() {
        // Leemos si hay un usuario guardado al iniciar la página
        this.user = JSON.parse(sessionStorage.getItem('a7x_user')) || null;
    }

    // Retorna true si hay alguien logueado
    isLoggedIn() {
        return !!this.user;
    }

    // Retorna true solo si el rol es 'admin'
    isAdmin() {
        return this.user && this.user.rol === 'admin';
    }

    // Devuelve los datos del usuario actual
    getUser() {
        return this.user;
    }

    // Guarda el usuario en SessionStorage (se borra al cerrar el navegador)
    login(userData) {
        this.user = userData;
        sessionStorage.setItem('a7x_user', JSON.stringify(userData));
        // Avisamos a toda la app que alguien entró
        window.dispatchEvent(new CustomEvent('auth-changed'));
    }

    // Borra los datos
    logout() {
        this.user = null;
        sessionStorage.removeItem('a7x_user');
        // Avisamos a toda la app que alguien salió
        window.dispatchEvent(new CustomEvent('auth-changed'));
        window.location.href = '/'; // Redirigir al inicio
    }
}

// Exportamos una única instancia (Singleton) para usarla en todos lados
export const auth = new AuthService();
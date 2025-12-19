export class AuthService {
  constructor() {
    this.check();
  }

  // Verificar si hay sesión guardada
  check() {
    this.user = JSON.parse(sessionStorage.getItem('user')) || null;
  }

  // Guardar usuario al hacer login
  login(user) {
    this.user = user;
    sessionStorage.setItem('user', JSON.stringify(user));
    this._notify();
  }

  // Borrar sesión
  logout() {
    this.user = null;
    sessionStorage.removeItem('user');
    window.location.href = '/login'; // Forzamos recarga y viaje al login
  }

  // Obtener datos del usuario
  getUser() {
    this.check(); // Aseguramos tener el dato fresco
    return this.user;
  }

  // ¿Está logueado?
  isLoggedIn() {
    this.check();
    return !!this.user;
  }

  // --- LA SOLUCIÓN CLAVE ---
  isAdmin() {
    this.check();
    if (!this.user) return false;

    // Verificamos AMBOS casos (rol en español o role en inglés)
    const role = this.user.role || this.user.rol;
    
    // Convertimos a minúsculas y quitamos espacios por si acaso
    return role && role.trim().toLowerCase() === 'admin';
  }

  _notify() {
    window.dispatchEvent(new CustomEvent('auth-changed'));
  }
}

export const auth = new AuthService();
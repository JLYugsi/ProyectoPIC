// Referencias a elementos del DOM
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusMessage = document.getElementById('statusMessage');
const loginBtn = document.getElementById('loginBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const logoutSection = document.getElementById('logoutSection');

let stream = null;
let isDetecting = false;
let faceDetected = false;
let detectionInterval = null;

// Verificar si ya está logueado
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
if (isLoggedIn) {
    statusMessage.textContent = 'Ya estás autenticado. Redirigiendo...';
    statusMessage.className = 'status-message success';
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Inicializar la aplicación
async function init() {
    try {
        // Mostrar spinner de carga
        loadingSpinner.classList.add('active');
        statusMessage.textContent = 'Cargando modelos de detección facial...';
        statusMessage.className = 'status-message info';

        // Cargar modelos de face-api.js desde CDN
        const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);

        loadingSpinner.classList.remove('active');
        statusMessage.textContent = 'Modelos cargados. Iniciando cámara...';
        
        // Iniciar cámara
        await startCamera();
        
        // Configurar canvas
        setupCanvas();
        
        // Iniciar detección
        startFaceDetection();
        
    } catch (error) {
        console.error('Error al inicializar:', error);
        statusMessage.textContent = `Error: ${error.message}`;
        statusMessage.className = 'status-message error';
        loadingSpinner.classList.remove('active');
    }
}

// Iniciar la cámara
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });
        
        video.srcObject = stream;
        
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });
    } catch (error) {
        if (error.name === 'NotAllowedError') {
            throw new Error('Permiso de cámara denegado. Por favor, permite el acceso a la cámara.');
        } else if (error.name === 'NotFoundError') {
            throw new Error('No se encontró ninguna cámara.');
        } else {
            throw new Error('Error al acceder a la cámara: ' + error.message);
        }
    }
}

// Configurar el canvas para dibujar las detecciones
function setupCanvas() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
}

// Iniciar la detección de rostros
function startFaceDetection() {
    if (isDetecting) return;
    
    isDetecting = true;
    statusMessage.textContent = 'Posiciona tu rostro frente a la cámara...';
    statusMessage.className = 'status-message info';
    
    // Detectar rostros cada 100ms
    detectionInterval = setInterval(async () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            // Ajustar canvas si el video cambió de tamaño
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                setupCanvas();
            }
            
            // Detectar rostros
            const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks();
            
            // Limpiar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (detections.length > 0) {
                // Dibujar detecciones
                faceapi.draw.drawDetections(canvas, detections);
                faceapi.draw.drawFaceLandmarks(canvas, detections);
                
                // Si detectamos un rostro, habilitar el botón de login
                if (!faceDetected) {
                    faceDetected = true;
                    loginBtn.disabled = false;
                    statusMessage.textContent = '✓ Rostro detectado. Puedes iniciar sesión.';
                    statusMessage.className = 'status-message success';
                }
            } else {
                // Si no hay rostro, deshabilitar el botón
                if (faceDetected) {
                    faceDetected = false;
                    loginBtn.disabled = true;
                    statusMessage.textContent = 'Posiciona tu rostro frente a la cámara...';
                    statusMessage.className = 'status-message info';
                }
            }
        }
    }, 100);
}

// Función de login
function handleLogin() {
    if (!faceDetected) {
        statusMessage.textContent = 'Por favor, asegúrate de que tu rostro esté visible.';
        statusMessage.className = 'status-message error';
        return;
    }
    
    // Guardar estado de login en localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginTime', new Date().toISOString());
    
    // Mostrar mensaje de éxito
    statusMessage.textContent = '✓ Login exitoso! Redirigiendo...';
    statusMessage.className = 'status-message success';
    loginBtn.disabled = true;
    
    // Detener la detección
    stopDetection();
    
    // Redirigir después de 1 segundo
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Detener la detección y liberar recursos
function stopDetection() {
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
    }
    isDetecting = false;
    
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

// Event listener para el botón de login
loginBtn.addEventListener('click', handleLogin);

// Limpiar recursos al cerrar la página
window.addEventListener('beforeunload', stopDetection);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body; 
        
        // Buscar por correo O por nombre
        // Quitamos la validación de estado por ahora para asegurar que entres
        const user = await User.findOne({ 
            $or: [{ correo: identifier }, { nombre: identifier }]
        });

        // Validación de contraseña (TEXTO PLANO como lo tenías)
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // --- AQUÍ ESTÁ LA SOLUCIÓN MÁGICA ---
        // Construimos la respuesta manual para asegurar que el Frontend reciba lo que necesita
        res.json({
            _id: user._id,
            nombre: user.nombre,
            correo: user.correo,
            // TRADUCCIÓN: La base de datos tiene 'rol', el front espera 'role'
            role: user.rol, 
            // Aseguramos que se envíen los favoritos
            favorites: user.favorites || [] 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en servidor' });
    }
});

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        if (nombre.includes(' ')) return res.status(400).json({ message: 'El usuario no puede tener espacios' });
        if (password.length > 16) return res.status(400).json({ message: 'Password muy largo (máx 16)' });
        
        const existing = await User.findOne({ $or: [{ correo }, { nombre }] });
        if (existing) return res.status(400).json({ message: 'Usuario o correo ya registrado' });

        // Guardamos 'rol' en español y password directo
        const newUser = new User({ nombre, correo, password, rol: 'fan', favorites: [] });
        await newUser.save();
        
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar' });
    }
});

export default router;
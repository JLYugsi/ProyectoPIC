import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// LOGIN: Usuario O Correo
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body; // 'identifier' es lo que manda el front
        
        // Buscar por correo O por nombre
        const user = await User.findOne({ 
            $or: [{ correo: identifier }, { nombre: identifier }],
            estado: 'activo'
        });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const { password: _, ...userData } = user.toObject();
        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Error en servidor' });
    }
});

// REGISTER: Validaciones estrictas
router.post('/register', async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        // Validaciones Backend (Segunda capa de seguridad)
        if (nombre.includes(' ')) return res.status(400).json({ message: 'El usuario no puede tener espacios' });
        if (password.length > 16) return res.status(400).json({ message: 'Password muy largo (máx 16)' });
        
        // Verificar duplicados
        const existing = await User.findOne({ $or: [{ correo }, { nombre }] });
        if (existing) return res.status(400).json({ message: 'Usuario o correo ya registrado' });

        const newUser = new User({ nombre, correo, password, rol: 'fan' });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar' });
    }
});

export default router;
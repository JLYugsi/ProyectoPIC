import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// GET Todos (Para lista de usuarios si la implementas)
router.get('/', async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});

// DELETE (Eliminar cuenta propia o por Admin)
router.delete('/:id', async (req, res) => {
    try {
        // En un entorno real aquí validaríamos el token JWT para ver si es admin o el mismo usuario
        // Por ahora confiamos en el ID enviado
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
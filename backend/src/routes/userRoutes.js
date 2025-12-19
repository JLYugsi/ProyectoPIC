import { Router } from 'express';
import User from '../models/User.js';
import Album from '../models/Album.js';

const router = Router();

// GET ALL (Para tu panel de admin)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE USER
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CHANGE ROLE
router.put('/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        // Mapeamos 'role' (front) a 'rol' (base de datos)
        const user = await User.findByIdAndUpdate(req.params.id, { rol: role }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- AQUÍ ESTÁ LA SOLUCIÓN DE FAVORITOS ---

// 1. OBTENER FAVORITOS (GET)
router.get('/:id/favorites', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (!user.favorites || user.favorites.length === 0) {
            return res.json([]);
        }

        // "Hidratamos" los favoritos buscando la info del álbum
        const enrichedFavorites = await Promise.all(user.favorites.map(async (fav) => {
            try {
                // Buscamos el álbum
                const album = await Album.findById(fav.albumId);
                
                // Si el álbum fue borrado de la DB, devolvemos null
                if (!album) return null; 
                
                return {
                    songTitle: fav.songTitle, 
                    albumId: fav.albumId,
                    albumTitle: album.title, 
                    albumCover: album.cover, 
                    albumYear: album.year,
                    // Devolvemos el timestamp original si existe, o el actual
                    addedAt: fav._id ? fav._id.getTimestamp() : new Date() 
                };
            } catch (err) {
                return null;
            }
        }));

        // Filtramos los nulos y respondemos
        const cleanList = enrichedFavorites.filter(f => f !== null);
        res.json(cleanList);

    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
});

// 2. GUARDAR/BORRAR FAVORITO (PUT)
router.put('/:id/favorites', async (req, res) => {
    const { albumId, songTitle } = req.body;
    const userId = req.params.id;
    
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Inicializar array si no existe
        if (!Array.isArray(user.favorites)) user.favorites = [];

        // --- CORRECCIÓN CRÍTICA ---
        // Usamos .toString() para comparar Texto con ObjectID de forma segura
        const existingIndex = user.favorites.findIndex(f => 
            f.songTitle === songTitle && 
            f.albumId.toString() === albumId.toString()
        );
        
        let action = '';

        if (existingIndex > -1) {
            // Si existe, BORRAR
            user.favorites.splice(existingIndex, 1);
            action = 'removed';
        } else {
            // Si no existe, AGREGAR
            user.favorites.push({ albumId, songTitle });
            action = 'added';
        }

        await user.save();

        // Respondemos con la lista actualizada y la acción realizada
        res.json({ 
            message: action === 'added' ? 'Añadido a favoritos' : 'Eliminado de favoritos', 
            favorites: user.favorites, 
            active: action === 'added' 
        });

    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: error.message }); 
    }
});

export default router;
import { Router } from 'express';
import Album from '../models/Album.js';

const router = Router();

// --- ESTA ES LA QUE FALTABA (GET ALL) ---
router.get('/', async (req, res) => {
    try {
        const albums = await Album.find();
        res.json(albums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/albums/:id (Buscar uno solo)
router.get('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) return res.status(404).json({ message: 'Album no encontrado' });
        res.json(album);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newAlbum = new Album(req.body);
        await newAlbum.save();
        res.json(newAlbum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Album.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Album actualizado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Album.findByIdAndDelete(req.params.id);
        res.json({ message: 'Album borrado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
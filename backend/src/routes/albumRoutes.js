import { Router } from 'express';
import Album from '../models/Album.js';

const router = Router();

router.get('/', async (req, res) => {
    const albums = await Album.find();
    res.json(albums);
});

router.post('/', async (req, res) => {
    const newAlbum = new Album(req.body);
    await newAlbum.save();
    res.json(newAlbum);
});

router.put('/:id', async (req, res) => {
    await Album.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Album actualizado' });
});

router.delete('/:id', async (req, res) => {
    await Album.findByIdAndDelete(req.params.id);
    res.json({ message: 'Album borrado' });
});

export default router;
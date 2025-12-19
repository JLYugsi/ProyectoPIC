import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    cover: { type: String, required: true },
    desc: { type: String },
    songs: { type: String },
    spotifyUrl: { type: String }, // URL para el iframe (ej: https://open.spotify.com/embed/album/...)
    audioPreview: { type: String } // URL del MP3 del hit (ej: /public/audio/nightmare_preview.mp3)
}, {
    versionKey: false
});

export default mongoose.model('Album', albumSchema);
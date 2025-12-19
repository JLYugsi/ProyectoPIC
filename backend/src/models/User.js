import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Texto plano
    
    // Usamos 'rol' en español para no romper tu base de datos actual
    rol: { 
        type: String, 
        default: 'fan',
        enum: ['fan', 'admin'] // Validamos que sea uno de estos dos
    },
    
    estado: { type: String, default: 'activo' }, // Por si acaso lo usas
    
    // Lista de favoritos
    favorites: [{
        albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
        songTitle: { type: String }
    }]
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model('User', userSchema);
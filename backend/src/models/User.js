import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { 
        type: String, 
        required: true, 
        enum: ['admin', 'fan'], 
        default: 'fan'
    },
    estado: { 
        type: String, 
        enum: ['activo', 'inactivo'], 
        default: 'activo'
    },
    favorites: [{ type: String }] // Array de IDs de canciones o nombres
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('User', userSchema);
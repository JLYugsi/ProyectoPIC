// backend/src/database.js
import mongoose from 'mongoose';

const URI = 'mongodb://127.0.0.1:27017/a7x_db'; // Nombre de tu DB

export const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log('🔥 Base de Datos conectada: a7x_db');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1); // Detener app si no hay DB
    }
};
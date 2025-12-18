import express from 'express';
import cors from 'cors';
import { connectDB } from './database.js';

import userRoutes from './routes/userRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = 3000;

// 1. Middlewares
app.use(cors()); // Permite que Vite (puerto 5173) haga peticiones aquí
app.use(express.json()); // Permite recibir JSON en los POST/PUT

// 2. Conexión DB
connectDB();

// 3. Rutas
app.use('/api/users', userRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/auth', authRoutes);

// 4. Iniciar Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`);
});
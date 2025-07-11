import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import roupasRoutes from './routes/roupas.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import comprasRoutes from './routes/compras.routes.js';
import lojasRoutes from './routes/lojas.routes.js';

dotenv.config();

import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/roupas', roupasRoutes);
app.use('/clientes', clientesRoutes);
app.use('/compras', comprasRoutes);
app.use('/lojas', lojasRoutes);

app.listen(3001, () => console.log('🚀 API rodando na porta 3001'));
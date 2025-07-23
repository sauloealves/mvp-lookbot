import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import roupasRoutes from './routes/roupas.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import lojasRoutes from './routes/lojas.routes.js';
import vendasRoutes from './routes/vendas.routes.js';


dotenv.config();

import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/roupas', roupasRoutes);
app.use('/clientes', clientesRoutes);
app.use('/vendas', vendasRoutes);
app.use('/lojas', lojasRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
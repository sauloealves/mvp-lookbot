import express from 'express';
import prisma from '../prisma/client.js';
import autenticar from '../middlewares/auth.js';

const router = express.Router();

router.post('/', autenticar, async (req, res) => {
  try {
    const cliente = await prisma.cliente.create({
      data: { ...req.body, loja_id: req.lojaId }
    });
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
  }
});

export default router;

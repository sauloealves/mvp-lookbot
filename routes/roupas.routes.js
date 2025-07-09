import express from 'express';
import prisma from '../prisma/client.js';
import autenticar from '../middlewares/auth.js';

const router = express.Router();

router.get('/', autenticar, async (req, res) => {
  const roupas = await prisma.roupa.findMany({ where: { loja_id: req.lojaId, ativo: true } });
  res.json(roupas);
});

router.post('/', autenticar, async (req, res) => {
  const roupa = await prisma.roupa.create({ data: { ...req.body, loja_id: req.lojaId } });
  res.json(roupa);
});

export default router;
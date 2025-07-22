import express from 'express';
import prisma from '../prisma/client.js';
import autenticar from '../middlewares/auth.js';

const router = express.Router();

router.post('/', autenticar, async (req, res) => {
  const { nome, telefone, endereco } = req.body;
  const cliente = await prisma.cliente.create({
    data: { nome, telefone, endereco, loja_id: req.lojaId },
  });
  res.status(201).json(cliente);
});

router.get('/', autenticar, async (req, res) => {
  const { search } = req.query;
  const clientes = await prisma.cliente.findMany({
    where: {
      loja_id: req.lojaId,
      nome: {
        contains: search,
        mode: 'insensitive'
      }
    }
  });
  res.json(clientes);
});

router.put('/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, endereco } = req.body;

  const cliente = await prisma.cliente.updateMany({
    where: { id, loja_id: req.lojaId },
    data: { nome, telefone, endereco },
  });

  if (cliente.count === 0) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }

  res.json({ sucesso: true });
});

router.delete('/:id', autenticar, async (req, res) => {
  const { id } = req.params;

  const cliente = await prisma.cliente.deleteMany({
    where: { id, loja_id: req.lojaId },
  });

  if (cliente.count === 0) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }

  res.json({ sucesso: true });
});

export default router;

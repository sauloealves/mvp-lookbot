import express from 'express';
import prisma from '../prisma/client.js';
import autenticar from '../middlewares/auth.js';

const router = express.Router();

router.post('/', autenticar, async (req, res) => {
  try {
    const { cliente_id, itens } = req.body;
    const total = itens.reduce(
      (soma, item) => soma + item.valor_unitario * item.quantidade,
      0
    );

    const compra = await prisma.compra.create({
      data: {
        loja_id: req.lojaId,
        cliente_id,
        total,
        data: new Date(),
        compra_itens: {
          create: itens.map(i => ({
            roupa_id: i.roupa_id,
            quantidade: i.quantidade,
            valor_unitario: i.valor_unitario,
            valor_total: i.valor_unitario * i.quantidade,
          }))
        }
      },
      include: { compra_itens: true }
    });

    res.json(compra);
  } catch (error) {
    console.error('Erro ao registrar compra:', error);
    res.status(500).json({ erro: 'Erro ao registrar compra' });
  }
});

export default router;

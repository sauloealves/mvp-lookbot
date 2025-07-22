import express from 'express';
import prisma from '../prisma/client.js';
import autenticar from '../middlewares/auth.js';

const router = express.Router();

router.post('/', autenticar, async (req, res) => {
  try {
    const { cliente_id, data, itens } = req.body;

    if (!cliente_id || !data || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    const venda = await prisma.venda.create({
      data: {
        loja_id: req.lojaId,
        cliente_id,        
        data: new Date(data),
        itens: {
          create: itens.map(i => ({
            roupa_id: i.roupa_id,
            quantidade: i.quantidade,
            valor_unitario: i.valor_unitario,
            desconto_aplicado: i.desconto_aplicado || 0,
            tipo: i.tipo == 'venda' ? 1 : 0
          }))
        }
      },
      include: {
        itens: true
      }
    });

    res.json(venda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao registrar venda' });
  }
});


router.get('/', autenticar, async (req, res) => {
  const vendas = await prisma.venda.findMany({
    where: { loja_id: req.lojaId },
    include: {
      cliente: true,
      itens: {
        include: {
          roupa: { include: { imagens: true } }
        }
      }
    },
    orderBy: { data: 'desc' }
  });
  res.json(vendas);
});

router.get('/cliente/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  const vendas = await prisma.venda.findMany({
    where: { loja_id: req.lojaId, cliente_id: id },
    include: {
      cliente: true,
      itens: {
        include: {
          roupa: { include: { imagens: true } }
        }
      }
    },
    orderBy: { data: 'desc' }
  });
  res.json(vendas);
});

export default router;

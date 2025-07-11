import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma/client.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { nome, email, senha, loja_id, is_admin } = req.body;

    if (!nome || !email || !senha || !loja_id) {
      return res.status(400).json({ erro: 'Campos obrigatórios ausentes' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha_hash: senhaHash,
        is_admin: !!is_admin,
        loja_id
      }
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
});

export default router;

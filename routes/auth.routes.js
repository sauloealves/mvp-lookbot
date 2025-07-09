import { PrismaClient } from '../generated/prisma/client.js'; 
import express from 'express';
const prisma = new PrismaClient();
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';




router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) return res.status(401).json({ erro: 'Usuário não encontrado' });
  const valid = await bcrypt.compare(senha, usuario.senha_hash);
  if (!valid) return res.status(401).json({ erro: 'Senha inválida' });
  const token = jwt.sign({ id: usuario.id, lojaId: usuario.loja_id }, process.env.JWT_SECRET);
  res.json({ token });
});

router.post('/register-loja', async (req, res) => {
  const { nomeLoja, nomeUsuario, email, senha } = req.body;
  const senha_hash = await bcrypt.hash(senha, 10);
  const loja = await prisma.loja.create({
    data: {
      nome: nomeLoja,
      usuarios: {
        create: {
          nome: nomeUsuario,
          email,
          senha_hash,
          is_admin: true,
        },
      },
    },
    include: { usuarios: true },
  });
  res.json({ mensagem: 'Loja e usuário criados!', loja });
});

export default router;
import { PrismaClient } from '../generated/prisma/client.js'; 
import express from 'express';
const prisma = new PrismaClient();
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';




router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const mensagem = 'Usuário não encontrado ou senha inválida';
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) 
    return res.status(401).json({ erro: mensagem });

  const valid = await bcrypt.compare(senha, usuario.senha_hash);
  
  if (!valid) 
    return res.status(401).json({ erro: mensagem });

  const token = jwt.sign({ id: usuario.id, lojaId: usuario.loja_id, is_admin: usuario.is_admin }, process.env.JWT_SECRET);
  const loja = await prisma.loja.findUnique({
    where: { id: usuario.loja_id },
  });

  res.json({ token, loja_logo: loja.logo_url, loja_nome: loja.nome });
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
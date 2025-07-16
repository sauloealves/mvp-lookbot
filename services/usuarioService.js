import prisma from '../prisma/client.js';
import bcrypt from 'bcrypt';

export async function criarUsuario({ nome, email, senha, loja_id, is_admin }) {
  const senhaHash = await bcrypt.hash(senha, 10);
  return prisma.usuario.create({
    data: { nome, email, senha_hash: senhaHash, loja_id, is_admin }
  });
}

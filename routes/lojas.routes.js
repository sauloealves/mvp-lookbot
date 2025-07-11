import express from 'express';
import prisma from '../prisma/client.js';
import multer from 'multer';
import axios from 'axios';
import { criarUsuario } from '../services/usuarioService.js';

const router = express.Router();
const upload = multer();

router.post('/', upload.single('logo'), async (req, res) => {
  const { nome, email, senha } = req.body;
  const file = req.file;

  let logoUrl = null;
    if (file) {
      logoUrl = await uploadToImgBB(file.buffer);
    }

  try {
    const loja = await prisma.loja.create({
      data: {
        nome,
        logo_url: logoUrl,
        ativo: false, 
      }
    });

    try {
      await criarUsuario({
        nome: `admin_${nome.replace(/\s+/g, '_').toLowerCase()}`,
        email,
        senha,
        loja_id: loja.id,
        is_admin: true
      });

      return res.status(201).json({ mensagem: 'Loja e usuário admin criados com sucesso!' });

    } catch (erroUsuario) {
      console.error('Erro ao criar usuário admin:', erroUsuario);
      return res.status(201).json({
        mensagem: '⚠ Loja criada com sucesso, mas houve erro ao criar o usuário. Contate o suporte.',
        loja
      });
    }


  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar loja' });
  }
});

async function uploadToImgBB(fileBuffer) {
  const formData = new URLSearchParams();
  const base64 = fileBuffer.toString('base64');
  formData.append('image', base64);

  const response = await axios.post(
    'https://api.imgbb.com/1/upload?key=' + process.env.IMGBB_API_KEY,
    formData
  );
  return response.data.data.url;
}

export default router;
import express from 'express';
import prisma from '../prisma/client.js';
import autenticar from '../middlewares/auth.js';
import multer from 'multer';
import axios from 'axios';

const router = express.Router();
const upload = multer();

router.get('/', autenticar, async (req, res) => {
  const roupas = await prisma.roupa.findMany({ where: { loja_id: req.lojaId, ativo: true }, include: { imagens: true } });
  res.json(roupas);
});

router.post('/', autenticar, upload.array('imagens'), async (req, res) => {
  try {
    const { descricao_curta, cores_predominantes, tom_de_pele, estilo, valor } = req.body;

    const coresArray = typeof cores_predominantes === 'string' ? cores_predominantes.split(',').map(c => c.trim()).filter(Boolean): [];
    
    const imagens = await uploadImagesToImgbb(req.files);

    const roupa = await prisma.roupa.create({
      data: {
        descricao_curta,
        cores_predominantes: coresArray,
        tom_de_pele,
        estilo,
        valor: parseFloat(valor),
        loja_id: req.lojaId,
        ativo: true,
        imagens: {
          create: imagens.map(url => ({ url }))
        }
      },
      include: { imagens: true }
    });

    res.json(roupa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar roupa' });
  }
});

router.put('/:id', autenticar, upload.array('imagens'), async (req, res) => {
  try {
    const id = req.params.id;

    const { descricao_curta, cores_predominantes, tom_de_pele, estilo, valor } = req.body;
    const coresArray = typeof cores_predominantes === 'string' ? cores_predominantes.split(',').map(c => c.trim()).filter(Boolean): [];
    const imagens = await uploadImagesToImgbb(req.files);

    const roupaAtualizada = await prisma.roupa.update({
      where: { id },
      data: {
        descricao_curta,
        cores_predominantes: coresArray,
        tom_de_pele,
        estilo,
        valor: parseFloat(valor),
        imagens: {
          create: imagens.map(url => ({ url }))
        }
      }
    });
    res.json(roupaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao editar roupa' });
  }
});

const uploadImagesToImgbb = async (files) => {
  const results = [];
  for (const file of files) {
    const base64 = file.buffer.toString('base64');
    const formData = new URLSearchParams();
    formData.append('image', base64);

    const res = await axios.post(
      `${process.env.IMG_BB_URL}/upload?key=${process.env.IMGBB_API_KEY}`,
      formData
    );
    results.push(res.data.data.url);
  }
  return results;
};


export default router;
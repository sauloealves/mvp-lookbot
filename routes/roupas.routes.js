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

router.post('/ia/descricao', upload.single('image'), async (req, res) => {
  try {
    const imageUrls = await uploadImagesToImgbb([req.file]);
    const imageUrl = imageUrls[0];

    const prompt = `Descrição bem curta, maximo 10 palavras, objetiva e atrativa para cadastro em loja: ${imageUrl}`;

    const iaResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [
          { role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: imageUrl } }] }
        ],
        max_tokens: 100
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const descricao = iaResponse.data.choices?.[0]?.message?.content?.trim();
    res.json({ descricao });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao gerar descrição com IA' });
  }
});



export default router;
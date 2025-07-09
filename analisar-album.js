require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ALBUM_URL = process.env.ALBUM_URL;

// 🔍 Função para extrair URLs de imagens públicas do álbum
async function extrairLinksDoAlbum(url) {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const links = [];

    $('#list-most-recent img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.startsWith('https://i.ibb.co/')) {
        links.push(src);
      }
    });

    return [...new Set(links)];
  } catch (err) {
    console.error("❌ Erro ao extrair imagens:", err.message);
    return [];
  }
}

// 🤖 Envia imagem para o GPT-4 e retorna a análise
async function analisarImagem(url) {
  const prompt = `Analise a imagem de uma peça de roupa e responda em JSON com os seguintes campos:
- descricao_curta
- cores_predominantes (array)
- tom_de_pele_recomendado (claro, médio, escuro ou neutro)
- estilo (casual, festa, esportivo, social, etc)

A resposta deve ser APENAS o JSON, sem comentários nem marcações de código.`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url } }
            ]
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;

    // Limpa blocos de markdown (```json ... ```)
    const jsonLimpo = content
      .replace(/```json/i, '')
      .replace(/```/g, '')
      .trim();

    const dados = JSON.parse(jsonLimpo);
    dados.url = url;

    console.log(`✅ Analisado: ${url}`);
    return dados;
  } catch (err) {
    console.error(`❌ Erro na imagem ${url}:`, err.response?.data || err.message);
    return null;
  }
}

// 🚀 Execução principal
(async () => {
  const links = await extrairLinksDoAlbum(ALBUM_URL);
  console.log(`🔗 ${links.length} imagens encontradas.\n`);

  const analises = [];

  for (const url of links) {
    const resultado = await analisarImagem(url);
    if (resultado) {
      analises.push(resultado);
    }
  }

  // Salvar no arquivo JSON
  fs.writeFileSync('lista-roupas.json', JSON.stringify(analises, null, 2), 'utf-8');
  console.log('\n📁 Arquivo "lista-roupas.json" salvo com sucesso!');
})();

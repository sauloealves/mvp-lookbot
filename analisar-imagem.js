require('dotenv').config();
const axios = require('axios');

// 👉 Substitua por suas URLs do ImgBB
const imagens = [
  'https://i.ibb.co/example1.jpg',
  'https://i.ibb.co/example2.jpg',
  'https://i.ibb.co/example3.jpg'
];

// Função principal
async function analisarImagem(url) {
  try {
    const prompt = `Analise a imagem de uma peça de roupa e responda em formato JSON com os seguintes campos:
- descricao_curta (máx 1 frase)
- cores_predominantes (array de cores)
- tom_de_pele_recomendado (claro, médio, escuro ou neutro)
- estilo (casual, festa, esportivo, social, etc)

Seja objetivo e preciso.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: { url }
              }
            ]
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    console.log(`🖼️ Análise da imagem:\nURL: ${url}\n${content}\n`);
  } catch (err) {
    console.error(`❌ Erro na imagem ${url}:`, err.response?.data || err.message);
  }
}

// Executa análise para todas as imagens
(async () => {
  for (const url of imagens) {
    await analisarImagem(url);
  }
})();

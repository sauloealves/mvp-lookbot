require('dotenv').config();
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
let roupas = require('./lista-roupas.json');

// Adiciona valor unitário às roupas
roupas = roupas.map((r, i) => ({
  ...r,
  valor: (149.90 + (i * 10)).toFixed(2) // exemplo de preço incremental
}));

const app = express();
app.use(express.urlencoded({ extended: true }));

const estados = {}; // estado do fluxo por número
const carrinhos = {}; // carrinho de compras por número
let clientes = {}; // cadastro de clientes por número
let historicoCompras = {}; // histórico de compras por número

// Carregar dados se existirem
if (fs.existsSync('./clientes.json')) {
  clientes = JSON.parse(fs.readFileSync('./clientes.json'));
}
if (fs.existsSync('./compras.json')) {
  historicoCompras = JSON.parse(fs.readFileSync('./compras.json'));
}

app.post('/webhook', async (req, res) => {
  const from = req.body.From;
  const msg = req.body.Body?.trim();
  const mediaUrl = req.body.MediaUrl0;
  const contentType = req.body.MediaContentType0;

  // Saudação personalizada
  if (!estados[from]) {
    estados[from] = 'menu';
    carrinhos[from] = [];
    const nome = clientes[from]?.nome;
    const saudacao = nome ? `👋 Olá, ${nome}!` : `👋 Olá!`;
    return res.send(`
      <Response>
        <Message>
${saudacao} Sou seu assistente de moda.

Como você deseja buscar sugestões de look hoje?

1️⃣ Enviar uma foto do seu estilo ou corpo
2️⃣ Descrever o tipo de look que deseja (ex: "casual para trabalho")  
3️⃣ Ver sugestões prontas baseados nas minhas compras
4️⃣ Ver historico de compras
--------------------------------
Digite o número da opção desejada.
        </Message>
      </Response>
    `);
  }

  if (msg.toLowerCase() === 'menu') {
    estados[from] = undefined;
    return res.redirect(307, '/webhook');
  }

  if (msg.toLowerCase() === 'compras' || msg === '4' || msg.toLowerCase() === 'historico') {
    const lista = historicoCompras[from];
    if (!lista || lista.length === 0) {
      return res.send(`<Response><Message>📦 Você ainda não realizou nenhuma compra.</Message></Response>`);
    }
    
    if (lista.length === 0) return res.send(`<Response><Message>📦 Nenhuma compra encontrada.</Message></Response>`);
    let historico = `📋 Histórico de compras:\n\n`;
    lista.forEach((compra, i) => {
      historico += `🗓 Compra ${i + 1} - ${compra.data} - Total: R$ ${compra.total}\n`;
      compra.itens.forEach((item, j) => {
        historico += `${j + 1}. ${item.descricao_curta} - R$ ${item.valor}\n`;
      });
      historico += `------------------------\n`;
    });

    return res.send(`<Response><Message>${historico}</Message></Response>`);
  }

  if (msg.toLowerCase() === 'finalizar') {
    const carrinho = carrinhos[from] || [];
    if (carrinho.length === 0) {
      return res.send(`<Response><Message>🛒 Seu carrinho está vazio.</Message></Response>`);
    }

    if (!clientes[from]) {
      estados[from] = 'aguardando_nome';
      return res.send(`<Response><Message>📝 Antes de finalizar, informe seu nome completo:</Message></Response>`);
    } else {
      const hora = new Date().getHours();
      let entrega = hora < 16
        ? '🚚 Um motoboy fará a entrega ainda hoje!'
        : '🚚 Sua entrega será feita amanhã até as 12h.';

      let total = carrinho.reduce((soma, item) => soma + parseFloat(item.valor), 0);

      // salvar histórico
      const novaCompra = {
        data: new Date().toLocaleDateString('pt-BR'),
        total,
        itens: carrinho
      };
      if (!historicoCompras[from]) historicoCompras[from] = [];
      historicoCompras[from].push(novaCompra);
      fs.writeFileSync('./compras.json', JSON.stringify(historicoCompras, null, 2));

      carrinhos[from] = [];

      return res.send(`<Response><Message>🎉 Pedido finalizado com sucesso!

Cliente: ${clientes[from].nome}
Endereço: ${clientes[from].endereco}
Total: R$ ${total.toFixed(2)}

${entrega}</Message></Response>`);
    }
  }

  if (estados[from] === 'aguardando_nome') {
    clientes[from] = { nome: msg };
    estados[from] = 'aguardando_endereco';
    return res.send(`<Response><Message>🏠 Agora informe seu endereço completo para entrega:</Message></Response>`);
  }

  if (estados[from] === 'aguardando_endereco') {
    clientes[from].endereco = msg;
    estados[from] = 'menu';
    fs.writeFileSync('./clientes.json', JSON.stringify(clientes, null, 2));

    const carrinho = carrinhos[from] || [];
    const hora = new Date().getHours();
    let entrega = hora < 16
      ? '🚚 Um motoboy fará a entrega ainda hoje!'
      : '🚚 Sua entrega será feita amanhã até as 12h.';

    let total = carrinho.reduce((soma, item) => soma + parseFloat(item.valor), 0);

    // salvar histórico
    const novaCompra = {
      data: new Date().toLocaleDateString('pt-BR'),
      total,
      itens: carrinho
    };
    if (!historicoCompras[from]) historicoCompras[from] = [];
    historicoCompras[from].push(novaCompra);
    fs.writeFileSync('./compras.json', JSON.stringify(historicoCompras, null, 2));

    carrinhos[from] = [];

    return res.send(`<Response><Message>🎉 Pedido finalizado com sucesso!

      Cliente: ${clientes[from].nome}
      Endereço: ${clientes[from].endereco}
      Total: R$ ${total.toFixed(2)}

      ${entrega}</Message></Response>`);
  }

  if (msg === 'carrinho') {
    const carrinho = carrinhos[from] || [];
    if (carrinho.length === 0) {
      return res.send(`<Response><Message>🛒 Seu carrinho está vazio.</Message></Response>`);
    }
    let resposta = `<Response><Message>🛒 Seu carrinho atual. Digite "finalizar" para concluir sua compra.</Message>`;
    carrinho.forEach((item, i) => {
      const safeUrl = item.url.replace(/&/g, '&amp;');
      resposta += `
      <Message>
${i + 1}. ${item.descricao_curta}
👗 Estilo: ${item.estilo}
🎨 Cores: ${item.cores_predominantes.join(', ')}
💵 Valor: R$ ${item.valor}
<Media>${safeUrl}</Media>
      </Message>`;
    });
    let total = carrinho.reduce((soma, item) => soma + parseFloat(item.valor), 0);
    resposta += `<Message>💰 Total: R$ ${total.toFixed(2)}</Message></Response>`;
    return res.send(resposta);
  }

  if (msg.startsWith('add ')) {
    const index = parseInt(msg.split(' ')[1]) - 1;
    const sugestaoAtual = estados[from + '_ultimasSugestoes'];
    if (sugestaoAtual && sugestaoAtual[index]) {
      carrinhos[from].push(sugestaoAtual[index]);
      return res.send(`<Response><Message>✅ Adicionado ao carrinho: ${sugestaoAtual[index].descricao_curta}</Message></Response>`);
    } else {
      return res.send(`<Response><Message>❌ Não encontrei essa sugestão para adicionar.</Message></Response>`);
    }
  }

  if (estados[from] === 'menu') {
    if (msg === '1') {
      estados[from] = 'aguardando_foto';
      return res.send(`<Response><Message>📸 Envie sua foto para que eu analise seu estilo.</Message></Response>`);
    } else if (msg === '2') {
      estados[from] = 'aguardando_texto';
      return res.send(`<Response><Message>📝 Descreva o tipo de look que você procura (ex: casual, elegante, para festa...)</Message></Response>`);
    } else if (msg === '3') {
      estados[from] = 'menu';
      const populares = roupas.slice(0, 3);
      estados[from + '_ultimasSugestoes'] = populares;
      let resposta = `<Response><Message>👗 Aqui vão 3 sugestões populares. Digite "add 1", "add 2" etc para adicionar ao carrinho.</Message>`;
      populares.forEach((r, i) => {
        const safeUrl = r.url.replace(/&/g, '&amp;');
        resposta += `
        <Message>
${i + 1}. ${r.descricao_curta}
👗 Estilo: ${r.estilo}
🎨 Cores: ${r.cores_predominantes.join(', ')}
🧑 Tom de pele: ${r.tom_de_pele_recomendado}
💵 Valor: R$ ${r.valor}
<Media>${safeUrl}</Media>
        </Message>`;
      });
      resposta += `</Response>`;
      return res.send(resposta);
    } else {
      return res.send(`<Response><Message>❌ Opção inválida. Digite 1, 2 ou 3.</Message></Response>`);
    }
  }

  if (estados[from] === 'aguardando_foto' && mediaUrl && contentType.startsWith('image')) {
    estados[from] = 'menu';

    const visionResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analise a imagem e descreva o estilo predominante de roupa que a pessoa ou look apresenta, incluindo o tipo de peça, cor e ocasião (casual, festa, elegante, etc)." },
              { type: "image_url", image_url: { url: mediaUrl } }
            ]
          }
        ],
        max_tokens: 300
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const descricao = visionResponse.data.choices[0].message.content;
    const sugeridas = encontrarRoupasPorTexto(descricao);
    estados[from + '_ultimasSugestoes'] = sugeridas;

    let resposta = `<Response><Message>✅ Sugestões com base na imagem enviada. Digite "add 1", "add 2" etc para adicionar ao carrinho.</Message>`;
    sugeridas.forEach((r, i) => {
      const safeUrl = r.url.replace(/&/g, '&amp;');
      resposta += `
      <Message>
${i + 1}. ${r.descricao_curta}
👗 Estilo: ${r.estilo}
🎨 Cores: ${r.cores_predominantes.join(', ')}
🧑 Tom de pele: ${r.tom_de_pele_recomendado}
💵 Valor: R$ ${r.valor}
<Media>${safeUrl}</Media>
      </Message>`;
    });
    resposta += `</Response>`;
    return res.send(resposta);
  }

  if (estados[from] === 'aguardando_texto' && msg) {
    estados[from] = 'menu';

    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: `A pessoa descreveu assim: "${msg}". Quais looks você recomenda? Liste 2 ou 3 sugestões com estilo, peças e cores.`
          }
        ],
        max_tokens: 300
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const sugestao = gptResponse.data.choices[0].message.content;
    const sugeridas = encontrarRoupasPorTexto(sugestao);
    estados[from + '_ultimasSugestoes'] = sugeridas;

    let resposta = `<Response><Message>✅ Sugestões com base na sua descrição. Digite "add 1", "add 2" etc para adicionar ao carrinho.</Message>`;
    sugeridas.forEach((r, i) => {
      const safeUrl = r.url.replace(/&/g, '&amp;');
      resposta += `
      <Message>
${i + 1}. ${r.descricao_curta}
👗 Estilo: ${r.estilo}
🎨 Cores: ${r.cores_predominantes.join(', ')}
🧑 Tom de pele: ${r.tom_de_pele_recomendado}
💵 Valor: R$ ${r.valor}
<Media>${safeUrl}</Media>
      </Message>`;
    });
    resposta += `</Response>`;
    return res.send(resposta);
  }

  return res.send(`<Response><Message>❓ Não entendi. Digite 'menu' para recomeçar, 'carrinho' para ver suas escolhas ou 'finalizar' para concluir o pedido.</Message></Response>`);
});

function encontrarRoupasPorTexto(texto) {
  const palavras = texto.toLowerCase();
  return roupas.filter(r =>
    (r.descricao_curta && palavras.includes(r.descricao_curta.toLowerCase())) ||
    (r.estilo && palavras.includes(r.estilo.toLowerCase())) ||
    (r.tom_de_pele_recomendado && palavras.includes(r.tom_de_pele_recomendado.toLowerCase()))
  ).slice(0, 3);
}

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`);
});

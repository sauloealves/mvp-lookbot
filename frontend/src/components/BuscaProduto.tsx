import { getUrl } from '@/services/api';
import { useEffect, useState } from 'react';

interface Produto {
  id: string;
  descricao_curta: string;
  imagens?: { url: string }[];
  valor: number;
}

export default function BuscarProduto({ onSelecionar }: { onSelecionar: (produto: Produto) => void }) {
  const [termo, setTermo] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (termo.length > 1) {
        fetch(getUrl(`roupas?search=${encodeURIComponent(termo)}`), { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
          .then(res => res.json())
          .then(data => setProdutos(data));
      } else {
        setProdutos([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [termo]);

  return (
    <div className="relative">
      <input
        className="w-full p-2 border rounded"
        placeholder="Buscar produto"
        value={termo}
        onChange={e => setTermo(e.target.value)}
      />
      {produtos.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow rounded mt-1 max-h-60 overflow-y-auto">
          {produtos.map(produto => (
            <li
              key={produto.id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => {
                onSelecionar(produto);
                setTermo('');
                setProdutos([]);
              }}
            >
              <img
                src={produto.imagens?.[0]?.url || '/sem-imagem.png'}
                className="w-10 h-10 object-cover rounded"
                alt="preview"
              />
              <div className="text-sm">
                <div>{produto.descricao_curta}</div>
                <div className="text-xs text-gray-500">R$ {produto.valor}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

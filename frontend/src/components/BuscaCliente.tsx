import { useEffect, useState } from 'react';
import {getUrl} from '@/services/api';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
}

export default function BuscarCliente({ onSelecionar }: { onSelecionar: (cliente: Cliente) => void }) {
  const [termo, setTermo] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (termo.length > 1) {
        fetch( getUrl(`/api/clientes?search=${encodeURIComponent(termo)}`))
          .then(res => res.json())
          .then(data => setClientes(data));
      } else {
        setClientes([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [termo]);

  return (
    <div className="relative">
      <input
        className="w-full p-2 border rounded"
        placeholder="Buscar cliente"
        value={termo}
        onChange={e => setTermo(e.target.value)}
      />
      {clientes.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow rounded mt-1 max-h-40 overflow-y-auto">
          {clientes.map(cliente => (
            <li
              key={cliente.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelecionar(cliente);
                setTermo('');
                setClientes([]);
              }}
            >
              {cliente.nome} - {cliente.telefone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

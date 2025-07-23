import { useState, useEffect } from 'react';
import ClienteModal from '@/components/ClienteModal';
import { Button } from '@/components/ui/button';
import {api} from '@/services/api';
import Topbar from '@/components/TopBar';
import ClienteCard from '@/components/ClienteCard';
import { Input } from '@/components/ui/input';
import type { Cliente } from '@/types/clienteType';

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtro, setFiltro] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const porPagina = 12;

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    c.telefone.includes(filtro)
  );

  const totalPaginas = Math.ceil(clientesFiltrados.length / porPagina);
  const clientesPaginados = clientesFiltrados.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);

  const fetchClientes = async () => {
    const { data } = await api.get('/clientes');
    setClientes(data);
  };

  useEffect(() => {
    fetchClientes();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault(); 
        setClienteSelecionado(null); 
        setModalOpen(true); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNovoCliente = () => {
    setClienteSelecionado(null);
    setModalOpen(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setModalOpen(true);
  };

  const handleSalvarCliente = async (dados: Partial<Cliente>) => {
    if (clienteSelecionado) {
      await api.put(`/clientes/${clienteSelecionado.id}`, dados);
    } else {
      await api.post('/clientes', dados);
    }
    fetchClientes();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 gap-4 flex-col sm:flex-row">
          <Input
            placeholder="Buscar por nome ou telefone"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="w-full sm:w-1/2"
          />
          <Button onClick={() => handleNovoCliente()}>Novo Cliente (F11)</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clientesPaginados.map(cliente => (
            <ClienteCard
              onDelete={ async () => {
                if (window.confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
                  await api.delete(`/clientes/${cliente.id}`);
                  fetchClientes();
                }
              }}
              key={cliente.id}
              cliente={cliente}
              onEdit={() => handleEditarCliente(cliente)}
            />
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
            <Button
              key={pagina}
              variant={pagina === paginaAtual ? 'default' : 'outline'}
              onClick={() => setPaginaAtual(pagina)}
            >
              {pagina}
            </Button>
          ))}
        </div>
        <ClienteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSalvarCliente}
          cliente={clienteSelecionado ?? undefined}
        />
      </div>
    </div>
  );
}

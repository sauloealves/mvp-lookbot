import { useState, useEffect } from 'react';
import ClienteModal from '@/components/ClienteModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import api from '@/services/api';
import Topbar from '@/components/Topbar';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  const fetchClientes = async () => {
    const { data } = await api.get('/clientes');
    setClientes(data);
  };

  useEffect(() => {
    fetchClientes();
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
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Clientes</h1>
            <Button onClick={handleNovoCliente}>Novo Cliente</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientes.map((c) => (
            <Card key={c.id} className="p-4 flex flex-col justify-between">
                <div>
                <h2 className="font-bold text-lg">{c.nome}</h2>
                <p className="text-sm">{c.telefone}</p>
                <p className="text-sm">{c.endereco}</p>
                </div>
                <Button className="mt-2" variant="outline" onClick={() => handleEditarCliente(c)}>
                Editar
                </Button>
            </Card>
            ))}
        </div>

        <ClienteModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSalvarCliente}
            cliente={clienteSelecionado}
        />
        </div>
    </div>
  );
}

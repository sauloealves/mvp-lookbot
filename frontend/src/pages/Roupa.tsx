import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RoupaCard from '@/components/RoupaCard';
import RoupaModal from '@/components/RoupaModal';
import {getUrl} from '@/services/api';
import { useLoading } from '@/contexts/LoadingContext';
import Topbar from '@/components/TopBar';

export default function Roupas() {
  const { setLoading } = useLoading();
  const [roupas, setRoupas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [roupaEditando, setRoupaEditando] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const porPagina = 12;

  const roupasFiltradas = roupas.filter(r =>
    r.descricao_curta.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(roupasFiltradas.length / porPagina);
  const roupasPaginadas = roupasFiltradas.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);

  const carregarRoupas = async () => {
    setLoading(true);
    const res = await fetch(getUrl('roupas'), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();
    setRoupas(data);
    setLoading(false);
  };

  useEffect(() => {
    carregarRoupas();
  }, []);

  const abrirModal = (roupa: any = null) => {
    setRoupaEditando(roupa);
    setShowModal(true);
  };

  const salvarRoupa = async (dados: any, files: File[]) => {
    
    const formData = new FormData();
    formData.append('descricao_curta', dados.descricao_curta);
    formData.append('valor', dados.valor.toString());
    formData.append('tom_de_pele', dados.tom_de_pele);
    formData.append('estilo', dados.estilo);
    formData.append('cores_predominantes', dados.cores_predominantes.join(','));

    files.forEach(file => {
      formData.append('imagens', file);
    });

    if (roupaEditando) {
      await fetch(getUrl(`roupas/${roupaEditando.id}`), {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      carregarRoupas();
      setRoupaEditando(null);
    } else {
      await fetch(getUrl('roupas'), {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
    }

    carregarRoupas();

  };

  const excluirRoupa = async (id: string) => {
    if (confirm('Deseja realmente excluir esta roupa?')) {
      await fetch(getUrl(`roupas/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      carregarRoupas();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
    <Topbar />
        <div className="p-4">
        <div className="flex items-center justify-between mb-4 gap-4 flex-col sm:flex-row">
            <Input
            placeholder="Buscar por descrição"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="w-full sm:w-1/2"
            />
            <Button onClick={() => abrirModal()}>Nova Roupa</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {roupasPaginadas.map(roupa => (
            <RoupaCard
                key={roupa.id}
                roupa={roupa}
                onEdit={() => abrirModal(roupa)}
                onDelete={() => excluirRoupa(roupa.id)}
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
        <RoupaModal
            open={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={salvarRoupa}
            roupaModal={roupaEditando}
        />
        </div>
    </div>
  );
}
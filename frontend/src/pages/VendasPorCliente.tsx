import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Topbar from '@/components/TopBar';
import BuscarCliente from '@/components/BuscaCliente';
import type { Cliente, Venda } from '@/types';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getUrl } from '@/services/api';

export default function VendasPorCliente() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [modalVenda, setModalVenda] = useState<Venda | null>(null);

  const buscarVendas = async () => {
    if (!cliente) return;
    const response = await fetch(getUrl(`vendas/cliente/${cliente.id}`), {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    setVendas(data);
  };

  const excluirVenda = async (id: string) => {
    if (!confirm('Deseja excluir esta venda?')) return;
    await fetch(getUrl(`vendas/${id}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    buscarVendas();
  };

  useEffect(() => {
    if (cliente) buscarVendas();
  }, [cliente]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <div className="p-4 max-w-5xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold">Vendas por Cliente</h2>
        <BuscarCliente onSelecionar={setCliente} />
        {cliente && (
          <p className="text-green-600">Cliente selecionado: {cliente.nome}</p>
        )}

        <table className="w-full mt-4 text-sm border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Data</th>
              <th>Total de Itens</th>
              <th>Valor Total</th>
              <th>Desconto Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => {
              const totalItens = venda.itens.reduce((acc, i) => acc + i.quantidade, 0);
              const totalValor = venda.itens.reduce((acc, i) => acc + i.quantidade * i.valor_unitario, 0);
              const totalDesconto = venda.itens.reduce((acc, i) => acc + (i.desconto || 0), 0);

              return (
                <tr key={venda.id} className="border-t">
                  <td className="p-2">{new Date(venda.data).toLocaleDateString()}</td>
                  <td className="text-center">{totalItens}</td>
                  <td className="text-center">R$ {totalValor.toFixed(2)}</td>
                  <td className="text-center">R$ {totalDesconto.toFixed(2)}</td>
                  <td className="space-x-2 text-center">
                    <Button size="sm" onClick={() => setModalVenda(venda)}>Visualizar</Button>
                    <Button size="sm" variant="destructive" onClick={() => excluirVenda(venda.id)}>Excluir</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Dialog open={!!modalVenda} onOpenChange={() => setModalVenda(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Itens da Venda</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {modalVenda?.itens.map((item, index) => (
                <div key={index} className="border p-2 rounded">
                  <p><strong>Produto:</strong> {item.roupa.descricao_curta}</p>
                  <p><strong>Quantidade:</strong> {item.quantidade}</p>
                  <p><strong>Valor Unitário:</strong> R$ {item.valor_unitario.toFixed(2)}</p>
                  {item.desconto && <p><strong>Desconto:</strong> R$ {item.desconto.toFixed(2)}</p>}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
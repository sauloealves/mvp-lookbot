import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Roupa } from '@/types';
import type { Cliente } from '@/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Topbar from '@/components/TopBar';
import type { ItemVenda } from '@/types/itemVendaType';
import BuscarProduto from '@/components/BuscaProduto';
import BuscarCliente from '@/components/BuscaCliente';
import { getUrl } from '@/services/api';

export default function NovaVenda() {
  // const [clienteFiltro, setClienteFiltro] = useState('');
  // const [produtoFiltro, setProdutoFiltro] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  // const [produtosFiltrados, setProdutosFiltrados] = useState<Roupa[]>([]);
  // const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [itens, setItens] = useState<ItemVenda[]>([]);
  const [tipo, setTipo] = useState<'venda' | 'consignado'>('venda');
  const [data, setData] = useState<Date | undefined>(new Date());

  const adicionarItem = (roupa: Roupa) => {
    const existe = itens.find(i => i.roupa.id === roupa.id);
    if (existe) return;
    setItens([...itens, { roupa, quantidade: 1, valor: roupa.valor, tipo: tipo, valor_unitario: roupa.valor }]);
  };

  const atualizarItem = (index: number, campo: 'quantidade' | 'valor', valor: number) => {
    const novo = [...itens];
    novo[index][campo] = valor;
    setItens(novo);
  };

  const removerItem = (index: number) => {
    const novo = [...itens];
    novo.splice(index, 1);
    setItens(novo);
  };

  const total = itens.reduce((acc, i) => acc + i.valor * i.quantidade, 0);

  const handleSubmit = () => {
    if (!clienteSelecionado || !data || itens.length === 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const venda = {
      cliente_id: clienteSelecionado.id,
      loja_id: localStorage.getItem('lojaId'),
      data: data.toISOString(),
      itens: itens.map(i => ({
        roupa_id: i.roupa.id,
        quantidade: i.quantidade,
        valor_unitario: i.valor,
        tipo: i.tipo,
        desconto_aplicado: 0
      }))
    };

    fetch(getUrl('vendas'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(venda)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Venda salva com sucesso!');
          setItens([]);
          setClienteSelecionado(null);
          setData(new Date());
        }
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao salvar venda');
      });
  };

  const handleTipoChange = (index: number, novoTipo: string) => {
    const novosItens = [...itens];
    novosItens[index].tipo = novoTipo as 'venda' | 'consignado';
    setItens(novosItens);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <div className="p-4 max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold">Nova Venda / Consignado</h2>

        <div className="flex gap-4">
          <div className="flex-[2]">
            <BuscarCliente onSelecionar={setClienteSelecionado} />
            {clienteSelecionado && (
              <p className="text-sm text-green-600">Cliente: {clienteSelecionado.nome}</p>
            )}
          </div>

          <div className="w-40">
            <Select value={tipo} onValueChange={v => setTipo(v as 'venda' | 'consignado')}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="venda">Venda</SelectItem>
                <SelectItem value="consignado">Consignado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-36">
            <Input
              type="date"
              className="border rounded-md"
              value={data ? data.toISOString().substring(0, 10) : ''}
              onChange={e => setData(e.target.value ? new Date(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div>
         <BuscarProduto onSelecionar={adicionarItem} />
        </div>

        <div>
          <table className="w-full text-sm border mt-4 table-auto border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Produto</th>
                <th>Qtd</th>
                <th>Valor</th>
                <th>Total</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, index) => (
                <tr key={index} className={`transition-all ${
                    item.tipo === 'consignado'
                      ? 'bg-blue-100'
                      : item.tipo === 'venda'
                      ? 'bg-green-100'
                      : ''
                  } border-b`}>
                  <td className="p-2">{item.roupa.descricao_curta}</td>
                  <td className="text-center">
                    <Input
                      type="number"
                      className="w-16 text-center"
                      value={item.quantidade}
                      onChange={(e) => atualizarItem(index, 'quantidade', Number(e.target.value))}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="number"
                      className="w-20 text-center"
                      value={item.valor}
                      onChange={(e) => atualizarItem(index, 'valor', Number(e.target.value))}
                    />
                  </td>
                  <td className="text-center">R$ {(item.quantidade * item.valor).toFixed(2)}</td>
                  <td>
                    <select
                      value={item.tipo}
                      onChange={(e) => handleTipoChange(index, e.target.value)}
                      className="border rounded px-1 py-0.5"
                    >
                      <option value="venda">Venda</option>
                      <option value="consignado">Consignado</option>
                    </select>
                  </td>
                  <td className="text-center">
                    <button
                      className="text-red-500"
                      onClick={() => removerItem(index)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-right mt-2 font-semibold">Total: R$ {total.toFixed(2)}</p>
        </div>

        <Button className="w-full mt-4" onClick={handleSubmit}>Salvar Venda</Button>
      </div>
    </div>
  );
}
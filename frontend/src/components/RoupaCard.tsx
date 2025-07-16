import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';

export default function RoupaCard({ roupa, onEdit, onDelete }: { roupa: any, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition-all">
      <h3 className="text-lg font-semibold mb-2">{roupa.descricao_curta}</h3>
      <p className="text-sm text-gray-600">🎨 Cores: {roupa.cores_predominantes?.join(', ')}</p>
      <p className="text-sm text-gray-600">💸 R$ {roupa.valor}</p>
      <p className="text-sm text-gray-600">🧥 {roupa.estilo}</p>
      <div className="flex justify-between gap-2 mt-4">
        <Button onClick={onEdit} className="w-1/2"><Pencil size={16} className="mr-1" /> Editar</Button>
        <Button onClick={onDelete} variant="destructive" className="w-1/2"><Trash size={16} className="mr-1" /> Excluir</Button>
      </div>
    </div>
  );
}
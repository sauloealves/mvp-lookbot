import { Button } from '@/components/ui/button';

export default function ClienteCard({ cliente, onEdit, onDelete }: { cliente: any, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition-all">
      <h3 className="text-lg font-semibold mb-2">{cliente.nome}</h3>
      <p className="text-sm text-gray-600">📞 {cliente.telefone}</p>
      <p className="text-sm text-gray-600">🏠 {cliente.endereco}</p>
       <div className="flex gap-2 mt-2">
        <Button className="flex-1" onClick={onEdit}>
          Editar
        </Button>
        <Button className="flex-1" variant="destructive" onClick={onDelete}>
          Excluir
        </Button>
      </div>
    </div>
  );
}
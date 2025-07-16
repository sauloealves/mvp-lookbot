import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RoupaModal({ open, onClose, onSubmit, roupa }: any) {
  const [form, setForm] = useState({ descricao_curta: '', valor: '', cores_predominantes: '' });

  useEffect(() => {
    setForm({
      descricao_curta: roupa?.descricao_curta || '',
      valor: roupa?.valor || '',
      cores_predominantes: roupa?.cores_predominantes?.join(', ') || ''
    });
  }, [roupa]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.descricao_curta.trim() || !form.valor.trim()) {
      alert('Descrição e valor são obrigatórios');
      return;
    }
    const payload = {
      ...form,
      valor: parseFloat(form.valor),
      cores_predominantes: form.cores_predominantes.split(',').map(c => c.trim())
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{roupa ? 'Editar Roupa' : 'Nova Roupa'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input name="descricao_curta" placeholder="Descrição" value={form.descricao_curta} onChange={handleChange} />
          <Input name="valor" placeholder="Valor" type="number" value={form.valor} onChange={handleChange} />
          <Input name="cores_predominantes" placeholder="Cores (separadas por vírgula)" value={form.cores_predominantes} onChange={handleChange} />
          <Button className="w-full" onClick={handleSubmit}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
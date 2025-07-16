import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { normalizePhoneNumber } from '@/services/masks';

interface Cliente {
  nome: string;
  telefone: string;
  endereco: string;
}

interface ClienteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: Cliente) => void;
  cliente?: Cliente;
}

export default function ClienteModal({ open, onClose, onSubmit, cliente }: ClienteModalProps) {
  const [form, setForm] = useState<Cliente>({
    nome: '',
    telefone: '',
    endereco: ''
  });

  useEffect(() => {
  if (open) {
    setForm({
      nome: cliente?.nome || '',
      telefone: normalizePhoneNumber(cliente?.telefone) || '',
      endereco: cliente?.endereco || ''
    });
  }
}, [cliente, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const formattedValue =
    e.target.name === 'telefone' ? normalizePhoneNumber(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: formattedValue });
  };

  const handleSubmit = () => {
    if (!form.nome.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    if (!form.telefone.match(/^\(\d{2}\) \d{5}-\d{4}$/)) {
      alert('Telefone inválido');
      return;
    }
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{cliente ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <Input
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            required
          />
          
          <Input
            name="endereco"
            placeholder="Endereço"
            value={form.endereco}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit} className="w-full">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

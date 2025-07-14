import { useState, forwardRef } from 'react';
import InputMask from 'react-input-mask';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const MaskedInput = forwardRef<HTMLInputElement, any>((props, ref) => (
  <InputMask {...props} ref={ref}>
    {(inputProps: any) => <Input {...inputProps} />}
  </InputMask>
));

export default function ClienteModal({ open, onClose, onSubmit, cliente }: any) {
  const [form, setForm] = useState({
    nome: cliente?.nome || '',
    telefone: cliente?.telefone || '',
    endereco: cliente?.endereco || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          <MaskedInput
            mask="(99) 99999-9999"
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
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

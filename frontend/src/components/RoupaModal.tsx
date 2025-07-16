import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RoupaModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (data: FormData) => void }) {
  const [form, setForm] = useState({
    descricao_curta: '',
    cores_predominantes: '',
    tom_de_pele: '',
    estilo: '',
    valor: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    setPreviews(files.map(file => URL.createObjectURL(file)));
  }, [files]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  const handleSubmit = () => {
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    files.forEach(file => data.append('imagens', file));
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Roupa</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input name="descricao_curta" placeholder="Descrição" onChange={handleChange} />
          <Input name="cores_predominantes" placeholder="Cores (separadas por vírgula)" onChange={handleChange} />
          <Input name="tom_de_pele" placeholder="Tom de pele sugerido" onChange={handleChange} />
          <Input name="estilo" placeholder="Estilo (casual, festa, etc.)" onChange={handleChange} />
          <Input name="valor" placeholder="Valor" type="number" onChange={handleChange} />
          <Input type="file" multiple accept="image/*" onChange={handleFileChange} />

          <div className="flex gap-2 overflow-x-auto">
            {previews.map((src, index) => (
              <img key={index} src={src} className="w-24 h-24 object-cover rounded" />
            ))}
          </div>

          <Button className="w-full mt-4" onClick={handleSubmit}>Salvar Roupa</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

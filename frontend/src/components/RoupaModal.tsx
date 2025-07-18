import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {getUrl} from '@/services/api';
import { Loader2, Sparkles } from 'lucide-react'; // ícones extras

interface Roupa {  
  id: string;
  descricao_curta: string;
  cores_predominantes: string[]; 
  tom_de_pele: string;
  estilo: string;
  valor: number;
  imagens?: { url: string }[];
}

interface RoupaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: Roupa, files: File[]) => void;
  roupa?: Roupa;
}

export default function RoupaModal({ open, onClose, onSubmit, roupaModal }: RoupaModalProps) {
  const [form, setForm] = useState({    
    descricao_curta: roupaModal?.descricao_curta || '',
    cores_predominantes: roupaModal?.cores_predominantes?.join(', ') || '',
    tom_de_pele: roupaModal?.tom_de_pele || '',
    estilo: roupaModal?.estilo || '',
    valor: roupaModal?.valor || ''
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [gerandoDescricao, setGerandoDescricao] = useState(false);

  useEffect(() => {
    setForm({
      descricao_curta: roupaModal?.descricao_curta || '',
      cores_predominantes: roupaModal?.cores_predominantes?.join(', ') || '',
      tom_de_pele: roupaModal?.tom_de_pele || '',
      estilo: roupaModal?.estilo || '',
      valor: roupaModal?.valor?.toString() || ''
    });

    if (roupaModal?.imagens?.length) {
      setPreviews(roupaModal.imagens.map(img => img.url));
    } else {
      setPreviews([]);
    }
    setFiles([]);
  }, [roupaModal]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = Array.from(e.target.files || []);
  const newPreviews = selected.map(file => URL.createObjectURL(file));

  setFiles(prev => [...prev, ...selected]);
  setPreviews(prev => [...prev, ...newPreviews]);
};

  const handleSubmit = () => {
    if (!form.descricao_curta.trim() || !form.valor) {
      alert('Descrição e valor são obrigatórios');
      return;
    }
    const payload: Roupa = {
      id: roupaModal?.id,
      imagens: files.map(file => ({ url: URL.createObjectURL(file) })),
      descricao_curta: form.descricao_curta.trim(),
      valor: Number(form.valor),
      tom_de_pele: form.tom_de_pele.trim(),
      estilo: form.estilo.trim(),
      cores_predominantes: form.cores_predominantes.split(',').map(c => c.trim()),
    };
    onSubmit(payload, files);
    onClose();
  };

  const removePreview = (index: number) => {
    setPreviews(previews.filter((_, i) => i !== index));
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleAutoDescribe = async () => {
    if (!files.length) {
      alert('Adicione ao menos uma imagem para gerar a descrição.');
      return;
    }
    
    setGerandoDescricao(true);
    const formData = new FormData();
    formData.append('image', files[0]);

    try {
      const url = getUrl('roupas/ia/descricao');
      const res = await fetch(url, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.descricao) {
        setForm(prev => ({ ...prev, descricao_curta: data.descricao }));
      } else {
        alert('Não foi possível gerar uma descrição.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar descrição com IA.');
    }finally {
      setGerandoDescricao(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{roupaModal ? `Editar Roupa -${roupaModal.descricao_curta}` : 'Nova Roupa'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              name="descricao_curta"
              placeholder="Descrição"
              value={form.descricao_curta}
              onChange={handleChange}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAutoDescribe}
              disabled={gerandoDescricao}
              className="p-2"
            >
              {gerandoDescricao ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Input name="valor" placeholder="Valor" type="number" value={form.valor} onChange={handleChange} />
          <Input name="cores_predominantes" placeholder="Cores (separadas por vírgula)" value={form.cores_predominantes} onChange={handleChange} />
          <Input name="tom_de_pele" placeholder="Tom de pele sugerido" value={form.tom_de_pele} onChange={handleChange} />
          <Input name="estilo" placeholder="Estilo (casual, festa, etc.)" value={form.estilo} onChange={handleChange} />
          
        </div>
          <Input type="file" multiple accept="image/*" onChange={handleFileChange} />

          <div className="flex gap-2 overflow-x-auto">
            {previews.map((src, index) => (
              <div key={index} className="relative w-24 h-24">
                <img src={src} className="w-full h-full object-cover rounded" />
                <button
                  onClick={() => removePreview(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  type="button"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={handleSubmit}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

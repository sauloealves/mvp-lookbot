import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LogoPreview from "@/components/LogoPreview";
import {api} from "@/services/api";
import { validarSenha } from "@/lib/utils";

export default function CadastroLoja() {  
  const [nome, setNome] = useState('');
  const [logo, setLogo] = useState<File | null>(null);  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logo) return alert('Selecione um logo.');
    const form = new FormData();

    form.append('nome', nome);
    form.append('logo', logo);
    form.append('email', email);
    form.append('senha', senha);
    
    if (senha !== confirmarSenha) 
      return alert('As senhas não coincidem.');

    if (!validarSenha(senha)) 
      return alert('Senha inválida. Deve ter pelo menos 6 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial.');

    await api.post('/lojas', form);
    alert('Loja cadastrada com sucesso!');
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Cadastro de Loja</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input placeholder="Nome da loja" value={nome} onChange={e => setNome(e.target.value)} required />
        <Input type="file" accept="image/*" onChange={e => setLogo(e.target.files?.[0] || null)} required />
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
        <Input type="password" placeholder="Confirmar senha" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} required />
        
        <LogoPreview file={logo} />
        <Button type="submit">Salvar</Button>
      </form>
    </div>
  );
}

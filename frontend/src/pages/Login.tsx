import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {api} from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, senha });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('loja_logo', data.loja_logo);
      localStorage.setItem('loja_nome', data.loja_nome);

      navigate('/');
    } catch (error) {
      alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle className="text-center">Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
            <Button className="w-full" type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

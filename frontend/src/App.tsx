import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { setupInterceptors } from '@/services/api';
import { LoadingProvider } from '@/contexts/LoadingProvider';
import Loader from '@/components/Loader';

import Login from '@/pages/Login';
import Home from '@/pages/Home';
import LojaCadastro from '@/pages/LojaCadastro';
import Clientes from './pages/Cliente';
// Importar outras páginas conforme forem criadas

export default function App() {
  const [isLoading, setLoading] = useState(false);

  // Configura os interceptadores apenas uma vez
  useEffect(() => {
    setupInterceptors(setLoading);
  }, []);

  return (
    <LoadingProvider value={{ isLoading, setLoading }}>
      <BrowserRouter>
        <Loader />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/loja-cadastro" element={<LojaCadastro />} />
          <Route path="/clientes" element={<Clientes />} />
          {/* Adicione outras rotas conforme necessidade */}
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingProvider } from '@/contexts/LoadingProvider';
import Loader from '@/components/Loader';

import Login from '@/pages/Login';
import Home from '@/pages/Home';
import LojaCadastro from '@/pages/LojaCadastro';
import Clientes from './pages/Cliente';
import ProtectedRoute from './components/ProtectedRoute';
import Roupa from './pages/Roupa';
import Venda from './pages/Venda';
import VendasPorCliente from './pages/VendasPorCliente';

export default function App() {
  const [isLoading, setLoading] = useState(false);


  return (
    <LoadingProvider value={{ isLoading, setLoading }}>
      <BrowserRouter>
        <Loader />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/loja-cadastro" element={<LojaCadastro />} />
                   
          <Route 
              path="/clientes" 
              element={<ProtectedRoute><Clientes /></ProtectedRoute>} />

          <Route 
              path="/roupas" 
              element={<ProtectedRoute><Roupa /></ProtectedRoute>} />

              <Route 
              path="/vendas" 
              element={<ProtectedRoute><Venda /></ProtectedRoute>} />

              <Route 
              path="/vendascliente" 
              element={<ProtectedRoute><VendasPorCliente /></ProtectedRoute>} />

        </Routes>

      </BrowserRouter>
    </LoadingProvider>
  );
}

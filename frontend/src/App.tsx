import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import LojaCadastro from './pages/LojaCadastro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/lojas/cadastro" element={<LojaCadastro />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
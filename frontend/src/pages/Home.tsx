import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Topbar from "@/components/Topbar";
import {
  Users,
  ShoppingCart,
  PackagePlus,
  UserCircle
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    setIsAdmin(payload?.is_admin);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <div className="flex flex-col items-center justify-center p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mt-10">
          {isAdmin && (
            <Button onClick={() => navigate('/usuarios')} className="flex flex-col items-center justify-center p-6 h-36 text-lg">
              <Users size={48} className="mb-2" />
              Usuários
            </Button>
          )}
          <Button onClick={() => navigate('/cadastrar-produto')} className="flex flex-col items-center justify-center p-6 h-36 text-lg">
            <PackagePlus size={48} className="mb-2" />
            Cadastrar Produto
          </Button>
          <Button onClick={() => navigate('/compras')} className="flex flex-col items-center justify-center p-6 h-36 text-lg">
            <ShoppingCart size={48} className="mb-2" />
            Visualizar Compras
          </Button>
          <Button onClick={() => navigate('/clientes')} className="flex flex-col items-center justify-center p-6 h-36 text-lg">
            <UserCircle size={48} className="mb-2" />
            Clientes
          </Button>
        </div>
      </div>
    </div>
  );
}

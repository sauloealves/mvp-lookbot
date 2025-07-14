// 📁 src/components/Topbar.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

export default function Topbar() {
  const [logo, setLogo] = useState<string | null>(null);
  const [lojaNome, setLojaNome] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const logoUrl = localStorage.getItem('loja_logo');
    const nomeLoja = localStorage.getItem('loja_nome');
    if (logoUrl) setLogo(logoUrl);
    if (nomeLoja) setLojaNome(nomeLoja);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="w-full flex justify-between items-center p-4 shadow bg-white">
      <div className="flex items-center gap-2">
        {logo && <img src={logo} alt="Logo" className="h-10" />}
        {lojaNome && <span className="text-xl font-semibold">{lojaNome}</span>}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={undefined} alt="user" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate('/meu-cadastro')}>Meu Cadastro</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logoff</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
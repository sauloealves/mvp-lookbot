import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validarSenha(senha: string): boolean {
  // Pelo menos 6 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  return regex.test(senha);
}
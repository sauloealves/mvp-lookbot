import type { Roupa } from './roupaType';

export interface ItemVenda {
  roupa: Roupa;
  quantidade: number;
  valor: number;
  tipo: 'venda' | 'consignado'; 
  desconto?: number; 
  valor_unitario: number;
}
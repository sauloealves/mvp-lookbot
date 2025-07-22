import type { ItemVenda } from "./itemVendaType";

export interface Venda {
  id: string;
  cliente_id: string;
  data: string;
  itens: ItemVenda[];
}

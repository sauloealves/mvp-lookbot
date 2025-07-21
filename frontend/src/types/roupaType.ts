export interface Roupa {
  id: string;
  descricao_curta: string;
  valor: number;
  cores_predominantes: string[];
  estilo: string;
  tom_de_pele: string;
  imagens?: { url: string }[];
}
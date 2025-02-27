// interfaces.ts
export interface Documento {
  id_documento: number;
  nombre_documento: string;
  unidad_periodo: number;
  tipo_documento: string;
  ruta: string;
  documentInfo: any;
}

export interface ModalData {
  mode?: 'view' | 'edit' | 'add';
  id_documento?: number;
  loadData?: () => void;
}

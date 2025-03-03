// interfaces.ts
export interface Documento {
  id_documento: number;
  nombre_documento: string;
  unidad_periodo: string;
  vigencia: number;
  tipo_documento: string;
  ruta: string;
  documentInfo: {
    fecha_emision: string;
    fecha_vencimiento: string;
    ruta: string;
  };
}

export interface ModalData {
  mode?: 'view' | 'edit' | 'add';
  id_documento?: number;
  loadData?: () => void;
}

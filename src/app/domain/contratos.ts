export interface Contratos {
  [x: string]: any;
  
  id?: string;
  cliente: string;
  placa: string;
  fechaInicio: Date; // Keep these as Date
  fechaFin: Date;
  numeroespacio: string;
  montoMensual: number;
  estado: string;
}

export interface Contratos {
  
  
  id?: string;
  cliente: string;
  placa: string;
  fechaInicio: Date; // Keep these as Date
  fechaFin: Date;
  numeroespacio: string;
  montoMensual: number;
  estado: string;
}
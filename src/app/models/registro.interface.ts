export interface Registro {
    id: number;
    fecha: Date;
    temperatura: number;
    presion: number;
    humedad: number;
    observaciones: string;
}

export interface RegistroFiltro {
    fechaInicio?: Date;
    fechaFin?: Date;
    tipoSensor?: string;
}

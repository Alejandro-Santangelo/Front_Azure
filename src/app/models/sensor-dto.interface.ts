export interface SensorDto {
    idBiodigestor: number;
    fechaHora: string;
    valorLectura: number;
}

export interface SensorResponse {
    idRegistro: number;
    idSensor: number;
    idBiodigestor: number;
    tipoSensor: string;
    fechaHora: string;
    valor: number;
    alerta: number | null;
    alarma: number | null;
    normal: number | null;
}

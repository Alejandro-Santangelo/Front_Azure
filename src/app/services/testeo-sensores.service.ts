import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SensorDto, SensorResponse } from '../models/sensor-dto.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TesteoSensoresService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  testSensorHumedad(idSensor: number, data: SensorDto): Observable<SensorResponse> {
    return this.http.post<SensorResponse>(`${this.baseUrl}/api/SimuladorDeValores/sensor-humedad/${idSensor}`, data);
  }

  testSensorTemperatura(idSensor: number, data: SensorDto): Observable<SensorResponse> {
    return this.http.post<SensorResponse>(`${this.baseUrl}/api/SimuladorDeValores/sensor-temperatura/${idSensor}`, data);
  }

  testSensorPresion(idSensor: number, data: SensorDto): Observable<SensorResponse> {
    return this.http.post<SensorResponse>(`${this.baseUrl}/api/SimuladorDeValores/sensor-presion/${idSensor}`, data);
  }
}

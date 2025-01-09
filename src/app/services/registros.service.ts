import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Registro, RegistroFiltro } from '../models/registro.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistrosService {
  private apiUrl = `${environment.apiUrl}/api/Registros`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  getRegistros(filtro?: RegistroFiltro): Observable<Registro[]> {
    let params = new HttpParams();
    
    if (filtro?.fechaInicio) {
      params = params.set('fechaInicio', filtro.fechaInicio.toISOString());
    }
    if (filtro?.fechaFin) {
      params = params.set('fechaFin', filtro.fechaFin.toISOString());
    }
    if (filtro?.tipoSensor) {
      params = params.set('tipoSensor', filtro.tipoSensor);
    }

    return this.http.get<Registro[]>(this.apiUrl, { ...this.httpOptions, params });
  }

  getRegistroPorId(id: number): Observable<Registro> {
    return this.http.get<Registro>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  crearRegistro(registro: Omit<Registro, 'id'>): Observable<Registro> {
    return this.http.post<Registro>(this.apiUrl, registro, this.httpOptions);
  }

  actualizarRegistro(id: number, registro: Partial<Registro>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, registro, this.httpOptions);
  }

  eliminarRegistro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }
}

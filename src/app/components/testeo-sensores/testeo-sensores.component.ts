import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { TesteoSensoresService } from '../../services/testeo-sensores.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SensorDto, SensorResponse } from '../../models/sensor-dto.interface';

interface RangoValor {
  min: number;
  max: number;
  texto: string;
}

interface RangoSensor {
  min: number;
  max: number;
  normal: RangoValor;
  alerta: RangoValor;
  alarma: RangoValor;
}

interface Mensaje {
  mensaje: string;
  tipo: 'success' | 'warning' | 'error';
}

@Component({
  selector: 'app-testeo-sensores',
  templateUrl: './testeo-sensores.component.html',
  styleUrls: ['./testeo-sensores.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class TesteoSensoresComponent {
  idSensor: number = 1;
  idBiodigestor: number = 1;
  valorLectura: number | null = null;
  tipoSensor: 'temperatura' | 'humedad' | 'presion' = 'temperatura';
  
  rangos = {
    temperatura: {
      min: 0,
      max: 100,
      normal: { min: 30, max: 45, texto: '30°C - 45°C\n(Óptimo)' },
      alerta: { min: 25, max: 50, texto: '25°C - 30°C\n45°C - 50°C\n(Atención)' },
      alarma: { min: 0, max: 25, texto: '> 50°C\n(¡Urgente!)' }
    },
    humedad: {
      min: 0,
      max: 100,
      normal: { min: 40, max: 60, texto: '40% - 60%\n(Óptimo)' },
      alerta: { min: 30, max: 70, texto: '30% - 40%\n60% - 70%\n(Atención)' },
      alarma: { min: 0, max: 30, texto: '> 70%\n(¡Urgente!)' }
    },
    presion: {
      min: 0,
      max: 80,
      normal: { min: 14, max: 22, texto: '14 - 22 PSI\n(Óptimo)' },
      alerta: { min: 10, max: 26, texto: '10 - 14 PSI\n22 - 26 PSI\n(Atención)' },
      alarma: { min: 0, max: 10, texto: '> 26 PSI\n(¡Urgente!)' }
    }
  } as const;

  constructor(
    private testeoService: TesteoSensoresService,
    private snackBar: MatSnackBar
  ) {}

  get unidad(): string {
    switch (this.tipoSensor) {
      case 'temperatura': return '°C';
      case 'humedad': return '%';
      case 'presion': return 'PSI';
      default: return '';
    }
  }

  get rangoActual(): RangoSensor {
    const rango = this.rangos[this.tipoSensor];
    if (!rango) {
      return {
        min: 0,
        max: 100,
        normal: { min: 0, max: 0, texto: 'N/A' },
        alerta: { min: 0, max: 0, texto: 'N/A' },
        alarma: { min: 0, max: 0, texto: 'N/A' }
      };
    }
    return rango;
  }

  testearSensor() {
    // Validar que los valores no sean nulos o undefined
    if (!this.idSensor || !this.idBiodigestor) {
      this.mostrarMensaje('error', '⚠️ Error: Debe ingresar los IDs del sensor y biodigestor');
      return;
    }

    // Validar ID del sensor
    if (this.idSensor <= 0) {
      this.mostrarMensaje('error', '⚠️ Error: El ID del sensor debe ser mayor a 0');
      return;
    }

    // Validar ID del biodigestor
    if (this.idBiodigestor <= 0) {
      this.mostrarMensaje('error', '⚠️ Error: El ID del biodigestor debe ser mayor a 0');
      return;
    }

    // Validar valor de lectura
    if (this.valorLectura === null || this.valorLectura === undefined) {
      this.mostrarMensaje('error', '⚠️ Error: Por favor ingrese un valor de lectura');
      return;
    }

    const rango = this.rangoActual;
    if (!rango) {
      this.mostrarMensaje('error', '⚠️ Error: Tipo de sensor no válido');
      return;
    }

    // Preparar los datos para enviar
    const data: SensorDto = {
      idBiodigestor: this.idBiodigestor,
      fechaHora: new Date().toISOString(),
      valorLectura: this.valorLectura
    };

    // Seleccionar el endpoint según el tipo de sensor
    let testObservable: Observable<SensorResponse>;
    switch (this.tipoSensor) {
      case 'humedad':
        testObservable = this.testeoService.testSensorHumedad(this.idSensor, data);
        break;
      case 'temperatura':
        testObservable = this.testeoService.testSensorTemperatura(this.idSensor, data);
        break;
      case 'presion':
        testObservable = this.testeoService.testSensorPresion(this.idSensor, data);
        break;
      default:
        this.mostrarMensaje('error', '⚠️ Error: Tipo de sensor no válido');
        return;
    }

    // Realizar la petición
    testObservable.pipe(
      catchError(error => {
        let mensajeError = '⚠️ Error de conexión';
        
        if (error.status === 404) {
          mensajeError = '⚠️ No se encontró el sensor especificado';
        } else if (error.status === 400) {
          mensajeError = '⚠️ Datos inválidos: ' + (error.error?.message || error.error || 'Verifique los valores ingresados');
        } else if (error.status === 500) {
          mensajeError = '⚠️ Error en el servidor: ' + (error.error?.message || error.error || 'Error interno del servidor');
        }

        this.mostrarMensaje('error', mensajeError);
        throw error;
      })
    ).subscribe((response: any) => {
      console.log('Respuesta completa del servidor:', response);
      console.log('Tipo de respuesta:', typeof response);
      console.log('Propiedades de la respuesta:', Object.keys(response));
      
      if (response && typeof response === 'object') {
        console.log('Valores de las propiedades:');
        Object.entries(response).forEach(([key, value]) => {
          console.log(`${key}:`, value, `(${typeof value})`);
        });
      }

      // Determinar el valor y el estado
      let valorEncontrado = null;
      let estado: 'normal' | 'alerta' | 'alarma' = 'normal';
      
      if (response && typeof response === 'object') {
        // Verificar si es una alarma
        if (typeof response.alarma === 'number') {
          console.log('Estado de alarma:', response.alarma);
          valorEncontrado = response.alarma;
          estado = 'alarma';
        }
        // Si no es alarma, verificar si es alerta
        else if (typeof response.alerta === 'number') {
          console.log('Estado de alerta:', response.alerta);
          valorEncontrado = response.alerta;
          estado = 'alerta';
        }
        // Si no es ni alarma ni alerta, debe ser normal
        else if (typeof response.normal === 'number') {
          console.log('Estado normal:', response.normal);
          valorEncontrado = response.normal;
          estado = 'normal';
        }
      }

      console.log('Valor final encontrado:', valorEncontrado, 'Estado:', estado);
      console.log('Tipo de sensor:', this.tipoSensor);

      if (valorEncontrado !== null && typeof valorEncontrado === 'number') {
        this.valorLectura = valorEncontrado;
        
        // Para temperatura > 50, forzar estado de alarma
        if (this.tipoSensor === 'temperatura' && valorEncontrado > 50) {
          console.log('Temperatura > 50, forzando estado de alarma');
          estado = 'alarma';
        }

        // Obtener el rango actual para usar en todos los casos
        const rango = this.rangoActual;
        
        // Determinar el mensaje según el estado y el tipo de sensor
        switch (estado) {
          case 'alarma':
            console.log('Procesando estado de alarma');
            // Caso especial para temperatura > 50
            if (this.tipoSensor === 'temperatura' && valorEncontrado > 50) {
              console.log('Mostrando alarma por temperatura > 50');
              this.mostrarMensaje('error', `🔥 ¡ALARMA! ¡La temperatura superó los 50°C! (${valorEncontrado}${this.unidad}). ¡Acción inmediata, Sali Corriendo! Rango normal: ${rango.normal.texto}`);
            } else {
              this.mostrarMensaje('error', this.getMensajeAlarma());
            }
            break;
          case 'alerta':
            console.log('Procesando estado de alerta');
            // Determinar si el valor está por encima o por debajo del rango normal
            const esBajo = valorEncontrado < rango.normal.min;
            let mensajeAlerta = '';

            switch (this.tipoSensor) {
              case 'temperatura':
                mensajeAlerta = `⚠️ ¡Atención! Temperatura ${esBajo ? 'baja' : 'alta'} (${valorEncontrado}${this.unidad})\n` +
                              `Rango actual: ${esBajo ? '25°C - 30°C' : '45°C - 50°C'}\n(Atención)`;
                break;
              case 'humedad':
                mensajeAlerta = `⚠️ ¡Atención! Humedad ${esBajo ? 'baja' : 'alta'} (${valorEncontrado}${this.unidad})\n` +
                              `Rango actual: ${esBajo ? '30% - 40%' : '60% - 70%'}\n(Atención)`;
                break;
              case 'presion':
                mensajeAlerta = `⚠️ ¡Atención! Presión ${esBajo ? 'baja' : 'alta'} (${valorEncontrado}${this.unidad})\n` +
                              `Rango actual: ${esBajo ? '10 - 14 PSI' : '22 - 26 PSI'}\n(Atención)`;
                break;
            }
            
            this.mostrarMensaje('warning', mensajeAlerta);
            break;
          case 'normal':
            console.log('Procesando estado normal');
            // Caso especial para presión
            if (this.tipoSensor === 'presion') {
              if (valorEncontrado >= 14 && valorEncontrado <= 22) {
                this.mostrarMensaje('success', `✅ Los valores de presión están en rango óptimo (${valorEncontrado}${this.unidad})\n${rango.normal.texto}`);
              } else {
                this.mostrarMensaje('warning', `⚠️ La presión está ${valorEncontrado < 14 ? 'baja' : 'alta'} (${valorEncontrado}${this.unidad})\nRango óptimo: ${rango.normal.texto}`);
              }
            } else {
              this.mostrarMensaje('success', `✅ Los valores de ${this.tipoSensor} están en rango óptimo (${valorEncontrado}${this.unidad})\n${rango.normal.texto}`);
            }
            break;
        }
      } else {
        console.error('No se pudo extraer un valor numérico válido de la respuesta:', response);
        this.mostrarMensaje('error', '⚠️ Error: La respuesta del servidor no tiene el formato esperado');
      }
    });
  }

  private getMensajeAlarma(): string {
    const rango = this.rangoActual;
    const valor = this.valorLectura;

    if (valor === null) {
      return 'Error: No hay valor de lectura';
    }

    switch (this.tipoSensor) {
      case 'temperatura':
        return valor < 25 
          ? `❄️ ¡ALARMA! La temperatura está muy baja (${valor}${this.unidad}). ¡Acción inmediata necesaria! Rango normal: ${rango.normal.texto}`
          : `🔥 ¡ALARMA! La temperatura está muy alta (${valor}${this.unidad}). ¡Acción inmediata, Sali Corriendo! Rango normal: ${rango.normal.texto}`;
      case 'humedad':
        return valor < 30
          ? `🏜️ ¡ALARMA! La humedad está muy baja (${valor}${this.unidad}). ¡Niveles críticos! Rango normal: ${rango.normal.texto}`
          : `🌊 ¡ALARMA! La humedad está muy alta (${valor}${this.unidad}). ¡Niveles críticos, Prepara el Bote! Rango normal: ${rango.normal.texto}`;
      case 'presion':
        return valor < 10
          ? `📉 ¡ALARMA! La presión está muy baja (${valor}${this.unidad}). ¡Niveles críticos! Rango normal: ${rango.normal.texto}`
          : `💥 ¡ALARMA! La presión está muy alta (${valor}${this.unidad}). ¡Niveles críticos, Esto Explota en cualquier momento! Rango normal: ${rango.normal.texto}`;
      default:
        return `⚠️ ¡ALARMA! Valor crítico: ${valor}${this.unidad}`;
    }
  }

  private playAlarmSound(): void {
    try {
      const audioContext = new window.AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 3000);
    } catch (error) {
      console.error('Error al reproducir el sonido:', error);
    }
  }

  private mostrarMensaje(tipo: string, mensaje: string): void {
    const config: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
      verticalPosition: 'bottom' as MatSnackBarVerticalPosition,
      panelClass: tipo === 'error' ? ['snackbar-error'] : 
                  tipo === 'warning' ? ['snackbar-warning'] : 
                  ['snackbar-success']
    };

    // Reproducir sonido para errores y alarmas
    if (tipo === 'error') {
      this.playAlarmSound();
    }

    this.snackBar.open(mensaje, 'Cerrar', config);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../environments/environment';

interface FormField {
  name: string;
  type: string;
  label?: string;
  value?: any;
  placeholder?: string;
  min?: number;
  max?: number;
}

interface ApiEndpoint {
  name: string;
  method: string;
  path: string;
  description: string;
  showTestPanel?: boolean;
  testBody?: string;
  testResponse?: any;
  formFields?: FormField[];
}

interface ApiGroup {
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
}

interface SensorDto {
  idBiodigestor: number;
  fechaHora: string;
  valorLectura: number;
}

@Component({
  selector: 'app-api-endpoints',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="endpoints-container">
      <h2>Panel de Control de API</h2>
      
      <mat-accordion>
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              Simulador de Valores
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div class="endpoint-grid">
            <mat-card *ngFor="let endpoint of groups[0].endpoints" class="endpoint-card">
              <mat-card-header>
                <div [class]="'method-badge ' + endpoint.method.toLowerCase()">
                  {{endpoint.method}}
                </div>
                <mat-card-title>{{endpoint.path}}</mat-card-title>
                <mat-card-subtitle>{{endpoint.description}}</mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <div *ngIf="endpoint.formFields" class="form-fields">
                  <div *ngFor="let field of endpoint.formFields" class="form-field">
                    <mat-form-field appearance="fill">
                      <mat-label>{{field.label}}</mat-label>
                      <input matInput
                             [type]="field.type"
                             [(ngModel)]="field.value"
                             [min]="field.min"
                             [max]="field.max">
                    </mat-form-field>
                  </div>
                </div>

                <button mat-raised-button color="primary" 
                        (click)="testEndpoint(endpoint)"
                        class="test-button">
                  Probar Endpoint
                </button>

                <div *ngIf="endpoint.showTestPanel" class="test-panel">
                  <div *ngIf="endpoint.testResponse" class="response-panel">
                    <h4>Respuesta:</h4>
                    <pre>{{endpoint.testResponse | json}}</pre>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .endpoints-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .endpoint-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px 0;
    }

    .endpoint-card {
      margin-bottom: 20px;
    }

    .method-badge {
      padding: 4px 8px;
      border-radius: 4px;
      color: white;
      font-weight: bold;
      margin-right: 10px;
    }

    .post { background-color: #49cc90; }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1rem 0;
    }

    .form-field {
      width: 100%;
    }

    .form-field mat-form-field {
      width: 100%;
    }

    .test-button {
      margin-top: 1rem;
    }

    .test-panel {
      margin-top: 15px;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .response-panel {
      margin-top: 10px;
    }

    .response-panel pre {
      background-color: #fff;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
  `]
})
export class ApiEndpointsComponent implements OnInit {
  groups: ApiGroup[] = [
    {
      name: 'Simulador de Valores',
      description: 'Endpoints para el simulador de valores',
      endpoints: [
        {
          name: 'Temperatura',
          method: 'POST',
          path: '/api/SimuladorDeValores/sensor-temperatura/{idSensor}',
          description: 'Rango normal: 30°C - 45°C\nAlerta: 45°C - 60°C\nAlarma: > 60°C\nBaja temperatura (Alerta): < 30°C',
          showTestPanel: false,
          testBody: JSON.stringify({
            idBiodigestor: 1,
            fechaHora: new Date().toISOString(),
            valorLectura: 35
          }),
          formFields: [
            { name: 'idSensor', type: 'number', label: 'ID del Sensor', value: 1 },
            { name: 'idBiodigestor', type: 'number', label: 'ID del Biodigestor', value: 1 },
            { name: 'valorLectura', type: 'number', label: 'Temperatura (°C)', min: 0, max: 100, value: 35 }
          ]
        },
        {
          name: 'Presión',
          method: 'POST',
          path: '/api/SimuladorDeValores/sensor-presion/{idSensor}',
          description: 'Rango normal: 14 - 22 PSI\nAlerta: 22 - 25 PSI\nAlarma: > 25 PSI\nBaja presión (Alerta): < 14 PSI',
          showTestPanel: false,
          testBody: JSON.stringify({
            idBiodigestor: 1,
            fechaHora: new Date().toISOString(),
            valorLectura: 18
          }),
          formFields: [
            { name: 'idSensor', type: 'number', label: 'ID del Sensor', value: 1 },
            { name: 'idBiodigestor', type: 'number', label: 'ID del Biodigestor', value: 1 },
            { name: 'valorLectura', type: 'number', label: 'Presión (PSI)', min: 0, max: 30, value: 18 }
          ]
        },
        {
          name: 'Humedad',
          method: 'POST',
          path: '/api/SimuladorDeValores/sensor-humedad/{idSensor}',
          description: 'Rango normal: 40% - 60%\nAlerta: 60% - 70%\nAlarma: > 70%\nBaja humedad (Alerta): < 40%',
          showTestPanel: false,
          testBody: JSON.stringify({
            idBiodigestor: 1,
            fechaHora: new Date().toISOString(),
            valorLectura: 50
          }),
          formFields: [
            { name: 'idSensor', type: 'number', label: 'ID del Sensor', value: 1 },
            { name: 'idBiodigestor', type: 'number', label: 'ID del Biodigestor', value: 1 },
            { name: 'valorLectura', type: 'number', label: 'Humedad (%)', min: 0, max: 100, value: 50 }
          ]
        }
      ]
    }
  ];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  toggleTestPanel(endpoint: ApiEndpoint): void {
    endpoint.showTestPanel = !endpoint.showTestPanel;
  }

  testEndpoint(endpoint: ApiEndpoint): void {
    const data: SensorDto = {
      idBiodigestor: endpoint.formFields?.find(f => f.name === 'idBiodigestor')?.value || 1,
      fechaHora: new Date().toISOString(),
      valorLectura: endpoint.formFields?.find(f => f.name === 'valorLectura')?.value || 0
    };

    const idSensor = endpoint.formFields?.find(f => f.name === 'idSensor')?.value || 1;
    const url = `${environment.apiUrl}${endpoint.path.replace('{idSensor}', idSensor.toString())}`;

    this.http.post(url, data).subscribe({
      next: (response) => {
        endpoint.testResponse = response;
        endpoint.showTestPanel = true;
        this.showMessage('Prueba exitosa', 'success');
      },
      error: (error) => {
        endpoint.testResponse = error;
        endpoint.showTestPanel = true;
        this.showMessage('Error en la prueba', 'error');
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'warning' | 'error'): void {
    const config = {
      duration: 5000,
      horizontalPosition: 'center' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${type}`]
    };
    this.snackBar.open(message, 'Cerrar', config);
  }
}

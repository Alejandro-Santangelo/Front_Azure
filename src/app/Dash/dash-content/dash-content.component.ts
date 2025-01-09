import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-dash-content',
  template: `
    <div class="dashboard-content">
      <h1 class="dashboard-title">Panel de Control</h1>
      <p class="dashboard-subtitle">Bienvenido al sistema de gestión de biodigestores</p>

      <div class="dashboard-grid">
        <!-- Card de Testeo de Sensores -->
        <mat-card class="dashboard-card" *ngIf="hasRole(['Manager', 'Tecnico'])">
          <mat-card-content>
            <div class="card-header">
              <mat-icon class="card-icon">sensors</mat-icon>
              <div class="card-text">
                <h2>Testeo de Sensores</h2>
                <p>Monitoreo y prueba de sensores</p>
              </div>
            </div>
            <p class="card-description">
              Realiza pruebas y monitorea el estado de los sensores del sistema.
            </p>
            <button mat-raised-button color="primary" (click)="navigateTo('testeo-sensores')">
              <mat-icon>play_arrow</mat-icon>
              Iniciar Testeo
            </button>
          </mat-card-content>
        </mat-card>

        <!-- Aquí puedes agregar más cards -->
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-title {
      font-size: 24px;
      margin: 0;
      color: #1a237e;
    }

    .dashboard-subtitle {
      color: #666;
      margin: 8px 0 24px 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .dashboard-card {
      height: 100%;
      border-radius: 8px;
      transition: transform 0.2s;
      max-width: 400px;
    }

    .dashboard-card:hover {
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .card-icon {
      font-size: 32px;
      height: 32px;
      width: 32px;
      color: #1976d2;
    }

    .card-text h2 {
      margin: 0;
      font-size: 20px;
      color: #1a237e;
    }

    .card-text p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .card-description {
      margin: 0 0 16px 0;
      color: #444;
      font-size: 14px;
    }

    button {
      width: 100%;
    }

    button mat-icon {
      margin-right: 8px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class DashContentComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  navigateTo(route: string) {
    this.router.navigate(['dash', route]);
  }

  hasRole(roles: string[]): boolean {
    return this.authService.hasRole(roles);
  }
}

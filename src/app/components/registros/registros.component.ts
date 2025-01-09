import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RegistrosService } from '../../services/registros.service';
import { Registro } from '../../models/registro.interface';

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['fecha', 'temperatura', 'presion', 'humedad', 'observaciones', 'acciones'];
  dataSource = new MatTableDataSource<Registro>();
  filtroFechaInicio?: Date;
  filtroFechaFin?: Date;

  constructor(
    private registrosService: RegistrosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargarRegistros();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarRegistros() {
    const filtro = {
      fechaInicio: this.filtroFechaInicio,
      fechaFin: this.filtroFechaFin
    };

    this.registrosService.getRegistros(filtro).subscribe({
      next: (registros) => {
        this.dataSource.data = registros;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar los registros', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  aplicarFiltro() {
    this.cargarRegistros();
  }

  limpiarFiltros() {
    this.filtroFechaInicio = undefined;
    this.filtroFechaFin = undefined;
    this.cargarRegistros();
  }

  nuevoRegistro() {
    // Aquí implementaremos el diálogo para nuevo registro
  }

  editarRegistro(registro: Registro) {
    // Aquí implementaremos la edición de registro
  }

  eliminarRegistro(registro: Registro) {
    // Aquí implementaremos la eliminación de registro
  }
}

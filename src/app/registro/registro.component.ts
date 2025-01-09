import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]
    });

    // Suscribirse a los cambios del formulario para debug
    this.registroForm.valueChanges.subscribe(value => {
      console.log('Form values:', value);
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      dni: [null, [Validators.required]]
    });

    // Mantener los valores anteriores al cambiar entre campos
    this.registroForm.valueChanges.subscribe(values => {
      Object.keys(values).forEach(key => {
        const control = this.registroForm.get(key);
        const currentValue = values[key];
        
        if (control && currentValue !== null && currentValue !== undefined && currentValue !== '') {
          control.setValue(currentValue, { emitEvent: false });
        }
      });
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      console.log('Form submitted:', this.registroForm.value);
      const userData = {
        username: this.registroForm.get('username')?.value,
        email: this.registroForm.get('email')?.value,
        password: this.registroForm.get('password')?.value,
        dni: Number(this.registroForm.get('dni')?.value)
      };

      this.http.post('http://localhost:5068/Auth/register', userData)
        .subscribe({
          next: (response) => {
            this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
            this.errorMessage = '';
            
            // Limpiar el formulario solo después de un registro exitoso
            this.registroForm.reset();
            
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Error en el registro. Por favor, intente nuevamente.';
            this.successMessage = '';
          }
        });
    } else {
      this.markFormGroupTouched(this.registroForm);
    }
  }

  // Prevenir la pérdida de datos al tocar un campo
  onFieldFocus(fieldName: string): void {
    const control = this.registroForm.get(fieldName);
    if (control) {
      const currentValue = control.value;
      if (currentValue) {
        control.setValue(currentValue, { emitEvent: false });
      }
    }
  }

  cancelarRegistro(): void {
    this.registroForm.reset();  // Limpiar el formulario
    this.router.navigate(['']); // Redirigir a la página principal
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

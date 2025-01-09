import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preguntas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntas.component.html',
  styleUrl: './preguntas.component.css'
})
export class PreguntasComponent {
  preguntas = [
    {
      titulo: '',
      pregunta: '¿Cómo funciona un biodigestor?',
      respuestas: ['Un biodigestor es un sistema que convierte residuos orgánicos en biogás y fertilizante.']
    },
    {
      titulo: '',
      pregunta: '¿Qué mantenimiento requiere un biodigestor?',
      respuestas: ['El mantenimiento regular incluye limpieza y verificación de componentes.']
    },
    {
      titulo: '',
      pregunta: '¿¿Cómo puedo ahorrar dinero al usar un biodigestor?',
      respuestas: ['Al producir tu propio biogás, puedes reducir significativamente tus gastos en gas y electricidad. Además, el fertilizante orgánico obtenido puede reducir tus costos en productos agrícolas.']
    },
    {
      titulo: '',
      pregunta: '¿ ¿Cómo contribuye un biodigestor a cuidar el medio ambiente?',
      respuestas: ['Los biodigestores reducen la emisión de gases de efecto invernadero, disminuyen la cantidad de residuos orgánicos en los vertederos y promueven la economía circular.']
    },
    {
      titulo: '',
      pregunta: '¿Dónde puedo instalar un biodigestor?',
      respuestas: ['Los biodigestores pueden instalarse en granjas, hogares, industrias alimentarias, etc. La ubicación dependerá del tamaño del biodigestor y de la cantidad de residuos disponibles.']
    },
    {
      titulo: '',
      pregunta: '¿Qué tipo de residuos puedo utilizar en un biodigestor?',
      respuestas: [' Los biodigestores pueden procesar una amplia variedad de residuos orgánicos, como excrementos de animales, restos de comida, cultivos y residuos agrícolas.']
    },
    
  ];

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['']);
  }
}
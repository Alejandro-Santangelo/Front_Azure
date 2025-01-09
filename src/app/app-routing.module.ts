

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { PreguntasComponent } from './preguntas/preguntas.component'; // Importa el componente PreguntasFrecuentesComponent

const routes: Routes = [
  { path: 'clientes', component: ClientesComponent },
  { path: 'preguntas', component: PreguntasComponent }, // Agrega la ruta para PreguntasFrecuentesComponent
  { path: '', redirectTo: '/clientes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
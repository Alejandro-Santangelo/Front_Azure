import { Routes } from '@angular/router';
import { DashBoardComponent } from './Dash/dash-board/dash-board.component';
import { DashContentComponent } from './Dash/dash-content/dash-content.component';
import { FacturaComponent } from './factura/factura.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LoginComponent } from './login/login.component';
import { QuienesSOmos01Component } from './QuienesSomos/quienes-somos01/quienes-somos01.component';
import { RegistroComponent } from './registro/registro.component';
import { HomePageComponent } from './shared/home-page/home-page.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { UsuariosRegistradosComponent } from './components/usuarios-registrados/usuarios-registrados.component';
import { ForumComponent } from './forum/forum.component';
import { RegistrosComponent } from './components/registros/registros.component';
import { TesteoSensoresComponent } from './components/testeo-sensores/testeo-sensores.component';
import { PreguntasComponent } from './preguntas/preguntas.component';  

export const routes: Routes = [
  { 
    path: '', 
    component: HomePageComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'registro', 
    component: RegistroComponent 
  },
  { 
    path: 'dash', 
    component: DashBoardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashContentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        canActivate: [RoleGuard],
        data: { roles: ['Manager', 'Administracion'] }
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        canActivate: [RoleGuard],
        data: { roles: ['Administracion'] }
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
        canActivate: [RoleGuard],
        data: { roles: ['Manager', 'Administracion', 'Tecnico'] }
      },
      {
        path: 'clientes',
        component: ClientesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Manager'] }
      },
      {
        path: 'usuarios-registrados',
        component: UsuariosRegistradosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Manager'] }
      },
      {
        path: 'testeo-sensores',
        component: TesteoSensoresComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Manager', 'Tecnico'] }
      },
      {
        path: 'factura',
        component: FacturaComponent
      },
      {
        path: 'testeo-sensores',
        component: TesteoSensoresComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Manager', 'Tecnico'] }
      }
    ]
  },
  { 
    path: 'quienes-somos', 
    component: QuienesSOmos01Component 
  },
  { 
    path: 'unauthorized', 
    component: UnauthorizedComponent 
  },
  { 
    path: 'forum', 
    component: ForumComponent 
  },
  { 
    path: 'preguntas', 
    component: PreguntasComponent 
  },
  {   
    path: '**', 
    redirectTo: '' 
  }
];

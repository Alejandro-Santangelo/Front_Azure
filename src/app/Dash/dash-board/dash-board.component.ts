import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { MenuItem } from '../../models/menu-item.interface';
import { MENU_ITEMS } from '../../config/menu-items.config';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CambiarCredencialesComponent } from '../../components/cambiar-credenciales/cambiar-credenciales.component';
import { FotoPerfilComponent } from '../../components/foto-perfil/foto-perfil.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, FotoPerfilComponent],
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit, OnDestroy {
  userRol: string | null = '';
  username: string | null = '';
  menuItems: MenuItem[] = [];
  private isBrowser: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Verificar si hay sesión activa
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
        return;
      }

      const userInfo = this.authService.getUserInfo();
      this.userRol = userInfo.rol || '';
      this.username = userInfo.username || '';
      console.log('UserInfo loaded:', { username: this.username, rol: this.userRol });

      // Filtrar elementos del menú según el rol
      this.updateMenuItems(this.userRol);

      // Suscribirse a cambios en el rol y username
      this.subscriptions.push(
        this.authService.userRole$.subscribe(rol => {
          console.log('Rol updated from service:', rol);
          this.userRol = rol;
          this.updateMenuItems(rol || '');
        })
      );

      this.subscriptions.push(
        this.authService.username$.subscribe(username => {
          console.log('Username updated from service:', username);
          this.username = username;
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateMenuItems(userRol: string | null) {
    if (!userRol) {
      this.menuItems = [];
      return;
    }

    // Filtrar los elementos del menú según el rol del usuario
    this.menuItems = MENU_ITEMS.filter(item => {
      return item.roles.includes(userRol);
    });

    console.log('Menu items updated for role:', userRol, this.menuItems);
  }

  setActiveMenuItem(route: string) {
    this.menuItems = this.menuItems.map(item => ({
      ...item,
      active: item.route === route
    }));
  }

  abrirModalCredenciales() {
    const dialogRef = this.dialog.open(CambiarCredencialesComponent, {
      width: '400px',
      data: { username: this.username }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Credenciales actualizadas');
      }
    });
  }

  logout() {
    if (this.isBrowser) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}

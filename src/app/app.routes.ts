// src/app/app.routes.ts
import { Routes } from '@angular/router';
// Solo importamos NotFoundComponent porque es el único que no se carga perezosamente
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { privateGuard, publicGuard } from './guards/guards.guard';

export const routes: Routes = [
  // 1. Ruta de inicio: El login
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige la ruta raíz a /login

  // 2. Rutas de autenticación (Carga perezosa de los componentes de autenticación)
  {
    canActivate: [publicGuard()],
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    canActivate: [publicGuard()],
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    canActivate: [publicGuard()],
    path: 'recovery',
    loadComponent: () =>
      import('./pages/recovery/recovery.component').then(
        (m) => m.RecoveryComponent
      ),
  },

  // 3. Ruta para el Dashboard y sus hijos (contenido principal de la aplicación)
  {

    path: 'dashboard',
    // Carga perezosa del componente Dashboard (layout principal)
    loadComponent: () =>
      import('./layouts/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [privateGuard()],
    children: [
      // Rutas hijas que también se cargarán perezosamente
      {
        path: 'inventario',
        loadComponent: () =>
          import('./pages/inventario/inventario.component').then(
            (m) => m.InventarioComponent
          ),
      },
      {
        path: 'facturas',
        loadComponent: () =>
          import('./pages/facturas/facturas.component').then(
            (m) => m.FacturasComponent
          ),
      },
      {
        path: 'proveedores',
        loadComponent: () =>
          import('./pages/proveedores/proveedores.component').then(
            (m) => m.ProveedoresComponent
          ),
      },
      {
        path: 'sucursales',
        loadComponent: () =>
          import('./pages/sucursales/sucursales.component').then(
            (m) => m.SucursalesComponent
          ),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./pages/contacto/contacto.component').then(
            (m) => m.ContactoComponent
          ),
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./pages/configuracion/configuracion.component').then(
            (m) => m.ConfiguracionComponent
          ),
      },

      // Si quieres una página de inicio específica dentro del dashboard (por ejemplo, al entrar a /dashboard)
      {canActivateChild: [privateGuard()], path: '', redirectTo: 'facturas', pathMatch: 'full' }, // /dashboard redirige a /dashboard/facturas
    ],
  },

  // 4. Ruta 404 (Not Found) - Esta debe ser la ÚLTIMA ruta en tu array
  { path: '**', component: NotFoundComponent }, // Cualquier otra URL no definida va aquí
];

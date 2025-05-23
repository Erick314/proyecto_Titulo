// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { InventarioComponent } from './pages/inventario/inventario.component'; // Si se usa individualmente
import { FacturasComponent } from './pages/facturas/facturas.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { SucursalesComponent } from './pages/sucursales/sucursales.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  // 1. Ruta de inicio: El login
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige la ruta raíz a /login

  // 2. Rutas de autenticación (no usan el DashboardComponent)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recovery', component: RecoveryComponent },

  // 3. Ruta para el Dashboard y sus hijos (contenido principal de la aplicación)
  // Puedes usar 'dashboard' como path, o 'app', o cualquier otra cosa que tenga sentido
  {
    path: 'dashboard', // Ahora el dashboard se cargará bajo /dashboard
    component: DashboardComponent,
    children: [
      // Rutas que estarán dentro del DashboardComponent (con navbar, etc.)
      { path: 'inventario', component: InventarioComponent },
      { path: 'facturas', component: FacturasComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'sucursales', component: SucursalesComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      // Si quieres una página de inicio específica dentro del dashboard
      { path: '', redirectTo: 'facturas', pathMatch: 'full' }, // /dashboard redirige a /dashboard/facturas
      // { path: 'inventario', component: InventarioComponent }, // Si Inventario va aquí
    ],
  },

  // 4. Rutas para Inventario (si es una página independiente, no dentro del dashboard)
  // Si InventarioComponent es parte del dashboard, múévelo dentro de 'children' de 'dashboard'.
  // Si es una página separada, como un reporte especial, déjalo aquí.
  // { path: 'inventario', component: InventarioComponent },

  // 5. Ruta comodín para cualquier otra URL no definida
  // Después de definir todas las rutas, cualquier URL que no coincida será redirigida al login
  // 4. Ruta 404 (Not Found) - Esta debe ser la ÚLTIMA ruta en tu array
  { path: '**', component: NotFoundComponent }, // Cualquier otra URL no definida va aquí
];

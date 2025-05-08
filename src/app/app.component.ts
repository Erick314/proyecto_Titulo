import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Inventario';

  constructor(public router: Router) {}

  hideNavbarRoutes = ['/', '/register', '/recovery'];

  get showNavbar(): boolean {
    return !this.hideNavbarRoutes.includes(this.router.url);
  }
}

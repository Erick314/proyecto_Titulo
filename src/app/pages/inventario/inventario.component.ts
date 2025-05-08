import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
})
export class InventarioComponent {
  productos = [
    {
      nombre: 'COLA DE MONO CAPEL',
      stock: 25,
      detalles: '',
    },
    { nombre: '', stock: '', detalles: '' },
    { nombre: '', stock: '', detalles: '' },
  ];
}

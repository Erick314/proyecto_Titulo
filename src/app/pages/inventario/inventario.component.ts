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

  selectedProducto: any = null;
  validationError = '';

  abrirEditor(producto: any) {
    this.selectedProducto = { ...producto }; // copia
    this.validationError = '';
  }

  cerrarEditor() {
    this.selectedProducto = null;
    this.validationError = '';
  }

  guardarProducto() {
    if (!this.selectedProducto.nombre || this.selectedProducto.stock === '') {
      this.validationError =
        'Todos los campos obligatorios deben estar completos.';
      return;
    }

    const index = this.productos.findIndex(
      (p) => p.nombre === this.selectedProducto.nombre
    );

    if (index !== -1) {
      this.productos[index] = { ...this.selectedProducto };
    }

    this.cerrarEditor();
  }

  incrementarStock(producto: any) {
    producto.stock++;
  }

  decrementarStock(producto: any) {
    if (producto.stock > 0) {
      producto.stock--;
    }
  }
  //esto guarda la variables de forma local pero tengo mis dudas al respecto ******************* modificar con BD

  guardarProductofila(productoParaGuardar: any) {
    // Encontramos el índice del producto en el array 'productos'
    const index = this.productos.findIndex(
      (p) => p.nombre === productoParaGuardar.nombre
    );

    if (index !== -1) {
      // Actualizamos el objeto en el array 'productos' con los valores del
      // 'productoParaGuardar'. Esto simula la persistencia local.
      this.productos[index] = { ...productoParaGuardar };
      console.log(
        `Producto "${productoParaGuardar.nombre}" guardado localmente.`
      );
    } else {
      console.log(
        `No se encontró el producto "${productoParaGuardar.nombre}" para guardar.`
      );
    }
  }
}

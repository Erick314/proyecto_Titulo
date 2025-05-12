import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

interface Movimiento {
  cantidad: number;
  tipo: 'ENTRADA' | 'SALIDA';
  fecha: Date;
}

interface ProductoConHistorial {
  id: number;
  nombre: string;
  descripcion: string;
  historialMovimientos: Movimiento[];
  stock?: number;
  detalles?: string;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
})
export class InventarioComponent {
  productos: ProductoConHistorial[] = [
    {
      id: 1,
      nombre: 'COLA DE MONO CAPEL',
      descripcion:
        'El Campanario Cola de Mono 700cc es una deliciosa bebida navideña típica de Chile, perfecta para compartir en familia y amigos durante las fiestas de fin de año. Esta bebida se elabora con pisco chileno, leche condensada, canela y café, lo que le da un sabor único y delicioso.Con su tamaño de 700cc, el Campanario Cola de Mono es ideal para compartir en reuniones y celebraciones. Además, su presentación en una botella de vidrio con un diseño elegante y festivo lo convierte en un regalo perfecto para cualquier amante de las bebidas navideñas.Sorprende a tus seres queridos con el delicioso sabor del Campanario Cola de Mono 700cc y disfruta de una Navidad llena de alegría y sabor.',
      historialMovimientos: [
        { cantidad: 20, tipo: 'ENTRADA', fecha: new Date('2025-05-10') },
        { cantidad: 50, tipo: 'ENTRADA', fecha: new Date('2025-05-05') },
        { cantidad: 30, tipo: 'SALIDA', fecha: new Date('2025-05-11') },
      ],
      stock: 25, // Añadimos la propiedad stock
      detalles: '', // Añadimos la propiedad detalles
    },
    {
      id: 2,
      nombre: 'PISCO BAUZA',
      descripcion: 'Pisco chileno de alta calidad, ideal para cócteles.',
      historialMovimientos: [],
      stock: 15, // Añadimos la propiedad stock
      detalles: '750cc', // Añadimos la propiedad detalles
    },
    {
      id: 3,
      nombre: 'RON PAMPERO',
      descripcion:
        'Ron venezolano añejo, perfecto para disfrutar solo o en mezclas.',
      historialMovimientos: [],
      stock: 30, // Añadimos la propiedad stock
      detalles: 'Carta Oro', // Añadimos la propiedad detalles
    },
  ];
  //flags para el popup de confirmación
  productoSeleccionado: ProductoConHistorial | null = null;
  mostrarModalConfirmacion = false;
  productoAConfirmar: any = null;
  selectedProducto: any = null;
  validationError = '';

  displayedColumns: string[] = ['cantidad', 'tipo', 'fecha'];
  dataSource: MatTableDataSource<Movimiento> =
    new MatTableDataSource<Movimiento>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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

  solicitarConfirmacionGuardado(producto: any) {
    this.productoAConfirmar = { ...producto }; // Guarda una copia para no modificar directamente la lista
    this.mostrarModalConfirmacion = true;
  }

  confirmarGuardado() {
    if (this.productoAConfirmar) {
      const index = this.productos.findIndex(
        (p) => p.id === this.productoAConfirmar.id
      );
      if (index !== -1) {
        this.productos[index] = { ...this.productoAConfirmar }; // Actualiza con la copia
        console.log(`Producto "${this.productoAConfirmar.nombre}" guardado.`);
        this.cerrarModalConfirmacion();
        // Aquí podrías llamar a tu servicio para guardar en el backend si lo tuvieras
      }
    }
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.productoAConfirmar = null;
  }

  mostrarHistorial(productoId: number) {
    this.productoSeleccionado =
      this.productos.find((p) => p.id === productoId) || null;
    if (this.productoSeleccionado?.historialMovimientos) {
      this.dataSource = new MatTableDataSource<Movimiento>(
        this.productoSeleccionado.historialMovimientos
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource<Movimiento>([]); // Especificamos el tipo genérico
    }
  }

  cerrarHistorial() {
    this.productoSeleccionado = null;
  }
}

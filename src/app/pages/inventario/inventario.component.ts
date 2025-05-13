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
  mensajeConfirmacion = ''; // Nuevo mensaje para el popup
  productoAEliminar: any = null; // Producto a eliminar
  nuevoProducto: { nombre: string; stock: number | null; descripcion: string } =
    { nombre: '', stock: null, descripcion: '' };
  mostrarModalNuevoProducto = false; // Nueva propiedad para controlar el modal de nuevo producto

  displayedColumns: string[] = ['cantidad', 'tipo', 'fecha'];
  dataSource: MatTableDataSource<Movimiento> =
    new MatTableDataSource<Movimiento>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Funciones de incrementar y decrementar con los simbolos

  incrementarStock(producto: any) {
    producto.stock++;
  }

  decrementarStock(producto: any) {
    if (producto.stock > 0) {
      producto.stock--;
    }
  }

  abrirEditor(producto: any) {
    this.selectedProducto = { ...producto }; // copia
    this.validationError = '';
  }

  cerrarEditor() {
    this.selectedProducto = null;
    this.validationError = '';
  }

  guardarProducto() {
    if (
      !this.selectedProducto.nombre ||
      this.selectedProducto.stock === null ||
      this.selectedProducto.stock === undefined
    ) {
      this.validationError =
        'Todos los campos obligatorios deben estar completos.';
      return;
    }
    this.productoAConfirmar = {
      id: this.selectedProducto.id,
      ...this.selectedProducto,
    }; // Guardamos el id y los cambios
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN ${this.selectedProducto.nombre}?`;
    this.mostrarModalConfirmacion = true;
    this.cerrarEditor(); // Cerramos el editor después de solicitar la confirmación
  }

  //esto guarda la variables de forma local pero tengo mis dudas al respecto ******************* modificar con BD

  guardarProductofila(productoParaGuardar: any) {
    const index = this.productos.findIndex(
      (p) => p.nombre === productoParaGuardar.nombre
    );
    if (index !== -1) {
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

  //Esto es para el botón de guardar pero al no tener bd no se si funciona
  solicitarConfirmacionGuardado(producto: any) {
    this.productoAConfirmar = { ...producto };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN ${producto.nombre}?`;
    this.mostrarModalConfirmacion = true;
    this.productoAEliminar = null;
  }

  confirmarGuardado() {
    if (this.productoAConfirmar) {
      const index = this.productos.findIndex(
        (p) => p.id === this.productoAConfirmar.id
      );
      if (index !== -1) {
        this.productos[index] = { ...this.productoAConfirmar };
        this.productosFiltrados = [...this.productos]; // Actualiza la lista filtrada
        console.log(`Producto "${this.productoAConfirmar.nombre}" guardado.`);
        this.cerrarModalConfirmacion();
      } else {
        console.log(
          `No se encontró el producto con ID ${this.productoAConfirmar.id} para actualizar.`
        );
      }
    }
  }

  //Funciones de eliminar

  solicitarConfirmacionEliminar(producto: any) {
    this.productoAEliminar = { ...producto };
    this.mensajeConfirmacion = `¿DESEA ELIMINAR EL PRODUCTO "${producto.nombre}"?`;
    this.mostrarModalConfirmacion = true;
    this.productoAConfirmar = null; // Aseguramos que la variable de guardar esté nula
  }

  confirmarEliminar() {
    if (this.productoAEliminar) {
      const index = this.productos.findIndex(
        (p) => p.id === this.productoAEliminar.id
      );
      if (index !== -1) {
        this.productos.splice(index, 1);
        this.productosFiltrados = [...this.productos]; // Actualiza la lista filtrada
        console.log(`Producto "${this.productoAEliminar.nombre}" eliminado.`);
        if (this.productoSeleccionado?.id === this.productoAEliminar.id) {
          this.cerrarHistorial();
        }
      }
    }
    this.cerrarModalConfirmacion();
    this.productoAEliminar = null; // Limpiamos la variable después de la acción
  }

  confirmarAccion() {
    if (this.productoAConfirmar) {
      this.confirmarGuardado();
    } else if (this.productoAEliminar) {
      this.confirmarEliminar(); // Llama al nuevo método de eliminación
    }
  }

  guardarCambiosConfirmados() {
    if (this.productoAConfirmar) {
      const index = this.productos.findIndex(
        (p) => p.id === this.productoAConfirmar.id
      );
      if (index !== -1) {
        this.productos[index] = { ...this.productoAConfirmar };
        console.log(`Producto "${this.productoAConfirmar.nombre}" guardado.`);
        this.cerrarModalConfirmacion();
      }
    }
  }

  eliminarProductoConfirmado() {
    if (this.productoAEliminar) {
      const index = this.productos.findIndex(
        (p) => p.id === this.productoAEliminar.id
      );
      if (index !== -1) {
        this.productos.splice(index, 1);
        console.log(`Producto "${this.productoAEliminar.nombre}" eliminado.`);
        if (this.productoSeleccionado?.id === this.productoAEliminar.id) {
          this.cerrarHistorial();
        }
      }
    }
    this.cerrarModalConfirmacion();
  }

  eliminarProducto(productoAEliminar: any) {
    const index = this.productos.findIndex(
      (p) => p.id === productoAEliminar.id
    );
    if (index !== -1) {
      this.productos.splice(index, 1);
      console.log(`Producto "${productoAEliminar.nombre}" eliminado.`);
      // Si la tabla de historial está abierta para el producto eliminado, la cerramos
      if (this.productoSeleccionado?.id === productoAEliminar.id) {
        this.cerrarHistorial();
      }
    }
  }

  //Método para ver movimientos

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

  //Método para filtrar

  searchTerm: string = '';
  productosFiltrados: ProductoConHistorial[] = [...this.productos]; // Inicialmente, muestra todos los productos

  applyFilter() {
    this.productosFiltrados = this.productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        producto.detalles
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        producto.descripcion
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );
  }

  //Nuevo producto

  abrirModalNuevoProducto() {
    this.mostrarModalNuevoProducto = true;
    this.nuevoProducto = { nombre: '', stock: null, descripcion: '' }; // Resetear el formulario
  }

  cerrarModalNuevoProducto() {
    this.mostrarModalNuevoProducto = false;
  }

  agregarNuevoProducto() {
    if (this.nuevoProducto.nombre && this.nuevoProducto.stock !== null) {
      const nuevoId =
        this.productos.length > 0
          ? Math.max(...this.productos.map((p) => p.id)) + 1
          : 1;
      const nuevoProductoConHistorial: ProductoConHistorial = {
        id: nuevoId,
        nombre: this.nuevoProducto.nombre,
        descripcion: '', // Puedes dejar la descripción vacía o pedirla en otro campo si es necesario
        historialMovimientos: [
          {
            cantidad: this.nuevoProducto.stock,
            tipo: 'ENTRADA',
            fecha: new Date(),
          },
        ],
        stock: this.nuevoProducto.stock,
        detalles: this.nuevoProducto.descripcion, // Asignamos la descripción del modal a la propiedad 'detalles'
      };
      console.log('Nuevo producto a agregar:', nuevoProductoConHistorial);
      this.productos.push(nuevoProductoConHistorial);
      this.productosFiltrados = [...this.productos];
      this.cerrarModalNuevoProducto();
      console.log('Nuevo producto agregado:', nuevoProductoConHistorial);
      // Aquí podrías llamar a tu servicio para guardar en el backend
    } else {
      alert('Por favor, ingrese el nombre y la cantidad del producto.');
    }
  }
}

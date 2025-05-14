import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
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
export class InventarioComponent implements OnInit, AfterViewInit {
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
      stock: 25,
      detalles: '',
    },
    {
      id: 2,
      nombre: 'PISCO BAUZA',
      descripcion: 'Pisco chileno de alta calidad, ideal para cócteles.',
      historialMovimientos: [],
      stock: 15,
      detalles: '750cc',
    },
    {
      id: 3,
      nombre: 'RON PAMPERO',
      descripcion:
        'Ron venezolano añejo, perfecto para disfrutar solo o en mezclas.',
      historialMovimientos: [],
      stock: 30,
      detalles: 'Carta Oro',
    },
    {
      id: 4,
      nombre: 'VINO CARMENERE',
      descripcion: 'Vino tinto chileno, suave y afrutado.',
      historialMovimientos: [],
      stock: 40,
      detalles: 'Reserva',
    },
    {
      id: 5,
      nombre: 'CERVEZA ARTESANAL IPA',
      descripcion: 'Cerveza con notas amargas y cítricas.',
      historialMovimientos: [],
      stock: 20,
      detalles: 'Lúpulo Cascade',
    },
    {
      id: 6,
      nombre: 'AGUA MINERAL',
      descripcion: 'Agua purificada sin gas.',
      historialMovimientos: [],
      stock: 100,
      detalles: '500ml',
    },
    {
      id: 7,
      nombre: 'JUGO DE NARANJA',
      descripcion: 'Jugo natural de naranjas frescas.',
      historialMovimientos: [],
      stock: 35,
      detalles: '1 Litro',
    },
    {
      id: 8,
      nombre: 'GASEOSA COLA',
      descripcion: 'Refresco carbonatado sabor cola.',
      historialMovimientos: [],
      stock: 60,
      detalles: 'Lata 355ml',
    },
    {
      id: 9,
      nombre: 'SNACK PAPAS FRITAS',
      descripcion: 'Papas fritas crujientes y saladas.',
      historialMovimientos: [],
      stock: 50,
      detalles: 'Bolsa 150g',
    },
    {
      id: 10,
      nombre: 'CHOCOLATE AMARGO',
      descripcion: 'Chocolate con alto porcentaje de cacao.',
      historialMovimientos: [],
      stock: 25,
      detalles: '70% Cacao',
    },
    {
      id: 11,
      nombre: 'GALLETAS DE AVENA',
      descripcion: 'Galletas saludables con hojuelas de avena.',
      historialMovimientos: [],
      stock: 45,
      detalles: 'Paquete 200g',
    },
  ];
  productosFiltrados: ProductoConHistorial[] = [...this.productos];
  displayedColumns: string[] = ['nombre', 'stock', 'detalles', 'opciones'];
  dataSource = new MatTableDataSource<ProductoConHistorial>(
    this.productosFiltrados
  ); // Especifica el tipo
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Propiedades para el historial
  displayedColumnsHistorial: string[] = ['cantidad', 'tipo', 'fecha'];
  dataSourceHistorial = new MatTableDataSource<Movimiento>([]); // DataSource para el historial
  @ViewChild('paginatorHistorial') paginatorHistorial!: MatPaginator; // Referencia al paginador del historial
  @ViewChild('sortHistorial') sortHistorial!: MatSort; // Referencia al sort del historial

  productoSeleccionado: ProductoConHistorial | null = null;
  mostrarModalConfirmacion = false;
  productoAConfirmar: any = null;
  selectedProducto: any = null;
  validationError = '';
  mensajeConfirmacion = '';
  productoAEliminar: any = null;
  nuevoProducto: { nombre: string; stock: number | null; descripcion: string } =
    { nombre: '', stock: null, descripcion: '' };
  mostrarModalNuevoProducto = false;
  searchTerm: string = '';

  constructor() {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.productosFiltrados);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  //uso de los incrementadores y decrementadores
  incrementarStock(producto: any) {
    producto.stock++;
  }

  decrementarStock(producto: any) {
    if (producto.stock > 0) {
      producto.stock--;
    }
  }
  //Edición de productos
  abrirEditor(producto: any) {
    this.selectedProducto = { ...producto };
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
    };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN ${this.selectedProducto.nombre}?`;
    this.mostrarModalConfirmacion = true;
    this.cerrarEditor();
  }

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
        this.productosFiltrados = [...this.productos];
        this.dataSource.data = this.productosFiltrados; // Actualiza el DataSource
        console.log(`Producto "${this.productoAConfirmar.nombre}" guardado.`);
        this.cerrarModalConfirmacion();
      } else {
        console.log(
          `No se encontró el producto con ID ${this.productoAConfirmar.id} para actualizar.`
        );
      }
    }
  }
  //Eliminar
  solicitarConfirmacionEliminar(producto: any) {
    this.productoAEliminar = { ...producto };
    this.mensajeConfirmacion = `¿DESEA ELIMINAR EL PRODUCTO "${producto.nombre}"?`;
    this.mostrarModalConfirmacion = true;
    this.productoAConfirmar = null;
  }

  confirmarAccion() {
    if (this.productoAConfirmar) {
      this.confirmarGuardado();
    } else if (this.productoAEliminar) {
      this.confirmarEliminar();
    }
  }

  confirmarEliminar() {
    if (this.productoAEliminar) {
      const index = this.productos.findIndex(
        (p) => p.id === this.productoAEliminar.id
      );
      if (index !== -1) {
        this.productos.splice(index, 1);
        this.productosFiltrados = [...this.productos];
        this.dataSource.data = this.productosFiltrados; // Actualiza el DataSource
        console.log(`Producto "${this.productoAEliminar.nombre}" eliminado.`);
        if (this.productoSeleccionado?.id === this.productoAEliminar.id) {
          this.cerrarHistorial();
        }
      }
    }
    this.cerrarModalConfirmacion();
    this.productoAEliminar = null;
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

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.productoAConfirmar = null;
  }
  //Tabla de historial
  mostrarHistorial(productoId: number) {
    this.productoSeleccionado =
      this.productos.find((p) => p.id === productoId) || null;
    if (this.productoSeleccionado?.historialMovimientos) {
      this.dataSourceHistorial = new MatTableDataSource<Movimiento>(
        this.productoSeleccionado.historialMovimientos
      );
      this.dataSourceHistorial.paginator = this.paginatorHistorial; // Usa el paginador del historial
      this.dataSourceHistorial.sort = this.sortHistorial; // Usa el sort del historial
    } else {
      this.dataSourceHistorial = new MatTableDataSource<Movimiento>([]);
    }
  }

  cerrarHistorial() {
    this.productoSeleccionado = null;
  }

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
    this.dataSource.data = this.productosFiltrados; // Actualiza el DataSource con los productos filtrados
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrirModalNuevoProducto() {
    this.mostrarModalNuevoProducto = true;
    this.nuevoProducto = { nombre: '', stock: null, descripcion: '' };
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
        descripcion: '',
        historialMovimientos: [
          {
            cantidad: this.nuevoProducto.stock,
            tipo: 'ENTRADA',
            fecha: new Date(),
          },
        ],
        stock: this.nuevoProducto.stock,
        detalles: this.nuevoProducto.descripcion,
      };
      console.log('Nuevo producto a agregar:', nuevoProductoConHistorial);
      this.productos.push(nuevoProductoConHistorial);
      this.productosFiltrados = [...this.productos];
      this.dataSource.data = this.productosFiltrados; // Actualiza el DataSource
      this.cerrarModalNuevoProducto();
      console.log('Nuevo producto agregado:', nuevoProductoConHistorial);
      // Aquí podrías llamar a tu servicio para guardar en el backend
    } else {
      alert('Por favor, ingrese el nombre y la cantidad del producto.');
    }
  }
}

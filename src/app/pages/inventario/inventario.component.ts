import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  SucursalService,
  Sucursal,
} from '../../modelo/sucursal/sucursal.service';
import {
  ProductoService,
  Producto,
} from '../../modelo/producto/producto.service';
import {
  InventarioService,
  Inventario,
} from '../../modelo/inventario/inventario.service';
import {
  MovimientosService,
  MovimientoInventario,
} from '../../modelo/movimientos/movimientos.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

interface Movimiento {
  cantidad: number;
  tipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  fecha: Date;
  motivo?: string;
}

interface ProductoConHistorial {
  id: number;
  nombre: string;
  descripcion: string;
  historialMovimientos: Movimiento[];
  stock?: number;
  detalles?: string;
}

// Interfaz para mostrar en la tabla con información combinada
interface InventarioDisplay {
  id?: string;
  nombreProducto: string;
  descripcionProducto: string;
  stockActual: number;
  stockMinimo: number;
  sucursalNombre: string;
  ultimaActualizacion: Date;
  estado: string;
  detalles?: string;
  historialMovimientos?: Movimiento[];
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
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
})
export class InventarioComponent implements OnInit, AfterViewInit, OnDestroy {
  inventario: Inventario[] = [];
  inventarioDisplay: InventarioDisplay[] = [];
  inventarioFiltrado: InventarioDisplay[] = [];
  displayedColumns: string[] = [
    'sucursalNombre',
    'nombreProducto',
    'stockActual',
    'estado',
    'opciones',
  ];
  dataSource = new MatTableDataSource<InventarioDisplay>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Propiedades para el historial
  displayedColumnsHistorial: string[] = ['cantidad', 'tipo', 'fecha', 'motivo'];
  dataSourceHistorial = new MatTableDataSource<Movimiento>([]);
  @ViewChild('paginatorHistorial') paginatorHistorial!: MatPaginator;
  @ViewChild('sortHistorial') sortHistorial!: MatSort;

  productoSeleccionado: InventarioDisplay | null = null;
  mostrarModalConfirmacion = false;
  productoAConfirmar: any = null;
  selectedProducto: any = null;
  validationError = '';
  mensajeConfirmacion = '';
  productoAEliminar: any = null;
  nuevoProducto: {
    productoId: string;
    stockActual: number;
    stockMinimo: number;
    sucursalId: string;
  } = {
    productoId: '',
    stockActual: 0,
    stockMinimo: 0,
    sucursalId: '',
  };
  mostrarModalNuevoProducto = false;
  searchTerm: string = '';

  // Propiedades para el filtro de sucursal
  sucursales: Sucursal[] = [];
  productos: Producto[] = [];
  sucursalSeleccionada: string = 'todas';
  private sucursalSubscription: Subscription | null = null;
  private inventarioSubscription: Subscription | null = null;
  private productoSubscription: Subscription | null = null;
  private movimientosSubscription: Subscription | null = null;

  // Bandera para mostrar loader en historial
  cargandoHistorial: boolean = false;
  cargandoStock: { [id: string]: boolean } = {};

  constructor(
    private sucursalService: SucursalService,
    private productoService: ProductoService,
    private inventarioService: InventarioService,
    private movimientosService: MovimientosService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarSucursales();
    this.cargarProductos();
    this.cargarInventario();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.sucursalSubscription) {
      this.sucursalSubscription.unsubscribe();
    }
    if (this.inventarioSubscription) {
      this.inventarioSubscription.unsubscribe();
    }
    if (this.productoSubscription) {
      this.productoSubscription.unsubscribe();
    }
    if (this.movimientosSubscription) {
      this.movimientosSubscription.unsubscribe();
    }
  }

  // Función helper para convertir fechas de Firestore
  private convertirFechaFirestore(fechaFirestore: any): Date {
    if (!fechaFirestore) {
      return new Date();
    }
    
    // Si es un Timestamp de Firestore
    if (fechaFirestore.toDate && typeof fechaFirestore.toDate === 'function') {
      return fechaFirestore.toDate();
    }
    
    // Si ya es un objeto Date
    if (fechaFirestore instanceof Date) {
      return fechaFirestore;
    }
    
    // Si es un string o número, crear nuevo Date
    return new Date(fechaFirestore);
  }

  // Método para cargar sucursales
  private cargarSucursales() {
    this.sucursalSubscription = this.sucursalService.listar().subscribe({
      next: (sucursales) => {
        console.log('Sucursales cargadas:', sucursales);
        this.sucursales = sucursales;
      },
      error: (error) => {
        console.error('Error al cargar sucursales:', error);
      },
    });
  }

  // Método para cargar productos
  private cargarProductos() {
    this.productoSubscription = this.productoService.listar().subscribe({
      next: (productos) => {
        console.log('Productos cargados:', productos);
        this.productos = productos;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        toast.error('Error al cargar los productos');
      },
    });
  }

  // Método para cargar inventario
  private cargarInventario() {
    this.inventarioSubscription = this.inventarioService.listar().subscribe({
      next: (inventario) => {
        console.log('Inventario cargado:', inventario);
        this.inventario = inventario;
        this.convertirInventarioADisplay();
        this.actualizarDatosFiltrados();
      },
      error: (error) => {
        console.error('Error al cargar inventario:', error);
        toast.error('Error al cargar el inventario');
      },
    });
  }

  private convertirInventarioADisplay() {
    this.inventarioDisplay = this.inventario.map((item) => ({
      id: item.id,
      nombreProducto: item.producto.nombre,
      descripcionProducto: item.producto.descripcion,
      stockActual: item.cantidad,
      stockMinimo: item.stockMinimo,
      sucursalNombre: item.sucursal.nombre,
      ultimaActualizacion: this.convertirFechaFirestore(item.ultimaActualizacion),
      estado: item.estado,
      detalles: `${item.producto.cantidadUnidadMedida}${item.producto.unidadMedida}`,
      historialMovimientos: [], // Por ahora vacío, se puede implementar después
    }));
  }

  private actualizarDatosFiltrados() {
    this.inventarioFiltrado = this.filtrarInventarioPorSucursal();
    this.dataSource.data = this.inventarioFiltrado;
  }

  // Métodos para el filtro de sucursal
  onSucursalChange() {
    this.applyFilter(); // Aplicar filtro combinado de búsqueda y sucursal
  }

  private filtrarInventarioPorSucursal(
    inventarioAFiltrar?: InventarioDisplay[]
  ): InventarioDisplay[] {
    const inventarioBase = inventarioAFiltrar || this.inventarioDisplay;
    if (!this.sucursalSeleccionada || this.sucursalSeleccionada === 'todas') {
      return [...inventarioBase];
    }
    return inventarioBase.filter(
      (p) => p.sucursalNombre === this.sucursalSeleccionada
    );
  }

  // Método para actualizar automáticamente los datos del inventario
  private actualizarInventarioEnVista(inventarioId: string) {
    this.inventarioService.obtenerPorId(inventarioId).subscribe({
      next: (inventarioActualizado) => {
        if (inventarioActualizado) {
          // Actualizar el inventario en el array principal
          const indexInventario = this.inventario.findIndex(item => item.id === inventarioId);
          if (indexInventario !== -1) {
            this.inventario[indexInventario] = inventarioActualizado;
          }

          // Actualizar el inventario en el display
          const indexDisplay = this.inventarioDisplay.findIndex(item => item.id === inventarioId);
          if (indexDisplay !== -1) {
            this.inventarioDisplay[indexDisplay] = {
              id: inventarioActualizado.id,
              nombreProducto: inventarioActualizado.producto.nombre,
              descripcionProducto: inventarioActualizado.producto.descripcion,
              stockActual: inventarioActualizado.cantidad,
              stockMinimo: inventarioActualizado.stockMinimo,
              sucursalNombre: inventarioActualizado.sucursal.nombre,
              ultimaActualizacion: this.convertirFechaFirestore(inventarioActualizado.ultimaActualizacion),
              estado: inventarioActualizado.estado,
              detalles: `${inventarioActualizado.producto.cantidadUnidadMedida}${inventarioActualizado.producto.unidadMedida}`,
              historialMovimientos: this.inventarioDisplay[indexDisplay].historialMovimientos || [],
            };
          }

          // Actualizar el producto seleccionado si está abierto el historial
          if (this.productoSeleccionado && this.productoSeleccionado.id === inventarioId) {
            this.productoSeleccionado = {
              id: inventarioActualizado.id,
              nombreProducto: inventarioActualizado.producto.nombre,
              descripcionProducto: inventarioActualizado.producto.descripcion,
              stockActual: inventarioActualizado.cantidad,
              stockMinimo: inventarioActualizado.stockMinimo,
              sucursalNombre: inventarioActualizado.sucursal.nombre,
              ultimaActualizacion: this.convertirFechaFirestore(inventarioActualizado.ultimaActualizacion),
              estado: inventarioActualizado.estado,
              detalles: `${inventarioActualizado.producto.cantidadUnidadMedida}${inventarioActualizado.producto.unidadMedida}`,
              historialMovimientos: this.productoSeleccionado.historialMovimientos || [],
            };
          }

          // Actualizar los datos filtrados
          this.actualizarDatosFiltrados();
        }
      },
      error: (error) => {
        console.error('Error al actualizar inventario en vista:', error);
      }
    });
  }

  // Método simple para actualizar solo el stock en la vista
  private actualizarStockEnVista(inventarioId: string, nuevoStock: number) {
    // Actualizar en el array principal
    const indexInventario = this.inventario.findIndex(item => item.id === inventarioId);
    if (indexInventario !== -1) {
      this.inventario[indexInventario].cantidad = nuevoStock;
      this.inventario[indexInventario].ultimaActualizacion = new Date();
    }

    // Actualizar en el display
    const indexDisplay = this.inventarioDisplay.findIndex(item => item.id === inventarioId);
    if (indexDisplay !== -1) {
      this.inventarioDisplay[indexDisplay].stockActual = nuevoStock;
      this.inventarioDisplay[indexDisplay].ultimaActualizacion = new Date();
    }

    // Actualizar el producto seleccionado si está abierto el historial
    if (this.productoSeleccionado && this.productoSeleccionado.id === inventarioId) {
      this.productoSeleccionado.stockActual = nuevoStock;
      this.productoSeleccionado.ultimaActualizacion = new Date();
    }

    // Actualizar los datos filtrados
    this.actualizarDatosFiltrados();
  }

  //uso de los incrementadores y decrementadores
  incrementarStock(producto: InventarioDisplay) {
    if (producto.id && !this.cargandoStock[producto.id]) {
      this.cargandoStock[producto.id] = true;
      // Actualizar inmediatamente en la vista para mejor UX
      const stockAnterior = producto.stockActual;
      const nuevoStock = stockAnterior + 1;
      producto.stockActual = nuevoStock;

      this.inventarioService
        .incrementarCantidad(producto.id, 1, 'Incremento manual desde interfaz')
        .then(() => {
          toast.success('Stock incrementado correctamente');
          // Actualizar automáticamente el historial si está abierto
          this.actualizarHistorialEnVista(producto.id!);
          // Verificar si ahora está por encima del mínimo
          if (
            stockAnterior <= producto.stockMinimo &&
            nuevoStock > producto.stockMinimo
          ) {
            toast.success('¡Stock restaurado por encima del mínimo!');
          }
        })
        .catch((error) => {
          console.error('Error al incrementar stock:', error);
          toast.error('Error al incrementar el stock');
          // Revertir el cambio en caso de error
          producto.stockActual = stockAnterior;
        })
        .finally(() => {
          this.cargandoStock[producto.id!] = false;
        });
    }
  }

  decrementarStock(producto: InventarioDisplay) {
    if (producto.stockActual > 0 && producto.id && !this.cargandoStock[producto.id]) {
      this.cargandoStock[producto.id] = true;
      // Actualizar inmediatamente en la vista para mejor UX
      const stockAnterior = producto.stockActual;
      const nuevoStock = stockAnterior - 1;
      producto.stockActual = nuevoStock;

      this.inventarioService
        .decrementarCantidad(producto.id, 1, 'Decremento manual desde interfaz')
        .then(() => {
          toast.success('Stock decrementado correctamente');
          // Actualizar automáticamente el historial si está abierto
          this.actualizarHistorialEnVista(producto.id!);
          // Verificar si ahora está por debajo del mínimo
          if (
            stockAnterior > producto.stockMinimo &&
            nuevoStock <= producto.stockMinimo
          ) {
            toast.warning('¡Atención! Stock por debajo del mínimo');
          }
        })
        .catch((error) => {
          console.error('Error al decrementar stock:', error);
          toast.error('Error al decrementar el stock');
          // Revertir el cambio en caso de error
          producto.stockActual = stockAnterior;
        })
        .finally(() => {
          this.cargandoStock[producto.id!] = false;
        });
    } else if (producto.stockActual <= 0) {
      toast.warning('No se puede decrementar más el stock');
    }
  }

  // Método para actualizar stock directamente desde el input
  actualizarStockDirecto(producto: InventarioDisplay) {
    if (producto.id && producto.stockActual >= 0) {
      // Obtener el stock actual de la base de datos para comparar
      this.inventarioService.obtenerPorId(producto.id).subscribe({
        next: (inventario) => {
          if (inventario) {
            const stockAnterior = inventario.cantidad;
            const stockNuevo = producto.stockActual;

            // Solo actualizar si realmente cambió
            if (stockAnterior === stockNuevo) {
              return; // No hacer nada si no hay cambio
            }

            this.inventarioService
              .actualizarCantidad(
                producto.id!,
                stockNuevo,
                stockAnterior,
                'Actualización manual desde interfaz'
              )
              .then(() => {
                toast.success('Stock actualizado correctamente');
                // Actualizar automáticamente el historial si está abierto
                this.actualizarHistorialEnVista(producto.id!);

                // Verificar cambios en el estado del stock mínimo
                if (
                  stockAnterior <= producto.stockMinimo &&
                  stockNuevo > producto.stockMinimo
                ) {
                  toast.success('¡Stock restaurado por encima del mínimo!');
                } else if (
                  stockAnterior > producto.stockMinimo &&
                  stockNuevo <= producto.stockMinimo
                ) {
                  toast.warning('¡Atención! Stock por debajo del mínimo');
                }
              })
              .catch((error) => {
                console.error('Error al actualizar stock:', error);
                toast.error('Error al actualizar el stock');
                // Revertir el cambio en caso de error
                producto.stockActual = stockAnterior;
              });
          }
        },
        error: (error) => {
          console.error('Error al obtener inventario:', error);
          toast.error('Error al obtener información del inventario');
        }
      });
    } else if (producto.stockActual < 0) {
      toast.error('El stock no puede ser negativo');
      producto.stockActual = 0;
    }
  }

  //Edición de productos
  abrirEditor(producto: InventarioDisplay) {
    this.selectedProducto = { ...producto };
    this.validationError = '';
  }

  cerrarEditor() {
    this.selectedProducto = null;
    this.validationError = '';
  }

  guardarProducto() {
    if (
      !this.selectedProducto.nombreProducto ||
      this.selectedProducto.stockActual === null ||
      this.selectedProducto.stockActual === undefined
    ) {
      this.validationError =
        'Todos los campos obligatorios deben estar completos.';
      return;
    }
    this.productoAConfirmar = {
      id: this.selectedProducto.id,
      ...this.selectedProducto,
    };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN ${this.selectedProducto.nombreProducto}?`;
    this.mostrarModalConfirmacion = true;
    this.cerrarEditor();
  }

  guardarProductofila(productoParaGuardar: InventarioDisplay) {
    const index = this.inventarioDisplay.findIndex(
      (p) => p.nombreProducto === productoParaGuardar.nombreProducto
    );
    if (index !== -1) {
      this.inventarioDisplay[index] = { ...productoParaGuardar };
      console.log(
        `Producto "${productoParaGuardar.nombreProducto}" guardado localmente.`
      );
    } else {
      console.log(
        `No se encontró el producto "${productoParaGuardar.nombreProducto}" para guardar.`
      );
    }
  }

  solicitarConfirmacionGuardado(producto: InventarioDisplay) {
    this.productoAConfirmar = { ...producto };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN ${producto.nombreProducto}?`;
    this.mostrarModalConfirmacion = true;
    this.productoAEliminar = null;
  }

  confirmarGuardado() {
    if (this.productoAConfirmar) {
      const index = this.inventarioDisplay.findIndex(
        (p) => p.id === this.productoAConfirmar.id
      );
      if (index !== -1) {
        this.inventarioDisplay[index] = { ...this.productoAConfirmar };
        this.actualizarDatosFiltrados();
        console.log(
          `Producto "${this.productoAConfirmar.nombreProducto}" guardado.`
        );
        this.cerrarModalConfirmacion();
      } else {
        console.log(
          `No se encontró el producto con ID ${this.productoAConfirmar.id} para actualizar.`
        );
      }
    }
  }

  //Eliminar
  solicitarConfirmacionEliminar(producto: InventarioDisplay) {
    this.productoAEliminar = { ...producto };
    this.mensajeConfirmacion = `¿DESEA ELIMINAR EL PRODUCTO "${producto.nombreProducto}"?`;
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
    if (this.productoAEliminar && this.productoAEliminar.id) {
      this.inventarioService
        .eliminar(this.productoAEliminar.id)
        .then(() => {
          const index = this.inventarioDisplay.findIndex(
            (p) => p.id === this.productoAEliminar.id
          );
          if (index !== -1) {
            this.inventarioDisplay.splice(index, 1);
            this.actualizarDatosFiltrados();
            console.log(
              `Producto "${this.productoAEliminar.nombreProducto}" eliminado.`
            );
            if (this.productoSeleccionado?.id === this.productoAEliminar.id) {
              this.cerrarHistorial();
            }
          }
          toast.success('Producto eliminado correctamente');
        })
        .catch((error) => {
          console.error('Error al eliminar producto:', error);
          toast.error('Error al eliminar el producto');
        });
    }
    this.cerrarModalConfirmacion();
    this.productoAEliminar = null;
  }

  guardarCambiosConfirmados() {
    if (this.productoAConfirmar) {
      const index = this.inventarioDisplay.findIndex(
        (p) => p.id === this.productoAConfirmar.id
      );
      if (index !== -1) {
        this.inventarioDisplay[index] = { ...this.productoAConfirmar };
        this.actualizarDatosFiltrados();
        console.log(
          `Producto "${this.productoAConfirmar.nombreProducto}" guardado.`
        );
        this.cerrarModalConfirmacion();
      }
    }
  }

  eliminarProductoConfirmado() {
    if (this.productoAEliminar && this.productoAEliminar.id) {
      this.inventarioService
        .eliminar(this.productoAEliminar.id)
        .then(() => {
          const index = this.inventarioDisplay.findIndex(
            (p) => p.id === this.productoAEliminar.id
          );
          if (index !== -1) {
            this.inventarioDisplay.splice(index, 1);
            this.actualizarDatosFiltrados();
            console.log(
              `Producto "${this.productoAEliminar.nombreProducto}" eliminado.`
            );
            if (this.productoSeleccionado?.id === this.productoAEliminar.id) {
              this.cerrarHistorial();
            }
          }
          toast.success('Producto eliminado correctamente');
        })
        .catch((error) => {
          console.error('Error al eliminar producto:', error);
          toast.error('Error al eliminar el producto');
        });
    }
    this.cerrarModalConfirmacion();
  }

  eliminarProducto(productoAEliminar: InventarioDisplay) {
    if (productoAEliminar.id) {
      this.inventarioService
        .eliminar(productoAEliminar.id)
        .then(() => {
          const index = this.inventarioDisplay.findIndex(
            (p) => p.id === productoAEliminar.id
          );
          if (index !== -1) {
            this.inventarioDisplay.splice(index, 1);
            this.actualizarDatosFiltrados();
            console.log(
              `Producto "${productoAEliminar.nombreProducto}" eliminado.`
            );
            if (this.productoSeleccionado?.id === productoAEliminar.id) {
              this.cerrarHistorial();
            }
          }
          toast.success('Producto eliminado correctamente');
        })
        .catch((error) => {
          console.error('Error al eliminar producto:', error);
          toast.error('Error al eliminar el producto');
        });
    }
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.productoAConfirmar = null;
  }

  //Tabla de historial
  mostrarHistorial(productoId: string) {
    this.cerrarHistorial();
    this.productoSeleccionado = this.inventarioDisplay.find((p) => p.id === productoId) || null;

    if (this.productoSeleccionado) {
      this.cargandoHistorial = true;
      this.movimientosSubscription = this.movimientosService
        .obtenerPorInventario(productoId)
        .subscribe({
          next: (movimientos) => {
            const movimientosOrdenados = movimientos.sort((a, b) =>
              this.convertirFechaFirestore(b.fechaHora).getTime() - this.convertirFechaFirestore(a.fechaHora).getTime()
            );
            const historialMovimientos: Movimiento[] = movimientosOrdenados.map(mov => ({
              cantidad: mov.cantidadMovida,
              tipo: mov.tipoMovimiento as 'ENTRADA' | 'SALIDA' | 'AJUSTE',
              fecha: this.convertirFechaFirestore(mov.fechaHora),
              motivo: mov.motivo || 'Sin motivo especificado',
            }));
            this.dataSourceHistorial = new MatTableDataSource<Movimiento>(historialMovimientos);
            this.cdRef.detectChanges();
            this.asignarPaginadorYSortHistorial();
            this.cargandoHistorial = false;
          },
          error: (error) => {
            console.error('Error al cargar movimientos:', error);
            this.dataSourceHistorial = new MatTableDataSource<Movimiento>([]);
            this.cargandoHistorial = false;
            toast.error('Error al cargar el historial de movimientos');
          }
        });
    } else {
      this.dataSourceHistorial = new MatTableDataSource<Movimiento>([]);
      toast.error('No se pudo encontrar el producto seleccionado');
    }
  }

  cerrarHistorial() {
    if (this.movimientosSubscription) {
      this.movimientosSubscription.unsubscribe();
      this.movimientosSubscription = null;
    }
    this.dataSourceHistorial = new MatTableDataSource<Movimiento>([]);
    this.productoSeleccionado = null;
    this.cargandoHistorial = false;
  }

  applyFilter() {
    // Primero aplicar el filtro de búsqueda
    let inventarioFiltradoPorBusqueda = this.inventarioDisplay.filter(
      (producto) =>
        producto.nombreProducto
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        producto.detalles
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        false ||
        producto.descripcionProducto
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );

    // Luego aplicar el filtro de sucursal sobre el resultado de la búsqueda
    this.inventarioFiltrado = this.filtrarInventarioPorSucursal(
      inventarioFiltradoPorBusqueda
    );
    this.dataSource.data = this.inventarioFiltrado;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrirModalNuevoProducto() {
    this.mostrarModalNuevoProducto = true;
    this.nuevoProducto = {
      productoId: '',
      stockActual: 0,
      stockMinimo: 0,
      sucursalId: '',
    };
  }

  cerrarModalNuevoProducto() {
    this.mostrarModalNuevoProducto = false;
  }

  async agregarNuevoProducto() {
    if (
      !this.nuevoProducto.productoId ||
      this.nuevoProducto.stockActual < 0 ||
      this.nuevoProducto.stockMinimo < 0 ||
      !this.nuevoProducto.sucursalId
    ) {
      toast.error(
        'Por favor, complete todos los campos obligatorios correctamente.'
      );
      return;
    }

    try {
      // Obtener el producto y sucursal desde la base de datos
      const producto = await firstValueFrom(
        this.productoService.obtenerPorId(this.nuevoProducto.productoId)
      );
      const sucursal = await firstValueFrom(
        this.sucursalService.obtenerPorId(this.nuevoProducto.sucursalId)
      );

      if (producto && sucursal) {
        // Crear el registro de inventario
        const nuevoInventario: Omit<Inventario, 'id'> = {
          producto: producto,
          sucursal: sucursal,
          cantidad: this.nuevoProducto.stockActual,
          stockMinimo: this.nuevoProducto.stockMinimo,
          ultimaActualizacion: new Date(),
          estado: 'ACTIVO',
        };

        // Guardar en la base de datos
        const inventarioId = await this.inventarioService.crear(nuevoInventario);
        
        // Si hay stock inicial, registrar el movimiento
        if (this.nuevoProducto.stockActual > 0) {
          await this.movimientosService.registrarMovimiento(
            inventarioId,
            producto.id!,
            sucursal.id!,
            0, // Cantidad anterior (0 porque es nuevo)
            this.nuevoProducto.stockActual,
            'ENTRADA',
            'Stock inicial al crear inventario'
          );
        }

        toast.success(
          `Producto "${producto.nombre}" agregado al inventario de "${sucursal.nombre}" correctamente`
        );

        // Recargar datos desde la base de datos y actualizar automáticamente
        this.cargarInventario();
        this.cerrarModalNuevoProducto();
      } else {
        toast.error('No se pudo encontrar el producto o sucursal seleccionado');
      }
    } catch (error) {
      console.error('Error al crear inventario:', error);
      toast.error('Error al agregar el producto al inventario');
    }
  }
  exportarMovimientosAExcel(): void {
    const dataExportar = this.dataSource.filteredData.map((producto) => ({
      Sucursal: producto.sucursalNombre,
      Producto: producto.nombreProducto,
      'Stock Actual': producto.stockActual,
      'Stock Mínimo': producto.stockMinimo,
      Estado: producto.estado,
      Detalles: producto.detalles || '',
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventario');

    // Definir columnas con encabezado y ancho
    worksheet.columns = [
      { header: 'Sucursal', key: 'Sucursal', width: 20 },
      { header: 'Producto', key: 'Producto', width: 25 },
      { header: 'Stock Actual', key: 'Stock Actual', width: 15 },
      { header: 'Stock Mínimo', key: 'Stock Mínimo', width: 15 },
      { header: 'Estado', key: 'Estado', width: 15 },
      { header: 'Detalles', key: 'Detalles', width: 30 },
    ];

    // Agregar los datos
    dataExportar.forEach((item) => {
      worksheet.addRow(item);
    });

    // Estilos para la cabecera
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF198754' }, // Verde Bootstrap
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Bordes para todas las celdas de datos
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });
      }
    });

    // Generar archivo y descargar
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const nombreSucursal =
        this.sucursalSeleccionada && this.sucursalSeleccionada !== 'todas'
          ? this.sucursalSeleccionada.replace(/\s+/g, '_') // Reemplaza espacios por "_"
          : 'todas';
      const fechaActual = new Date().toISOString().split('T')[0];
      FileSaver.saveAs(
        blob,
        `inventario_${nombreSucursal}_${fechaActual}.xlsx`
      );
    });
  }

  // Método para actualizar automáticamente el historial
  private actualizarHistorialEnVista(inventarioId: string) {
    // Solo actualizar si hay un historial abierto para este inventario
    if (this.productoSeleccionado && this.productoSeleccionado.id === inventarioId) {
      // Limpiar la suscripción anterior si existe
      if (this.movimientosSubscription) {
        this.movimientosSubscription.unsubscribe();
      }
      this.cargandoHistorial = true;
      this.movimientosSubscription = this.movimientosService
        .obtenerPorInventario(inventarioId)
        .subscribe({
          next: (movimientos) => {
            // Ordenar movimientos por fecha (más recientes primero)
            const movimientosOrdenados = movimientos.sort((a, b) => 
              this.convertirFechaFirestore(b.fechaHora).getTime() - this.convertirFechaFirestore(a.fechaHora).getTime()
            );
            // Convertir movimientos a formato de historial
            const historialMovimientos: Movimiento[] = movimientosOrdenados.map(mov => ({
              cantidad: mov.cantidadMovida,
              tipo: mov.tipoMovimiento as 'ENTRADA' | 'SALIDA' | 'AJUSTE',
              fecha: this.convertirFechaFirestore(mov.fechaHora),
              motivo: mov.motivo || 'Sin motivo especificado',
            }));
            // Crear SIEMPRE un nuevo MatTableDataSource
            this.dataSourceHistorial = new MatTableDataSource<Movimiento>(historialMovimientos);
            this.cdRef.detectChanges();
            this.asignarPaginadorYSortHistorial();
            this.cargandoHistorial = false;
          },
          error: (error) => {
            console.error('Error al actualizar historial en vista:', error);
            this.dataSourceHistorial = new MatTableDataSource<Movimiento>([]);
            this.cargandoHistorial = false;
          }
        });
    }
  }

  private asignarPaginadorYSortHistorial() {
    let intentos = 0;
    const maxIntentos = 10;
    const asignar = () => {
      if (this.paginatorHistorial && this.sortHistorial) {
        this.dataSourceHistorial.paginator = this.paginatorHistorial;
        this.dataSourceHistorial.sort = this.sortHistorial;
      } else if (intentos < maxIntentos) {
        intentos++;
        setTimeout(asignar, 50);
      }
    };
    asignar();
  }
}

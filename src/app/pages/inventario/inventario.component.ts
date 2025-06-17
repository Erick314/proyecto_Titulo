import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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
import { SucursalService, Sucursal } from '../../modelo/sucursal/sucursal.service';
import { ProductoService, Producto } from '../../modelo/producto/producto.service';
import { InventarioService, Inventario } from '../../modelo/inventario/inventario.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

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
  displayedColumns: string[] = ['sucursalNombre', 'nombreProducto', 'stockActual', 'estado', 'opciones'];
  dataSource = new MatTableDataSource<InventarioDisplay>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Propiedades para el historial
  displayedColumnsHistorial: string[] = ['cantidad', 'tipo', 'fecha'];
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
    sucursalId: ''
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

  constructor(
    private sucursalService: SucursalService,
    private productoService: ProductoService,
    private inventarioService: InventarioService
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
      }
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
      }
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
      }
    });
  }

  private convertirInventarioADisplay() {
    this.inventarioDisplay = this.inventario.map(item => ({
      id: item.id,
      nombreProducto: item.producto.nombre,
      descripcionProducto: item.producto.descripcion,
      stockActual: item.cantidad,
      stockMinimo: item.stockMinimo,
      sucursalNombre: item.sucursal.nombre,
      ultimaActualizacion: item.ultimaActualizacion,
      estado: item.estado,
      detalles: `${item.producto.cantidadUnidadMedida}${item.producto.unidadMedida}`,
      historialMovimientos: [] // Por ahora vacío, se puede implementar después
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

  private filtrarInventarioPorSucursal(inventarioAFiltrar?: InventarioDisplay[]): InventarioDisplay[] {
    const inventarioBase = inventarioAFiltrar || this.inventarioDisplay;
    if (!this.sucursalSeleccionada || this.sucursalSeleccionada === 'todas') {
      return [...inventarioBase];
    }
    return inventarioBase.filter(p => p.sucursalNombre === this.sucursalSeleccionada);
  }

  //uso de los incrementadores y decrementadores
  incrementarStock(producto: InventarioDisplay) {
    if (producto.id) {
      // Actualizar inmediatamente en la vista para mejor UX
      const stockAnterior = producto.stockActual;
      producto.stockActual++;
      
      this.inventarioService.actualizarCantidad(producto.id, producto.stockActual)
        .then(() => {
          toast.success('Stock incrementado correctamente');
          // Verificar si ahora está por encima del mínimo
          if (stockAnterior <= producto.stockMinimo && producto.stockActual > producto.stockMinimo) {
            toast.success('¡Stock restaurado por encima del mínimo!');
          }
        })
        .catch(error => {
          console.error('Error al incrementar stock:', error);
          toast.error('Error al incrementar el stock');
          // Revertir el cambio en caso de error
          producto.stockActual = stockAnterior;
        });
    }
  }

  decrementarStock(producto: InventarioDisplay) {
    if (producto.stockActual > 0 && producto.id) {
      // Actualizar inmediatamente en la vista para mejor UX
      const stockAnterior = producto.stockActual;
      producto.stockActual--;
      
      this.inventarioService.actualizarCantidad(producto.id, producto.stockActual)
        .then(() => {
          toast.success('Stock decrementado correctamente');
          // Verificar si ahora está por debajo del mínimo
          if (stockAnterior > producto.stockMinimo && producto.stockActual <= producto.stockMinimo) {
            toast.warning('¡Atención! Stock por debajo del mínimo');
          }
        })
        .catch(error => {
          console.error('Error al decrementar stock:', error);
          toast.error('Error al decrementar el stock');
          // Revertir el cambio en caso de error
          producto.stockActual = stockAnterior;
        });
    } else if (producto.stockActual <= 0) {
      toast.warning('No se puede decrementar más el stock');
    }
  }

  // Método para actualizar stock directamente desde el input
  actualizarStockDirecto(producto: InventarioDisplay) {
    if (producto.id && producto.stockActual >= 0) {
      const stockAnterior = producto.stockActual;
      
      this.inventarioService.actualizarCantidad(producto.id, producto.stockActual)
        .then(() => {
          toast.success('Stock actualizado correctamente');
          
          // Verificar cambios en el estado del stock mínimo
          if (stockAnterior <= producto.stockMinimo && producto.stockActual > producto.stockMinimo) {
            toast.success('¡Stock restaurado por encima del mínimo!');
          } else if (stockAnterior > producto.stockMinimo && producto.stockActual <= producto.stockMinimo) {
            toast.warning('¡Atención! Stock por debajo del mínimo');
          }
        })
        .catch(error => {
          console.error('Error al actualizar stock:', error);
          toast.error('Error al actualizar el stock');
          // Revertir el cambio en caso de error
          producto.stockActual = stockAnterior;
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
        console.log(`Producto "${this.productoAConfirmar.nombreProducto}" guardado.`);
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
      this.inventarioService.eliminar(this.productoAEliminar.id)
        .then(() => {
          const index = this.inventarioDisplay.findIndex(
            (p) => p.id === this.productoAEliminar.id
          );
          if (index !== -1) {
            this.inventarioDisplay.splice(index, 1);
            this.actualizarDatosFiltrados();
            console.log(`Producto "${this.productoAEliminar.nombreProducto}" eliminado.`);
            if (this.productoSeleccionado?.id === this.productoAEliminar.id) {
              this.cerrarHistorial();
            }
          }
          toast.success('Producto eliminado correctamente');
        })
        .catch(error => {
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
        console.log(`Producto "${this.productoAConfirmar.nombreProducto}" guardado.`);
        this.cerrarModalConfirmacion();
      }
    }
  }

  eliminarProductoConfirmado() {
    if (this.productoAEliminar && this.productoAEliminar.id) {
      this.inventarioService.eliminar(this.productoAEliminar.id)
        .then(() => {
          const index = this.inventarioDisplay.findIndex(
            (p) => p.id === this.productoAEliminar.id
          );
          if (index !== -1) {
            this.inventarioDisplay.splice(index, 1);
            this.actualizarDatosFiltrados();
            console.log(`Producto "${this.productoAEliminar.nombreProducto}" eliminado.`);
            if (this.productoSeleccionado?.id === this.productoAEliminar.id) {
              this.cerrarHistorial();
            }
          }
          toast.success('Producto eliminado correctamente');
        })
        .catch(error => {
          console.error('Error al eliminar producto:', error);
          toast.error('Error al eliminar el producto');
        });
    }
    this.cerrarModalConfirmacion();
  }

  eliminarProducto(productoAEliminar: InventarioDisplay) {
    if (productoAEliminar.id) {
      this.inventarioService.eliminar(productoAEliminar.id)
        .then(() => {
          const index = this.inventarioDisplay.findIndex(
            (p) => p.id === productoAEliminar.id
          );
          if (index !== -1) {
            this.inventarioDisplay.splice(index, 1);
            this.actualizarDatosFiltrados();
            console.log(`Producto "${productoAEliminar.nombreProducto}" eliminado.`);
            if (this.productoSeleccionado?.id === productoAEliminar.id) {
              this.cerrarHistorial();
            }
          }
          toast.success('Producto eliminado correctamente');
        })
        .catch(error => {
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
    this.productoSeleccionado =
      this.inventarioDisplay.find((p) => p.id === productoId) || null;
    if (this.productoSeleccionado?.historialMovimientos) {
      this.dataSourceHistorial = new MatTableDataSource<Movimiento>(
        this.productoSeleccionado.historialMovimientos
      );
      this.dataSourceHistorial.paginator = this.paginatorHistorial;
      this.dataSourceHistorial.sort = this.sortHistorial;
    } else {
      this.dataSourceHistorial = new MatTableDataSource<Movimiento>([]);
    }
  }

  cerrarHistorial() {
    this.productoSeleccionado = null;
  }

  applyFilter() {
    // Primero aplicar el filtro de búsqueda
    let inventarioFiltradoPorBusqueda = this.inventarioDisplay.filter(
      (producto) =>
        producto.nombreProducto.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (producto.detalles?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false) ||
        producto.descripcionProducto.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Luego aplicar el filtro de sucursal sobre el resultado de la búsqueda
    this.inventarioFiltrado = this.filtrarInventarioPorSucursal(inventarioFiltradoPorBusqueda);
    this.dataSource.data = this.inventarioFiltrado;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrirModalNuevoProducto() {
    this.mostrarModalNuevoProducto = true;
    this.nuevoProducto = { productoId: '', stockActual: 0, stockMinimo: 0, sucursalId: '' };
  }

  cerrarModalNuevoProducto() {
    this.mostrarModalNuevoProducto = false;
  }

  async agregarNuevoProducto() {
    if (!this.nuevoProducto.productoId || 
        this.nuevoProducto.stockActual < 0 || 
        this.nuevoProducto.stockMinimo < 0 ||
        !this.nuevoProducto.sucursalId) {
      toast.error('Por favor, complete todos los campos obligatorios correctamente.');
      return;
    }

    try {
      // Obtener el producto y sucursal desde la base de datos
      const producto = await firstValueFrom(this.productoService.obtenerPorId(this.nuevoProducto.productoId));
      const sucursal = await firstValueFrom(this.sucursalService.obtenerPorId(this.nuevoProducto.sucursalId));

      if (producto && sucursal) {
        // Crear el registro de inventario
        const nuevoInventario: Omit<Inventario, 'id'> = {
          producto: producto,
          sucursal: sucursal,
          cantidad: this.nuevoProducto.stockActual,
          stockMinimo: this.nuevoProducto.stockMinimo,
          ultimaActualizacion: new Date(),
          estado: 'ACTIVO'
        };

        // Guardar en la base de datos
        await this.inventarioService.crear(nuevoInventario);
        toast.success(`Producto "${producto.nombre}" agregado al inventario de "${sucursal.nombre}" correctamente`);

        // Recargar datos desde la base de datos
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
}

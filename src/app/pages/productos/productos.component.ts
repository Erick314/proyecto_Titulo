import { Component, ViewChild, OnInit, AfterViewInit, inject } from '@angular/core';
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
import { toast } from 'ngx-sonner';
import { ProductoService, Producto } from '../../modelo/producto/producto.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productos',
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
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
})
export class ProductosComponent implements OnInit, AfterViewInit {
  constructor(private productoService: ProductoService) {
    this.dataSource = new MatTableDataSource<Producto>([]);
    this.subscription = new Subscription();
  }
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [...this.productos];
  displayedColumns: string[] = ['nombre', 'categoria', 'precioUnitario', 'cantidad', 'estado', 'opciones'];
  dataSource: MatTableDataSource<Producto>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Estado para la edición de producto
  selectedProducto: Producto | null = null;
  validationError: string | null = null;

  // Estado para la confirmación de acciones
  mostrarModalConfirmacion = false;
  productoAConfirmar: Producto | null = null;
  mensajeConfirmacion = '';
  productoAEliminar: Producto | null = null;

  // Estado para el nuevo producto
  mostrarModalNuevoProducto = false;
  nuevoProducto: Omit<Producto, 'id'> = {
    nombre: '',
    categoria: '',
    descripcion: '',
    estado: 'ACTIVO',
    precioUnitario: 0,
    cantidad: 0,
  };
  newProductoValidationError: string | null = null;

  // Filtro de búsqueda
  searchTerm: string = '';
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.cargarProductos();

    this.dataSource.filterPredicate = (producto: Producto, filter: string) => {
      const searchStr = filter.toLowerCase().trim();
      const searchableFields = [
        producto.nombre?.toLowerCase() || '',
        producto.categoria?.toLowerCase() || '',
        producto.estado?.toLowerCase() || '',
        producto.precioUnitario?.toString() || '',
        producto.cantidad?.toString() || ''
      ];
      
      return searchableFields.some(field => field.includes(searchStr));
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    const filterValue = this.searchTerm.toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrirEditor(producto: Producto) {
    this.selectedProducto = { ...producto };
    this.validationError = null;
  }

  cerrarEditor() {
    this.selectedProducto = null;
    this.validationError = null;
  }

  guardarProducto() {
    if (this.selectedProducto && this.validarProducto(this.selectedProducto)) {
      const { id, ...productoActualizado } = this.selectedProducto;
      if (id) {
        this.productoService.actualizar(id, productoActualizado).then(() => {
          this.cerrarEditor();
          this.cargarProductos();
        });
      }
    }
  }

  solicitarConfirmacionEliminar(producto: Producto) {
    this.productoAEliminar = producto;
    this.mensajeConfirmacion = `¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?`;
    this.mostrarModalConfirmacion = true;
  }

  confirmarAccion() {
    if (this.productoAEliminar?.id) {
      this.productoService.eliminar(this.productoAEliminar.id).then(() => {
        this.cerrarModalConfirmacion();
        this.cargarProductos();
      });
    }
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.mensajeConfirmacion = '';
    this.productoAEliminar = null;
  }

  abrirModalNuevoProducto() {
    this.nuevoProducto = {
      nombre: '',
      categoria: '',
      descripcion: '',
      estado: 'ACTIVO',
      precioUnitario: 0,
      cantidad: 0,
    };
    this.newProductoValidationError = null;
    this.mostrarModalNuevoProducto = true;
  }

  cerrarModalNuevoProducto() {
    this.mostrarModalNuevoProducto = false;
    this.newProductoValidationError = null;
  }

  agregarNuevoProducto() {
    if (this.validarNuevoProducto(this.nuevoProducto)) {
      this.productoService.crear(this.nuevoProducto).then(() => {
        this.cerrarModalNuevoProducto();
        this.cargarProductos();
      });
    }
  }

  cargarProductos() {
    this.subscription.add(
      this.productoService.listar().subscribe((productos) => {
        this.dataSource.data = productos;
      })
    );
  }

  validarProducto(producto: Partial<Producto>): boolean {
    if (!producto.nombre?.trim()) {
      this.validationError = 'El nombre es requerido';
      return false;
    }
    if (!producto.categoria?.trim()) {
      this.validationError = 'La categoría es requerida';
      return false;
    }
    if (!producto.precioUnitario || producto.precioUnitario <= 0) {
      this.validationError = 'El precio unitario debe ser mayor a 0';
      return false;
    }
    if (!producto.cantidad || producto.cantidad < 0) {
      this.validationError = 'La cantidad no puede ser negativa';
      return false;
    }
    if (!producto.estado) {
      this.validationError = 'El estado es requerido';
      return false;
    }
    return true;
  }

  validarNuevoProducto(producto: Omit<Producto, 'id'>): boolean {
    if (!producto.nombre?.trim()) {
      this.newProductoValidationError = 'El nombre es requerido';
      return false;
    }
    if (!producto.categoria?.trim()) {
      this.newProductoValidationError = 'La categoría es requerida';
      return false;
    }
    if (!producto.precioUnitario || producto.precioUnitario <= 0) {
      this.newProductoValidationError = 'El precio unitario debe ser mayor a 0';
      return false;
    }
    if (!producto.cantidad || producto.cantidad < 0) {
      this.newProductoValidationError = 'La cantidad no puede ser negativa';
      return false;
    }
    if (!producto.estado) {
      this.newProductoValidationError = 'El estado es requerido';
      return false;
    }
    return true;
  }
} 
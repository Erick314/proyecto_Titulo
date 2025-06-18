import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
  inject,
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
import { toast } from 'ngx-sonner';
import {
  SucursalService,
  Sucursal,
} from '../../modelo/sucursal/sucursal.service';

interface AgregarSucursal {
  id: string;
  nombre: string;
  direccion: string;
  numContacto: string;
  ventas: number;
  ultimoPedido: Date;
}

interface Movimiento {
  producto: string;
  cantidad: number;
  stock: number;
  tipoMovimiento: 'ENTRADA' | 'SALIDA';
  fecha: Date;
}

@Component({
  selector: 'app-sucursales',
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
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.scss',
})
export class SucursalesComponent implements OnInit, AfterViewInit {
  // Datos de ejemplo para las sucursales
  constructor() {}
  private sucursalService = inject(SucursalService);
  sucursales: AgregarSucursal[] = [];

  sucursalesFiltradas: Sucursal[] = [...this.sucursales];
  dataSourceSucursales = new MatTableDataSource<Sucursal>([]);
  displayedColumnsSucursales: string[] = [
    'nombre',
    'ventas',
    'direccion',
    'numContacto',
    'ultimoPedido',
    'opciones',
    'movimientos',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Estado para la edición de sucursal
  selectedSucursal: Sucursal | null = null;
  validationError = '';

  // Estado para la confirmación de acciones
  mostrarModalConfirmacion = false;
  sucursalAConfirmar: AgregarSucursal | null = null;
  mensajeConfirmacion = '';
  sucursalAEliminar: AgregarSucursal | null = null;

  // Estado para el nuevo proveedor
  mostrarModalNuevaSucursal = false;
  nuevaSucursal: Partial<AgregarSucursal> = {
    nombre: '',
    ventas: 0,
    ultimoPedido: new Date(),
  };
  newSucursalValidationError = '';

  // Filtro de búsqueda
  searchTerm: string = '';

  // --- Estados para el modal de Movimientos ---
  mostrarModalMovimientos = false;
  selectedSucursalMovimientos: AgregarSucursal | null = null;
  movimientosSucursal: Movimiento[] = [];
  displayedColumnsMovimientos: string[] = [
    'producto',
    'cantidad',
    'stock',
    'tipoMovimiento',
    'fecha',
  ];
  dataSourceMovimientos = new MatTableDataSource<Movimiento>([]);
  @ViewChild('movimientosPaginator') movimientosPaginator!: MatPaginator;
  @ViewChild('movimientosSort') movimientosSort!: MatSort;

  ngOnInit(): void {
    this.sucursalService.listar().subscribe((sucursales) => {
      const sucursalesConvertidas = sucursales.map((suc) => ({
        ...suc,
        ultimoPedido:
          suc.ultimoPedido instanceof Date
            ? suc.ultimoPedido
            : suc.ultimoPedido && (suc.ultimoPedido as any).toDate
            ? (suc.ultimoPedido as any).toDate()
            : suc.ultimoPedido,
      }));

      this.sucursales = sucursalesConvertidas;
      this.sucursalesFiltradas = [...this.sucursales];
      this.dataSourceSucursales.data = this.sucursalesFiltradas;
      this.dataSourceSucursales.paginator = this.paginator;
      this.dataSourceSucursales.sort = this.sort;
    });

    this.dataSourceSucursales.filterPredicate = (
      sucursal: AgregarSucursal,
      filter: string
    ) => {
      const searchStr = filter.toLowerCase().trim();
      const searchableFields = [
        sucursal.nombre?.toLowerCase() || '',
        sucursal.direccion?.toLowerCase() || '',
        sucursal.numContacto?.toLowerCase() || '',
        sucursal.ultimoPedido
          ? new Date(sucursal.ultimoPedido).toLocaleDateString('es-CL')
          : '',
      ];

      return searchableFields.some((field) => field.includes(searchStr));
    };
  }

  ngAfterViewInit(): void {
    this.dataSourceSucursales.paginator = this.paginator;
    this.dataSourceSucursales.sort = this.sort;

    // Asegurarse de que el paginator y sort de movimientos se asignen solo cuando el modal esté abierto
    // Esto se hará dentro de abrirModalMovimientos
  }

  // --- Funciones de la tabla y filtros (Similares a Proveedores/Facturas) ---
  applyFilter() {
    const filterValue = this.searchTerm.toLowerCase();
    this.dataSourceSucursales.filter = filterValue;

    if (this.dataSourceSucursales.paginator) {
      this.dataSourceSucursales.paginator.firstPage();
    }
  }

  // --- Funciones para el modal de EDICIÓN de sucursal ---
  abrirEditorSucursal(sucursal: Sucursal) {
    this.selectedSucursal = { ...sucursal };
    this.validationError = '';
    if (
      this.selectedSucursal.ultimoPedido &&
      this.selectedSucursal.ultimoPedido instanceof Date
    ) {
      const d = this.selectedSucursal.ultimoPedido;
      this.selectedSucursal.ultimoPedido = d
        .toISOString()
        .substring(0, 10) as any;
    }
  }

  cerrarEditorSucursal() {
    this.selectedSucursal = null;
    this.validationError = '';
  }

  guardarSucursal() {
    if (
      !this.selectedSucursal?.nombre ||
      !this.selectedSucursal?.direccion ||
      !this.selectedSucursal?.numContacto ||
      !this.selectedSucursal?.ultimoPedido
    ) {
      toast.error('Todos los campos obligatorios deben estar completos.');
      return;
    }

    this.sucursalAConfirmar = { ...this.selectedSucursal };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN LA SUCURSAL ${
      this.selectedSucursal!.nombre
    }?`;
    this.mostrarModalConfirmacion = true;
  }

  // --- Funciones para el modal de CONFIRMACIÓN ---
  solicitarConfirmacionGuardadoSucursal(sucursal: AgregarSucursal) {
    this.sucursalAConfirmar = { ...sucursal };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN LA SUCURSAL ${sucursal.nombre}?`;
    this.mostrarModalConfirmacion = true;
  }

  solicitarConfirmacionEliminarSucursal(sucursal: AgregarSucursal) {
    this.sucursalAEliminar = { ...sucursal };
    this.mensajeConfirmacion = `¿DESEA ELIMINAR LA SUCURSAL ${sucursal.nombre}?`;
    this.mostrarModalConfirmacion = true;
  }

  confirmarAccionSucursal() {
    if (
      this.sucursalAConfirmar &&
      this.mensajeConfirmacion.includes('CAMBIOS')
    ) {
      this.confirmarGuardadoSucursal();
    } else if (
      this.sucursalAEliminar &&
      this.mensajeConfirmacion.includes('ELIMINAR')
    ) {
      this.confirmarEliminarSucursal();
    }
  }

  confirmarGuardadoSucursal() {
    if (this.sucursalAConfirmar) {
      const { id, ...cambios } = this.sucursalAConfirmar;

      if (typeof cambios.ultimoPedido === 'string') {
        cambios.ultimoPedido = new Date(cambios.ultimoPedido);
      }
      this.sucursalService
        .actualizar(id!, cambios)
        .then(() => {
          toast.success('Sucursal actualizada correctamente.');
          this.cerrarModalConfirmacion();
          this.cerrarEditorSucursal();
          // Actualizar el array después de cerrar los modales
          const idx = this.sucursales.findIndex((s) => s.id === id);
          if (idx !== -1) {
            this.sucursales[idx] = { id, ...cambios } as AgregarSucursal;
            this.sucursalesFiltradas = [...this.sucursales];
            this.dataSourceSucursales.data = this.sucursalesFiltradas;
          }
        })
        .catch((error) => {
          toast.error('Error al actualizar la sucursal.');
          console.error(error);
        });
    }
  }

  confirmarEliminarSucursal() {
    if (this.sucursalAEliminar) {
      const sucursalAEliminar = this.sucursalAEliminar;
      this.sucursalService
        .eliminar(sucursalAEliminar.id)
        .then(() => {
          toast.success(
            `Sucursal "${sucursalAEliminar.nombre}" eliminada correctamente.`
          );
          this.cerrarModalConfirmacion();
          // Actualizar el array después de cerrar el modal
          const index = this.sucursales.findIndex(
            (s) => s.id === sucursalAEliminar.id
          );
          if (index !== -1) {
            this.sucursales.splice(index, 1);
            this.sucursalesFiltradas = [...this.sucursales];
            this.dataSourceSucursales.data = this.sucursalesFiltradas;
          }
          this.sucursalAEliminar = null;
        })
        .catch((error) => {
          toast.error('Error al eliminar la sucursal.');
          console.error('Error al eliminar la sucursal:', error);
        });
    }
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.sucursalAConfirmar = null;
    this.sucursalAEliminar = null;
    this.mensajeConfirmacion = '';
  }

  // --- Funciones para el modal de NUEVA sucursal ---
  abrirModalNuevaSucursal() {
    this.mostrarModalNuevaSucursal = true;
    this.nuevaSucursal = {
      nombre: '',
      ventas: 0,
      ultimoPedido: new Date(),
    };
    this.newSucursalValidationError = '';
  }

  cerrarModalNuevaSucursal() {
    this.mostrarModalNuevaSucursal = false;
    this.newSucursalValidationError = '';
  }

  agregarNuevaSucursal() {
    this.newSucursalValidationError = '';
    if (
      !this.nuevaSucursal.nombre ||
      !this.nuevaSucursal.ultimoPedido ||
      !this.nuevaSucursal.direccion ||
      !this.nuevaSucursal.numContacto
    ) {
      this.newSucursalValidationError =
        'Todos los campos obligatorios deben estar completos.';
      toast.error(this.newSucursalValidationError);
      return;
    }
    const maxId = this.sucursales.length
      ? Math.max(...this.sucursales.map((s) => Number(s.id)))
      : 0;
    const nuevoId: number = maxId + 1;
    this.nuevaSucursal.ventas = 0;

    const nuevaSucursalCompleta: AgregarSucursal = {
      id: String(nuevoId),
      nombre: this.nuevaSucursal.nombre!,
      direccion: this.nuevaSucursal.direccion!,
      numContacto: this.nuevaSucursal.numContacto!,
      ventas: this.nuevaSucursal.ventas!,
      ultimoPedido: new Date(this.nuevaSucursal.ultimoPedido!),
    };
    this.sucursalService
      .crear(nuevaSucursalCompleta)
      .then(() => {
        toast.success('¡Nueva sucursal agregada exitosamente!');
        this.cerrarModalNuevaSucursal();
        // Actualizar el array después de cerrar el modal
        this.sucursales.push(nuevaSucursalCompleta);
        this.sucursalesFiltradas = [...this.sucursales];
        this.dataSourceSucursales.data = this.sucursalesFiltradas;
        console.log('Nueva sucursal agregada:', nuevaSucursalCompleta);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error('algo paso, no se que, pero paso');
        }
      });
  }

  // --- Funciones para el modal de MOVIMIENTOS ---
  abrirModalMovimientos(sucursal: AgregarSucursal) {
    this.selectedSucursalMovimientos = sucursal;
    // Simular carga de movimientos (en un caso real, harías una llamada HTTP aquí)
    this.movimientosSucursal = this.getMovimientosDeSucursal(
      Number(sucursal.id)
    );
    this.dataSourceMovimientos.data = this.movimientosSucursal;
    this.mostrarModalMovimientos = true;

    // Asignar paginator y sort a la tabla de movimientos *después* de que el modal sea visible
    // Esto es crucial porque los ViewChild solo se resuelven cuando el elemento está en el DOM
    // setTimeout asegura que se ejecute después del ciclo de detección de cambios que muestra el modal
    setTimeout(() => {
      if (this.movimientosPaginator) {
        this.dataSourceMovimientos.paginator = this.movimientosPaginator;
      }
      if (this.movimientosSort) {
        this.dataSourceMovimientos.sort = this.movimientosSort;
      }
    });
  }

  cerrarModalMovimientos() {
    this.mostrarModalMovimientos = false;
    this.selectedSucursalMovimientos = null;
    this.movimientosSucursal = [];
    this.dataSourceMovimientos.data = []; // Limpiar datos al cerrar
  }

  // Función simulada para obtener movimientos (reemplazar con API real)
  private getMovimientosDeSucursal(sucursalId: number): Movimiento[] {
    // Aquí puedes tener un array de movimientos más grande o cargar desde un servicio
    const todosLosMovimientos: Movimiento[] = [
      {
        producto: 'SCORE',
        cantidad: 50,
        stock: 500,
        tipoMovimiento: 'ENTRADA',
        fecha: new Date('2025-04-28'),
      },
      {
        producto: 'COCA-COLA',
        cantidad: 70,
        stock: 200,
        tipoMovimiento: 'SALIDA',
        fecha: new Date('2025-04-27'),
      },
      {
        producto: 'PEPSI',
        cantidad: 30,
        stock: 150,
        tipoMovimiento: 'ENTRADA',
        fecha: new Date('2025-04-26'),
      },
      {
        producto: 'FANTA',
        cantidad: 20,
        stock: 100,
        tipoMovimiento: 'SALIDA',
        fecha: new Date('2025-04-25'),
      },
      {
        producto: 'SPRITE',
        cantidad: 80,
        stock: 300,
        tipoMovimiento: 'ENTRADA',
        fecha: new Date('2025-04-24'),
      },
      {
        producto: 'AGUA MINERAL',
        cantidad: 40,
        stock: 120,
        tipoMovimiento: 'SALIDA',
        fecha: new Date('2025-04-23'),
      },
      {
        producto: 'AGUA PURIFICADA',
        cantidad: 60,
        stock: 250,
        tipoMovimiento: 'ENTRADA',
        fecha: new Date('2025-04-22'),
      },
      {
        producto: 'JUGO NARANJA',
        cantidad: 25,
        stock: 90,
        tipoMovimiento: 'SALIDA',
        fecha: new Date('2025-04-21'),
      },
      {
        producto: 'JUGO MANZANA',
        cantidad: 35,
        stock: 180,
        tipoMovimiento: 'ENTRADA',
        fecha: new Date('2025-04-20'),
      },
      {
        producto: 'LECHE ENTERA',
        cantidad: 90,
        stock: 400,
        tipoMovimiento: 'SALIDA',
        fecha: new Date('2025-04-19'),
      },
      {
        producto: 'LECHE DESCREMADA',
        cantidad: 55,
        stock: 280,
        tipoMovimiento: 'ENTRADA',
        fecha: new Date('2025-04-18'),
      },
      {
        producto: 'GALLETAS CHOCOLATE',
        cantidad: 45,
        stock: 210,
        tipoMovimiento: 'SALIDA',
        fecha: new Date('2025-04-17'),
      },
      // ... más movimientos
    ];

    // Simplemente filtramos por sucursal para el ejemplo (en un caso real, la API te daría los de la sucursal)
    // Para simplificar, asumimos que todos los movimientos son de la sucursal seleccionada en este demo.
    // Si tuvieras un 'sucursalId' en cada Movimiento, podrías hacer:
    // return todosLosMovimientos.filter(m => m.sucursalId === sucursalId);
    console.log(
      `Simulando obtener movimientos para sucursal ID: ${sucursalId}`
    );
    return todosLosMovimientos;
  }
}

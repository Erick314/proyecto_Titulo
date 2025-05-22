// src/app/pages/sucursales/sucursales.component.ts

// ... (imports existentes) ...
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
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

interface Sucursal {
  id: string; // Usamos string porque en el mockup es "001", "002"
  nombre: string;
  ventas: number;
  ultimoPedido: Date;
  // Podrías añadir un array de movimientos aquí o cargarlos por separado
  movimientos?: Movimiento[]; // Opcional, si los cargamos al abrir el modal
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
  sucursales: Sucursal[] = [
    {
      id: '001',
      nombre: 'Central/Matriz',
      ventas: 15578590,
      ultimoPedido: new Date('2025-04-01'),
    },
    {
      id: '002',
      nombre: 'Puente Alto',
      ventas: 8200000,
      ultimoPedido: new Date('2025-03-20'),
    },
    {
      id: '003',
      nombre: 'Maipú',
      ventas: 10500000,
      ultimoPedido: new Date('2025-04-10'),
    },
    // ... más sucursales
  ];
  sucursalesFiltradas: Sucursal[] = [...this.sucursales];
  displayedColumnsSucursales: string[] = [
    'id',
    'nombre',
    'ventas',
    'ultimoPedido',
    'opciones',
    'movimientos', // Nueva columna para el botón de movimientos
  ];
  dataSourceSucursales = new MatTableDataSource<Sucursal>(
    this.sucursalesFiltradas
  );
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Estado para la edición de sucursal
  selectedSucursal: Sucursal | null = null;
  validationError = '';

  // Estado para la confirmación de acciones
  mostrarModalConfirmacion = false;
  sucursalAConfirmar: Sucursal | null = null;
  mensajeConfirmacion = '';
  sucursalAEliminar: Sucursal | null = null;

  // Estado para el nuevo proveedor
  mostrarModalNuevaSucursal = false;
  nuevaSucursal: Partial<Sucursal> = {
    nombre: '',
    ventas: 0,
    ultimoPedido: new Date(),
  };
  newSucursalValidationError = '';

  // Filtro de búsqueda
  searchTerm: string = '';

  // --- Estados para el modal de Movimientos ---
  mostrarModalMovimientos = false;
  selectedSucursalMovimientos: Sucursal | null = null;
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

  constructor() {}

  ngOnInit(): void {
    this.dataSourceSucursales = new MatTableDataSource(
      this.sucursalesFiltradas
    );
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
    this.dataSourceSucursales.filterPredicate = (
      sucursal: Sucursal,
      filter: string
    ) => {
      const ultimoPedidoString = sucursal.ultimoPedido
        ? new Date(sucursal.ultimoPedido).toLocaleDateString()
        : '';
      return (
        sucursal.id.toLowerCase().includes(filter) ||
        sucursal.nombre.toLowerCase().includes(filter) ||
        sucursal.ventas.toString().includes(filter) ||
        ultimoPedidoString.includes(filter)
      );
    };
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
      typeof this.selectedSucursal.ultimoPedido === 'string'
    ) {
      this.selectedSucursal.ultimoPedido = new Date(
        this.selectedSucursal.ultimoPedido
      );
    }
  }

  cerrarEditorSucursal() {
    this.selectedSucursal = null;
    this.validationError = '';
  }

  guardarSucursal() {
    if (
      !this.selectedSucursal?.nombre ||
      this.selectedSucursal?.ventas === null ||
      this.selectedSucursal?.ventas === undefined ||
      !this.selectedSucursal?.ultimoPedido
    ) {
      this.validationError =
        'Todos los campos obligatorios deben estar completos.';
      toast.error(this.validationError);
      return;
    }

    this.sucursalAConfirmar = { ...this.selectedSucursal };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN LA SUCURSAL ${
      this.selectedSucursal!.nombre
    }?`;
    this.mostrarModalConfirmacion = true;
  }

  // --- Funciones para el modal de CONFIRMACIÓN ---
  solicitarConfirmacionGuardadoSucursal(sucursal: Sucursal) {
    this.sucursalAConfirmar = { ...sucursal };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN LA SUCURSAL ${sucursal.nombre}?`;
    this.mostrarModalConfirmacion = true;
  }

  solicitarConfirmacionEliminarSucursal(sucursal: Sucursal) {
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
      const index = this.sucursales.findIndex(
        (s) => s.id === this.sucursalAConfirmar!.id
      );
      if (index !== -1) {
        this.sucursales[index] = { ...this.sucursalAConfirmar };
        this.sucursalesFiltradas = [...this.sucursales];
        this.dataSourceSucursales.data = this.sucursalesFiltradas;
        toast.success(
          `Sucursal "${this.sucursalAConfirmar.nombre}" guardada correctamente.`
        );
        console.log(`Sucursal "${this.sucursalAConfirmar.nombre}" guardada.`);
        this.cerrarModalConfirmacion();
        this.cerrarEditorSucursal();
      } else {
        toast.error(`No se encontró la sucursal para actualizar.`);
        console.log(
          `No se encontró la sucursal con ID ${this.sucursalAConfirmar.id} para actualizar.`
        );
        this.cerrarModalConfirmacion();
        this.cerrarEditorSucursal();
      }
    }
  }

  confirmarEliminarSucursal() {
    if (this.sucursalAEliminar) {
      const index = this.sucursales.findIndex(
        (s) => s.id === this.sucursalAEliminar!.id
      );
      if (index !== -1) {
        this.sucursales.splice(index, 1);
        this.sucursalesFiltradas = [...this.sucursales];
        this.dataSourceSucursales.data = this.sucursalesFiltradas;
        toast.success(
          `Sucursal "${this.sucursalAEliminar.nombre}" eliminada correctamente.`
        );
        console.log(`Sucursal "${this.sucursalAEliminar.nombre}" eliminada.`);
      }
    }
    this.cerrarModalConfirmacion();
    this.sucursalAEliminar = null;
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
      this.nuevaSucursal.ventas === null ||
      this.nuevaSucursal.ventas === undefined ||
      !this.nuevaSucursal.ultimoPedido
    ) {
      this.newSucursalValidationError =
        'Todos los campos obligatorios deben estar completos.';
      toast.error(this.newSucursalValidationError);
      return;
    }

    // Generar un ID simple para el ejemplo (en un caso real, esto sería de un backend)
    const nuevoId =
      '00' + (this.sucursales.length + 1).toString().padStart(1, '0'); // Simulación "001", "002" etc.

    const nuevaSucursalCompleta: Sucursal = {
      id: nuevoId,
      nombre: this.nuevaSucursal.nombre!,
      ventas: this.nuevaSucursal.ventas!,
      ultimoPedido: new Date(this.nuevaSucursal.ultimoPedido!),
    };

    this.sucursales.push(nuevaSucursalCompleta);
    this.sucursalesFiltradas = [...this.sucursales];
    this.dataSourceSucursales.data = this.sucursalesFiltradas;
    this.cerrarModalNuevaSucursal();
    toast.success('¡Nueva sucursal agregada exitosamente!');
    console.log('Nueva sucursal agregada:', nuevaSucursalCompleta);
  }

  // --- Funciones para el modal de MOVIMIENTOS ---
  abrirModalMovimientos(sucursal: Sucursal) {
    this.selectedSucursalMovimientos = sucursal;
    // Simular carga de movimientos (en un caso real, harías una llamada HTTP aquí)
    this.movimientosSucursal = this.getMovimientosDeSucursal(sucursal.id);
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
  private getMovimientosDeSucursal(sucursalId: string): Movimiento[] {
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

  exportarMovimientosAExcel() {
    if (this.movimientosSucursal.length === 0) {
      toast.info('No hay movimientos para exportar.');
      return;
    }

    // Crear un string CSV
    let csvContent = 'PRODUCTO,CANTIDAD,STOCK,HISTORIAL MOVIMIENTOS,FECHA\n';
    this.movimientosSucursal.forEach((mov) => {
      const fechaFormateada = mov.fecha.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      csvContent += `${mov.producto},${mov.cantidad},${mov.stock},${mov.tipoMovimiento},${fechaFormateada}\n`;
    });

    // Crear un Blob y un enlace de descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    const sucursalNombre =
      this.selectedSucursalMovimientos?.nombre || 'Movimientos';
    link.setAttribute(
      'download',
      `Movimientos_${sucursalNombre.replace(
        / /g,
        '_'
      )}_${new Date().toLocaleDateString()}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Movimientos exportados a Excel (CSV).');
    console.log('Movimientos exportados a CSV.');
  }
}

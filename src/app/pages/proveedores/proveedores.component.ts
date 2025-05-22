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

interface Proveedor {
  id: number;
  nombreProveedor: string;
  facturasEmitidas: number; // Esto es el 'FACTURAS' del mockup
  ultimoPedido: Date; // Esto es el 'Último pedido' del mockup
  // ... otras propiedades que necesites para un proveedor
}

@Component({
  selector: 'app-proveedores',
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
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.scss',
})
export class ProveedoresComponent implements OnInit, AfterViewInit {
  proveedores: Proveedor[] = [
    {
      id: 343,
      nombreProveedor: 'Andina',
      facturasEmitidas: 3,
      ultimoPedido: new Date('2025-04-01'),
    },
    {
      id: 101,
      nombreProveedor: 'Coca-Cola FEMSA',
      facturasEmitidas: 15,
      ultimoPedido: new Date('2025-03-20'),
    },
    {
      id: 202,
      nombreProveedor: 'PepsiCo Chile',
      facturasEmitidas: 8,
      ultimoPedido: new Date('2025-02-10'),
    },
    {
      id: 404,
      nombreProveedor: 'Nestlé Chile',
      facturasEmitidas: 22,
      ultimoPedido: new Date('2025-04-25'),
    },
    {
      id: 505,
      nombreProveedor: 'Lucchetti S.A.',
      facturasEmitidas: 5,
      ultimoPedido: new Date('2025-01-05'),
    },
  ];
  proveedoresFiltrados: Proveedor[] = [...this.proveedores];
  displayedColumnsProveedores: string[] = [
    'id',
    'nombreProveedor',
    'facturasEmitidas',
    'ultimoPedido',
    'opciones',
  ];
  dataSourceProveedores = new MatTableDataSource<Proveedor>(
    this.proveedoresFiltrados
  );
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Estado para la edición
  selectedProveedor: Proveedor | null = null;
  validationError = '';

  // Estado para la confirmación
  mostrarModalConfirmacion = false;
  proveedorAConfirmar: Proveedor | null = null;
  mensajeConfirmacion = '';
  proveedorAEliminar: Proveedor | null = null;

  // Estado para el nuevo proveedor
  mostrarModalNuevoProveedor = false;
  nuevoProveedor: Partial<Proveedor> = {
    nombreProveedor: '',
    facturasEmitidas: 0,
    ultimoPedido: new Date(),
  };
  newProveedorValidationError = '';

  // Filtro de búsqueda
  searchTerm: string = '';

  constructor() {}

  ngOnInit(): void {
    this.dataSourceProveedores = new MatTableDataSource(
      this.proveedoresFiltrados
    );
  }

  ngAfterViewInit(): void {
    this.dataSourceProveedores.paginator = this.paginator;
    this.dataSourceProveedores.sort = this.sort;
  }

  // --- Funciones de la tabla y filtros ---
  applyFilter() {
    const filterValue = this.searchTerm.toLowerCase();
    this.dataSourceProveedores.filterPredicate = (
      proveedor: Proveedor,
      filter: string
    ) => {
      const ultimoPedidoString = proveedor.ultimoPedido
        ? new Date(proveedor.ultimoPedido).toLocaleDateString()
        : '';
      return (
        proveedor.id.toString().includes(filter) ||
        proveedor.nombreProveedor.toLowerCase().includes(filter) ||
        proveedor.facturasEmitidas.toString().includes(filter) ||
        ultimoPedidoString.includes(filter)
      );
    };
    this.dataSourceProveedores.filter = filterValue;

    if (this.dataSourceProveedores.paginator) {
      this.dataSourceProveedores.paginator.firstPage();
    }
  }

  // --- Funciones para el modal de EDICIÓN de proveedor ---
  abrirEditorProveedor(proveedor: Proveedor) {
    this.selectedProveedor = { ...proveedor };
    this.validationError = '';
    // Asegurarse de que ultimoPedido sea un objeto Date para el input type="date"
    if (
      this.selectedProveedor.ultimoPedido &&
      typeof this.selectedProveedor.ultimoPedido === 'string'
    ) {
      this.selectedProveedor.ultimoPedido = new Date(
        this.selectedProveedor.ultimoPedido
      );
    }
  }

  cerrarEditorProveedor() {
    this.selectedProveedor = null;
    this.validationError = '';
  }

  guardarProveedor() {
    if (
      !this.selectedProveedor?.nombreProveedor ||
      this.selectedProveedor?.facturasEmitidas === null ||
      this.selectedProveedor?.facturasEmitidas === undefined ||
      !this.selectedProveedor?.ultimoPedido
    ) {
      this.validationError =
        'Todos los campos obligatorios deben estar completos.';
      toast.error(this.validationError);
      return;
    }

    this.proveedorAConfirmar = { ...this.selectedProveedor };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN EL PROVEEDOR ${
      this.selectedProveedor!.nombreProveedor
    }?`;
    this.mostrarModalConfirmacion = true;
  }

  // --- Funciones para el modal de CONFIRMACIÓN ---
  solicitarConfirmacionGuardadoProveedor(proveedor: Proveedor) {
    this.proveedorAConfirmar = { ...proveedor };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN EL PROVEEDOR ${proveedor.nombreProveedor}?`;
    this.mostrarModalConfirmacion = true;
  }

  solicitarConfirmacionEliminarProveedor(proveedor: Proveedor) {
    this.proveedorAEliminar = { ...proveedor };
    this.mensajeConfirmacion = `¿DESEA ELIMINAR EL PROVEEDOR ${proveedor.nombreProveedor}?`;
    this.mostrarModalConfirmacion = true;
  }

  confirmarAccionProveedor() {
    if (
      this.proveedorAConfirmar &&
      this.mensajeConfirmacion.includes('CAMBIOS')
    ) {
      this.confirmarGuardadoProveedor();
    } else if (
      this.proveedorAEliminar &&
      this.mensajeConfirmacion.includes('ELIMINAR')
    ) {
      this.confirmarEliminarProveedor();
    }
  }

  confirmarGuardadoProveedor() {
    if (this.proveedorAConfirmar) {
      const index = this.proveedores.findIndex(
        (p) => p.id === this.proveedorAConfirmar!.id
      );
      if (index !== -1) {
        this.proveedores[index] = { ...this.proveedorAConfirmar };
        this.proveedoresFiltrados = [...this.proveedores];
        this.dataSourceProveedores.data = this.proveedoresFiltrados;
        toast.success(
          `Proveedor "${this.proveedorAConfirmar.nombreProveedor}" guardado correctamente.`
        );
        console.log(
          `Proveedor "${this.proveedorAConfirmar.nombreProveedor}" guardado.`
        );
        this.cerrarModalConfirmacion();
        this.cerrarEditorProveedor();
      } else {
        toast.error(`No se encontró el proveedor para actualizar.`);
        console.log(
          `No se encontró el proveedor con ID ${this.proveedorAConfirmar.id} para actualizar.`
        );
        this.cerrarModalConfirmacion();
        this.cerrarEditorProveedor();
      }
    }
  }

  confirmarEliminarProveedor() {
    if (this.proveedorAEliminar) {
      const index = this.proveedores.findIndex(
        (p) => p.id === this.proveedorAEliminar!.id
      );
      if (index !== -1) {
        this.proveedores.splice(index, 1);
        this.proveedoresFiltrados = [...this.proveedores];
        this.dataSourceProveedores.data = this.proveedoresFiltrados;
        toast.success(
          `Proveedor "${this.proveedorAEliminar.nombreProveedor}" eliminado correctamente.`
        );
        console.log(
          `Proveedor "${this.proveedorAEliminar.nombreProveedor}" eliminado.`
        );
      }
    }
    this.cerrarModalConfirmacion();
    this.proveedorAEliminar = null;
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.proveedorAConfirmar = null;
    this.proveedorAEliminar = null;
    this.mensajeConfirmacion = '';
  }

  // --- Funciones para el modal de NUEVO proveedor ---
  abrirModalNuevoProveedor() {
    this.mostrarModalNuevoProveedor = true;
    this.nuevoProveedor = {
      nombreProveedor: '',
      facturasEmitidas: 0,
      ultimoPedido: new Date(),
    };
    this.newProveedorValidationError = '';
  }

  cerrarModalNuevoProveedor() {
    this.mostrarModalNuevoProveedor = false;
    this.newProveedorValidationError = '';
  }

  agregarNuevoProveedor() {
    this.newProveedorValidationError = '';
    if (
      !this.nuevoProveedor.nombreProveedor ||
      this.nuevoProveedor.facturasEmitidas === null ||
      this.nuevoProveedor.facturasEmitidas === undefined ||
      !this.nuevoProveedor.ultimoPedido
    ) {
      this.newProveedorValidationError =
        'Todos los campos obligatorios deben estar completos.';
      toast.error(this.newProveedorValidationError);
      return;
    }

    const nuevoId =
      this.proveedores.length > 0
        ? Math.max(...this.proveedores.map((p) => p.id)) + 1
        : 1;

    const nuevoProveedorCompleto: Proveedor = {
      id: nuevoId,
      nombreProveedor: this.nuevoProveedor.nombreProveedor!,
      facturasEmitidas: this.nuevoProveedor.facturasEmitidas!,
      ultimoPedido: new Date(this.nuevoProveedor.ultimoPedido!),
    };

    this.proveedores.push(nuevoProveedorCompleto);
    this.proveedoresFiltrados = [...this.proveedores];
    this.dataSourceProveedores.data = this.proveedoresFiltrados;
    this.cerrarModalNuevoProveedor();
    toast.success('¡Nuevo proveedor agregado exitosamente!');
    console.log('Nuevo proveedor agregado:', nuevoProveedorCompleto);
  }
}

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

interface Factura {
  id: number;
  numeroFactura: string;
  nombreProveedor: string;
  monto: number;
  fechaEmision: Date;
  // ... otras propiedades de la factura ...
}

@Component({
  selector: 'app-facturas',
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
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.scss',
})
export class FacturasComponent implements OnInit, AfterViewInit {
  facturas: Factura[] = [
    {
      id: 1,
      numeroFactura: '694021',
      nombreProveedor: 'Andina',
      monto: 5578590,
      fechaEmision: new Date('2025-04-01'),
    },
    // ... más datos de ejemplo de facturas ...
  ];
  facturasFiltradas: Factura[] = [...this.facturas];
  displayedColumnsFacturas: string[] = [
    'factura',
    'proveedor',
    'monto',
    'fechaEmision',
    'opciones',
  ];
  dataSourceFacturas = new MatTableDataSource<Factura>(this.facturasFiltradas);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Estado para la edición
  selectedFactura: Factura | null = null;
  validationError = '';

  // Estado para la confirmación
  mostrarModalConfirmacion = false;
  facturaAConfirmar: Factura | null = null;
  mensajeConfirmacion = '';
  facturaAEliminar: Factura | null = null;

  // Estado para la nueva factura
  mostrarModalNuevaFactura = false;
  nuevaFactura: Partial<Factura> = {
    numeroFactura: '',
    nombreProveedor: '',
    monto: 0,
    fechaEmision: new Date(),
  };

  // Filtro de búsqueda
  searchTerm: string = '';

  constructor() {}

  ngOnInit(): void {
    this.dataSourceFacturas = new MatTableDataSource(this.facturasFiltradas);
  }

  ngAfterViewInit(): void {
    this.dataSourceFacturas.paginator = this.paginator;
    this.dataSourceFacturas.sort = this.sort;
  }

  // Edición de facturas
  abrirEditorFactura(factura: Factura) {
    this.selectedFactura = { ...factura };
    this.validationError = '';
  }

  cerrarEditorFactura() {
    this.selectedFactura = null;
    this.validationError = '';
  }

  guardarFactura() {
    if (
      !this.selectedFactura?.numeroFactura ||
      !this.selectedFactura?.nombreProveedor ||
      this.selectedFactura?.monto === null ||
      this.selectedFactura?.monto === undefined ||
      !this.selectedFactura?.fechaEmision
    ) {
      this.validationError =
        'Todos los campos obligatorios deben estar completos.';
      return;
    }
    this.facturaAConfirmar = { ...this.selectedFactura };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN LA FACTURA ${this.selectedFactura.numeroFactura}?`;
    this.mostrarModalConfirmacion = true;
    this.cerrarEditorFactura();
  }

  confirmarGuardadoFactura() {
    if (this.facturaAConfirmar) {
      const index = this.facturas.findIndex(
        (f) => f.id === this.facturaAConfirmar!.id
      );
      if (index !== -1) {
        this.facturas[index] = { ...this.facturaAConfirmar };
        this.facturasFiltradas = [...this.facturas];
        this.dataSourceFacturas.data = this.facturasFiltradas;
        console.log(
          `Factura "${this.facturaAConfirmar.numeroFactura}" guardada.`
        );
        this.cerrarModalConfirmacion();
      } else {
        console.log(
          `No se encontró la factura con ID ${this.facturaAConfirmar.id} para actualizar.`
        );
      }
    }
  }

  // Eliminación de facturas
  solicitarConfirmacionGuardadoFactura(factura: Factura) {
    this.facturaAConfirmar = { ...factura };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN LA FACTURA ${factura.numeroFactura}?`;
    this.mostrarModalConfirmacion = true;
  }

  confirmarAccionFactura() {
    if (this.facturaAConfirmar) {
      this.confirmarGuardadoFactura();
    } else if (this.facturaAEliminar) {
      this.confirmarEliminarFactura();
    }
  }

  confirmarEliminarFactura() {
    if (this.facturaAEliminar) {
      const index = this.facturas.findIndex(
        (f) => f.id === this.facturaAEliminar!.id
      );
      if (index !== -1) {
        this.facturas.splice(index, 1);
        this.facturasFiltradas = [...this.facturas];
        this.dataSourceFacturas.data = this.facturasFiltradas;
        console.log(
          `Factura "${this.facturaAEliminar.numeroFactura}" eliminada.`
        );
      }
    }
    this.cerrarModalConfirmacion();
    this.facturaAEliminar = null;
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.facturaAConfirmar = null;
    this.facturaAEliminar = null;
  }

  applyFilter() {
    const filterValue = this.searchTerm.toLowerCase();
    this.dataSourceFacturas.filterPredicate = (
      factura: Factura,
      filter: string
    ) => {
      const fechaEmisionString = factura.fechaEmision
        ? new Date(factura.fechaEmision).toLocaleDateString()
        : '';
      return (
        factura.numeroFactura.toLowerCase().includes(filter) ||
        factura.nombreProveedor.toLowerCase().includes(filter) ||
        factura.monto.toString().includes(filter) ||
        fechaEmisionString.includes(filter)
      );
    };
    this.dataSourceFacturas.filter = filterValue;

    if (this.dataSourceFacturas.paginator) {
      this.dataSourceFacturas.paginator.firstPage();
    }
  }

  abrirModalNuevaFactura() {
    this.mostrarModalNuevaFactura = true;
    this.nuevaFactura = {
      numeroFactura: '',
      nombreProveedor: '',
      monto: 0,
      fechaEmision: new Date(),
    };
  }

  cerrarModalNuevaFactura() {
    this.mostrarModalNuevaFactura = false;
  }

  agregarNuevaFactura() {
    if (
      this.nuevaFactura.numeroFactura &&
      this.nuevaFactura.nombreProveedor &&
      this.nuevaFactura.monto !== null &&
      this.nuevaFactura.fechaEmision
    ) {
      const nuevoId =
        this.facturas.length > 0
          ? Math.max(...this.facturas.map((f) => f.id)) + 1
          : 1;
      const nuevaFacturaCompleta: Factura = {
        id: nuevoId,
        ...this.nuevaFactura,
      } as Factura;
      this.facturas.push(nuevaFacturaCompleta);
      this.facturasFiltradas = [...this.facturas];
      this.dataSourceFacturas.data = this.facturasFiltradas;
      this.cerrarModalNuevaFactura();
      console.log('Nueva factura agregada:', nuevaFacturaCompleta);
      // Aquí podrías llamar a tu servicio para guardar en el backend
    } else {
      alert('Por favor, complete todos los campos para la nueva factura.');
    }
  }
  solicitarConfirmacionEliminarFactura(factura: Factura) {
    this.facturaAEliminar = { ...factura };
    this.mensajeConfirmacion = `¿DESEA ELIMINAR LA FACTURA ${factura.numeroFactura}?`;
    this.mostrarModalConfirmacion = true;
  }
}

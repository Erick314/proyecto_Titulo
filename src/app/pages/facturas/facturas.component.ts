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

interface Factura {
  id: number;
  numeroFactura: string;
  nombreProveedor: string;
  monto: number;
  fechaEmision: Date;
  pdfUrl?: string;
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
      pdfUrl:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Ejemplo de URL de PDF real
    },
    {
      id: 2,
      numeroFactura: '123456',
      nombreProveedor: 'Coca-Cola',
      monto: 1200000,
      fechaEmision: new Date('2024-03-15'),
      pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', // Otro ejemplo de URL de PDF real
    },
    {
      id: 3,
      numeroFactura: '789012',
      nombreProveedor: 'Pepsi',
      monto: 850000,
      fechaEmision: new Date('2025-01-20'),
      // pdfUrl: 'assets/facturas/factura-ejemplo-3.pdf' // Puedes tener algunas sin PDF
    },
    // ... más datos de ejemplo de facturas ...
  ];
  facturasFiltradas: Factura[] = [...this.facturas];
  // ¡IMPORTANTE! Agrega 'verPdf' aquí en el orden que desees
  displayedColumnsFacturas: string[] = [
    'factura',
    'proveedor',
    'monto',
    'fechaEmision',
    'verPdf', // <-- ¡NUEVA COLUMNA!
    'opciones',
  ];
  dataSourceFacturas = new MatTableDataSource<Factura>(this.facturasFiltradas);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Estado para la edición
  selectedFactura: Factura | null = null;
  validationError = '';
  selectedFileForEdit: File | null = null;

  // Estado para la confirmación
  mostrarModalConfirmacion = false;
  facturaAConfirmar: Factura | null = null;
  mensajeConfirmacion = '';
  facturaAEliminar: Factura | null = null;

  // Estado para la nueva factura
  mostrarModalNuevaFactura = false;
  nuevaFactura: Partial<Factura> = {
    numeroFactura: '',
    // ... inicialización de nuevaFactura
    monto: 0,
    fechaEmision: new Date(),
    pdfUrl: undefined,
  };
  selectedFile: File | null = null;
  newFacturaValidationError = '';

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

  // Edición de facturas
  abrirEditorFactura(factura: Factura) {
    this.selectedFactura = { ...factura };
    this.validationError = '';
    this.selectedFileForEdit = null;
    if (
      this.selectedFactura.fechaEmision &&
      typeof this.selectedFactura.fechaEmision === 'string'
    ) {
      this.selectedFactura.fechaEmision = new Date(
        this.selectedFactura.fechaEmision
      );
    }
  }

  cerrarEditorFactura() {
    this.selectedFactura = null;
    this.validationError = '';
    this.selectedFileForEdit = null;
  }

  onFileSelectedForEdit(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFileForEdit = file;
        toast.info(`Nuevo PDF seleccionado para edición: ${file.name}`);
      } else {
        this.selectedFileForEdit = null;
        input.value = '';
        toast.error('Solo se permiten archivos PDF.');
      }
    } else {
      this.selectedFileForEdit = null;
    }
  }

  clearSelectedFileForEdit() {
    this.selectedFileForEdit = null;
    toast.info('Selección de PDF para edición borrada.');
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
      toast.error(this.validationError);
      return;
    }

    let pdfUrlToSave: string | undefined = this.selectedFactura.pdfUrl;

    if (this.selectedFileForEdit) {
      pdfUrlToSave = URL.createObjectURL(this.selectedFileForEdit);
      toast.info(
        `Simulando reemplazo/carga de PDF para: ${this.selectedFactura.numeroFactura}`
      );
      console.log(
        'Simulando subida de PDF para edición:',
        this.selectedFileForEdit
      );
    } else if (this.selectedFactura.pdfUrl === '') {
      pdfUrlToSave = undefined;
    }

    if (this.selectedFactura) {
      this.selectedFactura.pdfUrl = pdfUrlToSave;
    }

    this.facturaAConfirmar = { ...this.selectedFactura };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN LA FACTURA ${
      this.selectedFactura!.numeroFactura
    }?`;
    this.mostrarModalConfirmacion = true;
  }

  // Eliminación de facturas
  solicitarConfirmacionGuardadoFactura(factura: Factura) {
    this.facturaAConfirmar = { ...factura };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN LA FACTURA ${factura.numeroFactura}?`;
    this.mostrarModalConfirmacion = true;
  }

  solicitarConfirmacionEliminarFactura(factura: Factura) {
    this.facturaAEliminar = { ...factura };
    this.mensajeConfirmacion = `¿DESEA ELIMINAR LA FACTURA ${factura.numeroFactura}?`;
    this.mostrarModalConfirmacion = true;
  }

  confirmarAccionFactura() {
    if (
      this.facturaAConfirmar &&
      this.mensajeConfirmacion.includes('CAMBIOS')
    ) {
      this.confirmarGuardadoFactura();
    } else if (
      this.facturaAEliminar &&
      this.mensajeConfirmacion.includes('ELIMINAR')
    ) {
      this.confirmarEliminarFactura();
    }
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
        toast.success(
          `Factura "${this.facturaAConfirmar.numeroFactura}" guardada correctamente.`
        );
        console.log(
          `Factura "${this.facturaAConfirmar.numeroFactura}" guardada.`
        );
        this.cerrarModalConfirmacion();
        this.cerrarEditorFactura();
      } else {
        toast.error(`No se encontró la factura para actualizar.`);
        console.log(
          `No se encontró la factura con ID ${this.facturaAConfirmar.id} para actualizar.`
        );
        this.cerrarModalConfirmacion();
        this.cerrarEditorFactura();
      }
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
        toast.success(
          `Factura "${this.facturaAEliminar.numeroFactura}" eliminada correctamente.`
        );
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
    this.mensajeConfirmacion = '';
  }

  // --- Funciones para el nuevo modal de Factura ---

  abrirModalNuevaFactura() {
    this.mostrarModalNuevaFactura = true;
    this.nuevaFactura = {
      numeroFactura: '',
      nombreProveedor: '',
      monto: 0,
      fechaEmision: new Date(),
      pdfUrl: undefined,
    };
    this.selectedFile = null;
    this.newFacturaValidationError = '';
  }

  cerrarModalNuevaFactura() {
    this.mostrarModalNuevaFactura = false;
    this.newFacturaValidationError = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        toast.info(`PDF seleccionado para nueva factura: ${file.name}`);
      } else {
        this.selectedFile = null;
        input.value = '';
        toast.error('Solo se permiten archivos PDF.');
      }
    } else {
      this.selectedFile = null;
    }
  }

  agregarNuevaFactura() {
    this.newFacturaValidationError = '';
    if (
      !this.nuevaFactura.numeroFactura ||
      !this.nuevaFactura.nombreProveedor ||
      this.nuevaFactura.monto === null ||
      this.nuevaFactura.monto === undefined ||
      !this.nuevaFactura.fechaEmision
    ) {
      this.newFacturaValidationError =
        'Todos los campos obligatorios deben estar completos.';
      toast.error(this.newFacturaValidationError);
      return;
    }

    let pdfUrl: string | undefined;
    if (this.selectedFile) {
      pdfUrl = URL.createObjectURL(this.selectedFile);
      toast.info(
        `Simulando subida de PDF para nueva factura: ${this.selectedFile.name}`
      );
      console.log('Simulando subida de PDF:', this.selectedFile);
    }

    const nuevoId =
      this.facturas.length > 0
        ? Math.max(...this.facturas.map((f) => f.id)) + 1
        : 1;

    const nuevaFacturaCompleta: Factura = {
      id: nuevoId,
      numeroFactura: this.nuevaFactura.numeroFactura!,
      nombreProveedor: this.nuevaFactura.nombreProveedor!,
      monto: this.nuevaFactura.monto!,
      fechaEmision: new Date(this.nuevaFactura.fechaEmision!),
      pdfUrl: pdfUrl,
    };

    this.facturas.push(nuevaFacturaCompleta);
    this.facturasFiltradas = [...this.facturas];
    this.dataSourceFacturas.data = this.facturasFiltradas;
    this.cerrarModalNuevaFactura();
    toast.success('¡Nueva factura agregada exitosamente!');
    console.log('Nueva factura agregada:', nuevaFacturaCompleta);
  }
}

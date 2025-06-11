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
import { toast } from 'ngx-sonner';
import { Factura, FacturaService } from '../../modelo/factura/factura.service';
import { ProveedorService, Proveedor } from '../../modelo/proveedor/proveedor.service';
import { Subscription } from 'rxjs';
import { SucursalService, Sucursal } from '../../modelo/sucursal/sucursal.service';

// Extender la interfaz Factura para incluir sucursal
interface FacturaConSucursal extends Factura {
  sucursal?: string;
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
export class FacturasComponent implements OnInit, AfterViewInit, OnDestroy {
  facturas: FacturaConSucursal[] = [];
  facturasFiltradas: FacturaConSucursal[] = [];
  displayedColumnsFacturas: string[] = [
    'factura',
    'proveedor',
    'monto',
    'iva',
    'totalNeto',
    'totalFinal',
    'fechaEmision',
    'verPdf',
    'opciones',
  ];
  dataSourceFacturas = new MatTableDataSource<FacturaConSucursal>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Estado para la edición
  selectedFactura: FacturaConSucursal | null = null;
  validationError = '';
  selectedFileForEdit: File | null = null;

  // Estado para la confirmación
  mostrarModalConfirmacion = false;
  facturaAConfirmar: FacturaConSucursal | null = null;
  mensajeConfirmacion = '';
  facturaAEliminar: FacturaConSucursal | null = null;

  // Estado para la nueva factura
  mostrarModalNuevaFactura = false;
  nuevaFactura: Partial<FacturaConSucursal> = {
    numeroFactura: '',
    nombreProveedor: '',
    monto: 0,
    fechaEmision: new Date(),
    pdfUrl: undefined,
    esVisible: true,
    iva: 0.19,
    idUsuario: 'usuario1',
    totalFinal: 0,
    totalNeto: 0
  };
  selectedFile: File | null = null;
  newFacturaValidationError = '';

  // Filtro de búsqueda
  searchTerm: string = '';

  proveedores: Proveedor[] = [];
  private proveedorSubscription: Subscription | null = null;

  private subscription: Subscription | null = null;

  sucursales: Sucursal[] = [];
  sucursalSeleccionada: string = 'todas';

  constructor(
    private facturaService: FacturaService,
    private proveedorService: ProveedorService,
    private sucursalService: SucursalService
  ) {}

  ngOnInit(): void {
    this.cargarFacturas();
    this.cargarProveedores();
    this.cargarSucursales();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.proveedorSubscription) {
      this.proveedorSubscription.unsubscribe();
    }
  }

  private cargarFacturas() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.facturaService.listar().subscribe({
      next: (facturas) => {
        console.log('Facturas cargadas:', facturas);
        this.actualizarDatosFacturas(facturas);
        toast.success('Facturas cargadas correctamente');
      },
      error: (error) => {
        console.error('Error al cargar facturas:', error);
        toast.error('Error al cargar las facturas: ' + (error.message || 'Error desconocido'));
      }
    });
  }

  private actualizarDatosFacturas(facturas: FacturaConSucursal[]) {
    this.facturas = facturas;
    this.facturasFiltradas = this.filtrarFacturasPorSucursal();
    this.dataSourceFacturas.data = this.facturasFiltradas;
  }

  ngAfterViewInit(): void {
    this.dataSourceFacturas.paginator = this.paginator;
    this.dataSourceFacturas.sort = this.sort;
  }

  applyFilter() {
    const filterValue = this.searchTerm.toLowerCase();
    this.dataSourceFacturas.filterPredicate = (factura: FacturaConSucursal, filter: string) => {
      const fechaEmisionString = factura.fechaEmision
        ? new Date(factura.fechaEmision).toLocaleDateString()
        : '';
      
      return (
        factura.numeroFactura.toLowerCase().includes(filter) ||
        factura.nombreProveedor.toLowerCase().includes(filter) ||
        factura.monto.toString().includes(filter) ||
        (factura.totalNeto?.toString() || '').includes(filter) ||
        (factura.totalFinal?.toString() || '').includes(filter) ||
        fechaEmisionString.includes(filter)
      );
    };
    
    this.dataSourceFacturas.filter = filterValue;

    if (this.dataSourceFacturas.paginator) {
      this.dataSourceFacturas.paginator.firstPage();
    }
  }

  actualizarTotalesEdicion() {
    if (this.selectedFactura) {
      const monto = this.selectedFactura.monto || 0;
      const iva = this.selectedFactura.iva || 0.19;
      this.selectedFactura.totalNeto = monto;
      this.selectedFactura.totalFinal = monto * (1 + iva);
    }
  }

  actualizarTotalesNuevaFactura() {
    const monto = this.nuevaFactura.monto || 0;
    const iva = this.nuevaFactura.iva || 0.19;
    this.nuevaFactura.totalNeto = monto;
    this.nuevaFactura.totalFinal = monto * (1 + iva);
  }

  abrirEditorFactura(factura: FacturaConSucursal) {
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
    this.actualizarTotalesEdicion();
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

  solicitarConfirmacionGuardadoFactura(factura: FacturaConSucursal) {
    this.facturaAConfirmar = { ...factura };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN LA FACTURA ${factura.numeroFactura}?`;
    this.mostrarModalConfirmacion = true;
  }

  solicitarConfirmacionEliminarFactura(factura: FacturaConSucursal) {
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

  async confirmarGuardadoFactura() {
    const factura = this.facturaAConfirmar;
    if (factura && factura.id) {
      try {
        const { id, ...cambios } = factura;
        await this.facturaService.actualizar(id, cambios);
        this.cargarFacturas();
        toast.success(`Factura "${factura.numeroFactura}" guardada correctamente.`);
        this.cerrarModalConfirmacion();
        this.cerrarEditorFactura();
      } catch (error) {
        console.error('Error al actualizar factura:', error);
        toast.error('Error al actualizar la factura: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    }
  }

  async confirmarEliminarFactura() {
    const factura = this.facturaAEliminar;
    if (factura && factura.id) {
      try {
        await this.facturaService.eliminar(factura.id);
        this.cargarFacturas();
        toast.success(`Factura "${factura.numeroFactura}" eliminada correctamente.`);
        this.cerrarModalConfirmacion();
        this.facturaAEliminar = null;
      } catch (error) {
        console.error('Error al eliminar factura:', error);
        toast.error('Error al eliminar la factura: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    }
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.facturaAConfirmar = null;
    this.facturaAEliminar = null;
    this.mensajeConfirmacion = '';
  }

  abrirModalNuevaFactura() {
    this.mostrarModalNuevaFactura = true;
    this.nuevaFactura = {
      numeroFactura: '',
      nombreProveedor: '',
      monto: 0,
      fechaEmision: new Date(),
      pdfUrl: undefined,
      esVisible: true,
      iva: 0.19,
      idUsuario: 'usuario1',
      totalFinal: 0,
      totalNeto: 0
    };
    this.selectedFile = null;
    this.newFacturaValidationError = '';
    this.actualizarTotalesNuevaFactura();
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

  async agregarNuevaFactura() {
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

    const monto = this.nuevaFactura.monto!;
    const iva = this.nuevaFactura.iva || 0.19;
    const totalNeto = monto;
    const totalFinal = monto * (1 + iva);

    const nuevaFactura: Omit<FacturaConSucursal, 'id'> = {
      numeroFactura: this.nuevaFactura.numeroFactura!,
      nombreProveedor: this.nuevaFactura.nombreProveedor!,
      monto: monto,
      fechaEmision: new Date(this.nuevaFactura.fechaEmision!),
      pdfUrl: pdfUrl,
      esVisible: true,
      iva: iva,
      idUsuario: 'usuario1',
      totalFinal: totalFinal,
      totalNeto: totalNeto
    };

    try {
      await this.facturaService.crear(nuevaFactura);
      this.cargarFacturas();
      this.cerrarModalNuevaFactura();
      toast.success('¡Nueva factura agregada exitosamente!');
    } catch (error) {
      console.error('Error al crear factura:', error);
      toast.error('Error al crear la factura: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }

  private cargarProveedores() {
    this.proveedorSubscription = this.proveedorService.listar().subscribe({
      next: (proveedores) => {
        console.log('Proveedores cargados:', proveedores);
        this.proveedores = proveedores;
      },
      error: (error) => {
        console.error('Error al cargar proveedores:', error);
        toast.error('Error al cargar los proveedores: ' + (error.message || 'Error desconocido'));
      }
    });
  }

  onSucursalChange() {
    this.facturasFiltradas = this.filtrarFacturasPorSucursal();
    this.dataSourceFacturas.data = this.facturasFiltradas;
    this.applyFilter(); // Mantener filtro de búsqueda si hay
  }

  private filtrarFacturasPorSucursal(): FacturaConSucursal[] {
    if (!this.sucursalSeleccionada || this.sucursalSeleccionada === 'todas') {
      return [...this.facturas];
    }
    return this.facturas.filter(f => f['sucursal'] === this.sucursalSeleccionada);
  }

  private cargarSucursales() {
    this.sucursalService.listar().subscribe({
      next: (sucursales) => {
        this.sucursales = sucursales;
      },
      error: (error) => {
        console.error('Error al cargar sucursales:', error);
      }
    });
  }
}

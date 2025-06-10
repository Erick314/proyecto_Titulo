import { Component, ViewChild, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { toast } from 'ngx-sonner';
import { ProveedorService, Proveedor } from '../../modelo/proveedor/proveedor.service';

// Extender la interfaz Proveedor del servicio para incluir los campos adicionales
interface ProveedorExtendido extends Proveedor {
  facturasRecibidas: number;
  ultimoPedido: Date;
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
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.scss',
})
export class ProveedoresComponent implements OnInit, AfterViewInit {
  constructor() {}
  private proveedorService = inject(ProveedorService);
  
  proveedores: ProveedorExtendido[] = [];
  proveedoresFiltrados: ProveedorExtendido[] = [...this.proveedores];
  dataSourceProveedores = new MatTableDataSource<ProveedorExtendido>([]);
  displayedColumnsProveedores: string[] = [
    'razonSocial',
    'rutEmpresa',
    'nombreCliente',
    'contacto',
    'correo',
    'direccion',
    'facturasRecibidas',
    'ultimoPedido',
    'opciones',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Estado para la edición
  selectedProveedor: ProveedorExtendido | null = null;
  validationError = '';

  // Estado para la confirmación
  mostrarModalConfirmacion = false;
  proveedorAConfirmar: ProveedorExtendido | null = null;
  mensajeConfirmacion = '';
  proveedorAEliminar: ProveedorExtendido | null = null;

  // Estado para el nuevo proveedor
  mostrarModalNuevoProveedor = false;
  nuevoProveedor: Partial<ProveedorExtendido> = {
    razonSocial: '',
    rutEmpresa: '',
    nombreCliente: '',
    contacto: '',
    correo: '',
    direccion: '',
    facturasRecibidas: 0,
    ultimoPedido: new Date(),
  };
  newProveedorValidationError = '';

  // Filtro de búsqueda
  searchTerm: string = '';

  ngOnInit(): void {
    this.proveedorService.listar().subscribe((proveedores) => {
      const proveedoresConvertidos = proveedores.map(prov => {
        // Convertir la fecha de manera segura
        let fechaConvertida: Date;
        if (prov.ultimoPedido instanceof Date) {
          fechaConvertida = prov.ultimoPedido;
        } else if (prov.ultimoPedido && typeof prov.ultimoPedido === 'object' && 'toDate' in prov.ultimoPedido) {
          fechaConvertida = (prov.ultimoPedido as any).toDate();
        } else {
          fechaConvertida = new Date();
        }

        return {
          ...prov,
          facturasRecibidas: 0, // Valor por defecto
          ultimoPedido: fechaConvertida
        };
      });

      this.proveedores = proveedoresConvertidos;
      this.proveedoresFiltrados = [...this.proveedores];
      this.dataSourceProveedores.data = this.proveedoresFiltrados;
      this.dataSourceProveedores.paginator = this.paginator;
      this.dataSourceProveedores.sort = this.sort;

      // Configurar el filtro personalizado
      this.dataSourceProveedores.filterPredicate = (proveedor: ProveedorExtendido, filter: string) => {
        const searchStr = filter.toLowerCase().trim();
        
        // Convertir la fecha a string para búsqueda
        const fechaStr = proveedor.ultimoPedido 
          ? new Date(proveedor.ultimoPedido).toLocaleDateString('es-CL')
          : '';

        // Crear un array con todos los campos buscables
        const searchableFields = [
          proveedor.razonSocial?.toLowerCase() || '',
          proveedor.rutEmpresa?.toLowerCase() || '',
          proveedor.nombreCliente?.toLowerCase() || '',
          proveedor.contacto?.toLowerCase() || '',
          proveedor.correo?.toLowerCase() || '',
          proveedor.direccion?.toLowerCase() || '',
          proveedor.facturasRecibidas?.toString() || '',
          fechaStr
        ];

        // Buscar en todos los campos
        return searchableFields.some(field => field.includes(searchStr));
      };
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceProveedores.paginator = this.paginator;
    this.dataSourceProveedores.sort = this.sort;
  }

  applyFilter() {
    const filterValue = this.searchTerm.toLowerCase().trim();
    this.dataSourceProveedores.filter = filterValue;

    if (this.dataSourceProveedores.paginator) {
      this.dataSourceProveedores.paginator.firstPage();
    }
  }

  abrirEditorProveedor(proveedor: ProveedorExtendido) {
    this.selectedProveedor = { ...proveedor };
    this.validationError = '';
    if (this.selectedProveedor.ultimoPedido && this.selectedProveedor.ultimoPedido instanceof Date) {
      const d = this.selectedProveedor.ultimoPedido;
      this.selectedProveedor.ultimoPedido = d.toISOString().substring(0, 10) as any;
    }
  }

  cerrarEditorProveedor() {
    this.selectedProveedor = null;
    this.validationError = '';
  }

  guardarProveedor() {
    if (
      !this.selectedProveedor?.razonSocial ||
      !this.selectedProveedor?.rutEmpresa ||
      !this.selectedProveedor?.nombreCliente ||
      !this.selectedProveedor?.contacto ||
      !this.selectedProveedor?.correo ||
      !this.selectedProveedor?.direccion ||
      !this.selectedProveedor?.ultimoPedido
    ) {
      toast.error('Todos los campos obligatorios deben estar completos.');
      return;
    }

    this.proveedorAConfirmar = { ...this.selectedProveedor };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN EL PROVEEDOR ${this.selectedProveedor!.nombreCliente}?`;
    this.mostrarModalConfirmacion = true;
  }

  solicitarConfirmacionGuardadoProveedor(proveedor: ProveedorExtendido) {
    this.proveedorAConfirmar = { ...proveedor };
    this.mensajeConfirmacion = `¿DESEA CONFIRMAR LOS CAMBIOS EN EL PROVEEDOR ${proveedor.nombreCliente}?`;
    this.mostrarModalConfirmacion = true;
  }

  solicitarConfirmacionEliminarProveedor(proveedor: ProveedorExtendido) {
    this.proveedorAEliminar = { ...proveedor };
    this.mensajeConfirmacion = `¿DESEA ELIMINAR EL PROVEEDOR ${proveedor.nombreCliente}?`;
    this.mostrarModalConfirmacion = true;
  }

  confirmarAccionProveedor() {
    if (this.proveedorAConfirmar && this.mensajeConfirmacion.includes('CAMBIOS')) {
      this.confirmarGuardadoProveedor();
    } else if (this.proveedorAEliminar && this.mensajeConfirmacion.includes('ELIMINAR')) {
      this.confirmarEliminarProveedor();
    }
  }

  confirmarGuardadoProveedor() {
    if (this.proveedorAConfirmar) {
      const { id, facturasRecibidas, ...cambios } = this.proveedorAConfirmar;
      
      if (typeof cambios.ultimoPedido === 'string') {
        cambios.ultimoPedido = new Date(cambios.ultimoPedido);
      }

      this.proveedorService.actualizar(id!, cambios).then(() => {
        toast.success('Proveedor actualizado correctamente.');
        this.cerrarModalConfirmacion();
        this.cerrarEditorProveedor();
        
        // Mantener el valor actual de facturasRecibidas al actualizar
        const idx = this.proveedores.findIndex(p => p.id === id);
        if (idx !== -1) {
          const facturasActuales = this.proveedores[idx].facturasRecibidas;
          this.proveedores[idx] = { 
            id, 
            facturasRecibidas: facturasActuales, 
            ...cambios 
          } as ProveedorExtendido;
          this.proveedoresFiltrados = [...this.proveedores];
          this.dataSourceProveedores.data = this.proveedoresFiltrados;
        }
      }).catch(error => {
        toast.error('Error al actualizar el proveedor.');
        console.error(error);
      });
    }
  }

  confirmarEliminarProveedor() {
    if (this.proveedorAEliminar) {
      const proveedorAEliminar = this.proveedorAEliminar;
      this.proveedorService.eliminar(proveedorAEliminar.id!).then(() => {
        toast.success(`Proveedor "${proveedorAEliminar.nombreCliente}" eliminado correctamente.`);
        this.cerrarModalConfirmacion();
        
        const index = this.proveedores.findIndex(p => p.id === proveedorAEliminar.id);
        if (index !== -1) {
          this.proveedores.splice(index, 1);
          this.proveedoresFiltrados = [...this.proveedores];
          this.dataSourceProveedores.data = this.proveedoresFiltrados;
        }
        this.proveedorAEliminar = null;
      }).catch(error => {
        toast.error('Error al eliminar el proveedor.');
        console.error('Error al eliminar el proveedor:', error);
      });
    }
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.proveedorAConfirmar = null;
    this.proveedorAEliminar = null;
    this.mensajeConfirmacion = '';
  }

  abrirModalNuevoProveedor() {
    this.mostrarModalNuevoProveedor = true;
    this.nuevoProveedor = {
      razonSocial: '',
      rutEmpresa: '',
      nombreCliente: '',
      contacto: '',
      correo: '',
      direccion: '',
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
      !this.nuevoProveedor.razonSocial ||
      !this.nuevoProveedor.rutEmpresa ||
      !this.nuevoProveedor.nombreCliente ||
      !this.nuevoProveedor.contacto ||
      !this.nuevoProveedor.correo ||
      !this.nuevoProveedor.direccion ||
      !this.nuevoProveedor.ultimoPedido
    ) {
      this.newProveedorValidationError = 'Todos los campos obligatorios deben estar completos.';
      toast.error(this.newProveedorValidationError);
      return;
    }

    const proveedorParaCrear: Omit<Proveedor, 'id'> = {
      razonSocial: this.nuevoProveedor.razonSocial!,
      rutEmpresa: this.nuevoProveedor.rutEmpresa!,
      nombreCliente: this.nuevoProveedor.nombreCliente!,
      contacto: this.nuevoProveedor.contacto!,
      correo: this.nuevoProveedor.correo!,
      direccion: this.nuevoProveedor.direccion!,
      ultimoPedido: new Date(this.nuevoProveedor.ultimoPedido!)
    };
    
    this.proveedorService.crear(proveedorParaCrear).then(() => {
      toast.success('¡Nuevo proveedor agregado exitosamente!');
      this.cerrarModalNuevoProveedor();
      
      // Recargar los proveedores desde el servicio
      this.proveedorService.listar().subscribe(proveedores => {
        const proveedoresConvertidos = proveedores.map(prov => {
          // Convertir la fecha de manera segura
          let fechaConvertida: Date;
          if (prov.ultimoPedido instanceof Date) {
            fechaConvertida = prov.ultimoPedido;
          } else if (prov.ultimoPedido && typeof prov.ultimoPedido === 'object' && 'toDate' in prov.ultimoPedido) {
            fechaConvertida = (prov.ultimoPedido as any).toDate();
          } else {
            fechaConvertida = new Date();
          }

          return {
            ...prov,
            facturasRecibidas: 0, // Valor por defecto
            ultimoPedido: fechaConvertida
          };
        });
        
        this.proveedores = proveedoresConvertidos;
        this.proveedoresFiltrados = [...this.proveedores];
        this.dataSourceProveedores.data = this.proveedoresFiltrados;
      });
    }).catch((err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Error al crear el proveedor');
      }
    });
  }
}

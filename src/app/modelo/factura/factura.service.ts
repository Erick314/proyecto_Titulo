import { Injectable } from '@angular/core';
import { Producto } from '../producto/producto.service';
import { CrudService } from '../crud/crud.service';
import { Observable } from 'rxjs';

export interface Factura{
  id?: string;
  esVisible: boolean;
  fechaEmision: Date;
  iva: number;
  idUsuario: string ;
  nombreProveedor: string ;
  numeroFactura: string ;
  pdfAsociado: string ;
  productos: Record<string, Producto>;
  totalFinal: number;
  totalNeto: number;
}
@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private readonly path = 'Factura';
  
  constructor(private readonly crud: CrudService<Factura>) {}
  
  listar(): Observable<Factura[]> {
    return this.crud.getAll(this.path);
  }

  obtenerPorId(id: string): Observable<Factura | undefined> {
    return this.crud.getById(this.path, id);
  }

  crear(data: Omit<Factura, 'id'>): Promise<string> {
    return this.crud.create(this.path, data);
  }

  actualizar(id: string, cambios: Partial<Omit<Factura, 'id'>>): Promise<void> {
    return this.crud.update(this.path, id, cambios);
  }

  eliminar(id: string): Promise<void> {
    return this.crud.delete(this.path, id);
  }
  
}

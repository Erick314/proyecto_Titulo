import { Injectable } from '@angular/core';
import { CrudService } from '../crud/crud.service';
import { Observable } from 'rxjs';
export interface Proveedor {
  contacto: string;
  correo: string;
  direccion: string;
  id?: string;
  nombreCliente: string;
  razonSocial: string;
  rutEmpresa: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private readonly path = 'Proveedor';

  constructor(private readonly crud: CrudService<Proveedor>) {}

  listar(): Observable<Proveedor[]> {
    return this.crud.getAll(this.path);
  }

  obtenerPorId(id: string): Observable<Proveedor | undefined> {
    return this.crud.getById(this.path, id);
  }

  crear(data: Omit<Proveedor, 'id'>): Promise<string> {
    return this.crud.create(this.path, data);
  }

  actualizar(id: string, cambios: Partial<Omit<Proveedor, 'id'>>): Promise<void> {
    return this.crud.update(this.path, id, cambios);
  }

  eliminar(id: string): Promise<void> {
    return this.crud.delete(this.path, id);
  }
  

}

import { Injectable } from '@angular/core';
import { Producto } from '../producto/producto.service';
import { CrudService } from '../crud/crud.service';
import { Observable } from 'rxjs';

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  numContacto: string;
  ventas: number;
  ultimoPedido: Date;
}
@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  
  private readonly path = 'Sucursal';
  
    constructor(private readonly crud: CrudService<Sucursal>) {}
  
    listar(): Observable<Sucursal[]> {
      return this.crud.getAll(this.path);
    }
  
    obtenerPorId(id: string): Observable<Sucursal | undefined> {
      return this.crud.getById(this.path, id);
    }
  
    crear(data: Omit<Sucursal, 'id'>): Promise<string> {
      return this.crud.create(this.path, data);
    }
  
    actualizar(id: string, cambios: Partial<Omit<Sucursal, 'id'>>): Promise<void> {
      return this.crud.update(this.path, id, cambios);
    }
  
    eliminar(id: string): Promise<void> {
      return this.crud.delete(this.path, id);
    }
}

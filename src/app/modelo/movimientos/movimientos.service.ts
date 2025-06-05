import { Injectable } from '@angular/core';
import { Producto } from '../producto/producto.service';
import { CrudService } from '../crud/crud.service';
import { Observable } from 'rxjs';
export interface Movimientos{
  id?: string;
  facturaAsociada: number;
  fechaHora: Date;
  tipoMovimiento: string;
  productos: Record<string, Producto>;
}
@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

private readonly path = 'Rol';

  constructor(private readonly crud: CrudService<Movimientos>) {}

  listar(): Observable<Movimientos[]> {
    return this.crud.getAll(this.path);
  }

  obtenerPorId(id: string): Observable<Movimientos | undefined> {
    return this.crud.getById(this.path, id);
  }

  crear(data: Omit<Movimientos, 'id'>): Promise<string> {
    return this.crud.create(this.path, data);
  }

  actualizar(id: string, cambios: Partial<Omit<Movimientos, 'id'>>): Promise<void> {
    return this.crud.update(this.path, id, cambios);
  }

  eliminar(id: string): Promise<void> {
    return this.crud.delete(this.path, id);
  }
  
}

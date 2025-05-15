import { Injectable } from '@angular/core';
import { CrudService } from '../crud/crud.service';
import { Observable } from 'rxjs';

export interface Rol {
  id?: number;
  tipoRol: string;
}
@Injectable({
  providedIn: 'root'
})
export class RolService {

  private readonly path = 'Rol';

  constructor(private readonly crud: CrudService<Rol>) {}

  listar(): Observable<Rol[]> {
    return this.crud.getAll(this.path);
  }

  obtenerPorId(id: string): Observable<Rol | undefined> {
    return this.crud.getById(this.path, id);
  }

  crear(data: Omit<Rol, 'id'>): Promise<string> {
    return this.crud.create(this.path, data);
  }

  actualizar(id: string, cambios: Partial<Omit<Rol, 'id'>>): Promise<void> {
    return this.crud.update(this.path, id, cambios);
  }

  eliminar(id: string): Promise<void> {
    return this.crud.delete(this.path, id);
  }
  
}

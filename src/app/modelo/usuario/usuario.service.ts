import { Injectable } from '@angular/core';
import { CrudService } from '../crud/crud.service';
import { Observable } from 'rxjs';

export interface Usuario {
  apellido: string;
  correo: string;
  id?: number;
  nombre: string;
  rol: string;
}
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly path = 'Usuario';

  constructor(private readonly crud: CrudService<Usuario>) {}

  listar(): Observable<Usuario[]> {
    return this.crud.getAll(this.path); 
  }

  obtenerPorId(id: string): Observable<Usuario | undefined> {
    return this.crud.getById(this.path, id);
  }

  crear(data: Omit<Usuario, 'id'>): Promise<string> {
    return this.crud.create(this.path, data);
  }

  actualizar(id: string, cambios: Partial<Omit<Usuario, 'id'>>): Promise<void> {
    return this.crud.update(this.path, id, cambios);
  }

  eliminar(id: string): Promise<void> {
    return this.crud.delete(this.path, id);
  }
}

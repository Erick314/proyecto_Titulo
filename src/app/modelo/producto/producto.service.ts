import { Injectable } from '@angular/core';
import { CrudService } from '../crud/crud.service';
import { Observable } from 'rxjs';
export interface Producto {
  id?: string;
  categoria: string;
  descripcion: string;
  estado: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly path = 'producto';

  constructor(private readonly crud: CrudService<Producto>) {}

  listar(): Observable<Producto[]> {
    return this.crud.getAll(this.path);
  }

  /**
   * Obtiene un producto por su ID.
   */
  obtenerPorId(id: string): Observable<Producto | undefined> {
    return this.crud.getById(this.path, id);
  }

  /**
   * Crea un nuevo producto y devuelve la ID generada.
   */
  crear(data: Omit<Producto, 'id'>): Promise<string> {
    return this.crud.create(this.path, data);
  }

  /**
   * Actualiza un producto existente.
   */
  actualizar(id: string, cambios: Partial<Omit<Producto, 'id'>>): Promise<void> {
    return this.crud.update(this.path, id, cambios);
  }

  /**
   * Elimina un producto por su ID.
   */
  eliminar(id: string): Promise<void> {
    return this.crud.delete(this.path, id);
  }
  // Getters
  get categoria(): string {
    return this.categoria;
  }

  get descripcion(): string {
    return this.descripcion;
  }

  get estado(): string {
    return this.estado;
  }

  get id(): number {
    return this.id;
  }

  get nombre(): string {
    return this.nombre;
  }

  get precioUnitario(): number {
    return this.precioUnitario;
  }
  get cantidad(): number {
    return this.cantidad;
  }

  // Setters
  set categoria(value: string) {
    this.categoria = value;
  }

  set descripcion(value: string) {
    this.descripcion = value;
  }

  set estado(value: string) {
    this.estado = value;
  }

  set id(value: number) {
    this.id = value;
  }

  set nombre(value: string) {
    this.nombre = value;
  }

  set precioUnitario(value: number) {
    this.precioUnitario = value;
  }
  set cantidad(value: number) {
    this.cantidad = value;
  }
}

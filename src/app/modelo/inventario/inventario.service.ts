import { Injectable } from '@angular/core';
import { CrudService } from '../crud/crud.service';
import { Observable } from 'rxjs';
import { Producto } from '../producto/producto.service';
import { Sucursal } from '../sucursal/sucursal.service';
import { map } from 'rxjs/operators';

export interface Inventario {
  id?: string;
  producto: Producto;
  sucursal: Sucursal;
  cantidad: number;
  stockMinimo: number;
  ultimaActualizacion: Date;
  estado: 'ACTIVO' | 'INACTIVO';
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private readonly path = 'Inventario';

  constructor(private readonly crud: CrudService<Inventario>) {}

  /**
   * Obtiene todos los registros de inventario
   */
  listar(): Observable<Inventario[]> {
    return this.crud.getAll(this.path);
  }

  /**
   * Obtiene un registro de inventario por su ID
   */
  obtenerPorId(id: string): Observable<Inventario | undefined> {
    return this.crud.getById(this.path, id);
  }

  /**
   * Crea un nuevo registro de inventario
   */
  crear(data: Omit<Inventario, 'id'>): Promise<string> {
    return this.crud.create(this.path, data);
  }

  /**
   * Actualiza un registro de inventario existente
   */
  actualizar(id: string, cambios: Partial<Omit<Inventario, 'id'>>): Promise<void> {
    return this.crud.update(this.path, id, cambios);
  }

  /**
   * Elimina un registro de inventario
   */
  eliminar(id: string): Promise<void> {
    return this.crud.delete(this.path, id);
  }

  /**
   * Obtiene el inventario de una sucursal específica
   */
  obtenerPorSucursal(sucursalId: string): Observable<Inventario[]> {
    return this.listar().pipe(
      map(inventario => inventario.filter(item => item.sucursal.id === sucursalId))
    );
  }

  /**
   * Obtiene el inventario de un producto específico
   */
  obtenerPorProducto(productoId: string): Observable<Inventario[]> {
    return this.listar().pipe(
      map(inventario => inventario.filter(item => item.producto.id === productoId))
    );
  }

  /**
   * Actualiza la cantidad de un producto en inventario
   */
  actualizarCantidad(id: string, nuevaCantidad: number): Promise<void> {
    return this.actualizar(id, {
      cantidad: nuevaCantidad,
      ultimaActualizacion: new Date()
    });
  }

  /**
   * Verifica si un producto está por debajo del stock mínimo
   */
  verificarStockMinimo(inventario: Inventario): boolean {
    return inventario.cantidad <= inventario.stockMinimo;
  }
}

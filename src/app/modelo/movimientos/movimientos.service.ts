import { Injectable } from '@angular/core';
import { Producto } from '../producto/producto.service';
import { Sucursal } from '../sucursal/sucursal.service';
import { CrudService } from '../crud/crud.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MovimientoInventario {
  id?: string;
  inventarioId: string;
  productoId: string;
  sucursalId: string;
  cantidadAnterior: number;
  cantidadNueva: number;
  cantidadMovida: number;
  tipoMovimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  fechaHora: Date;
  motivo?: string;
  usuarioId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  private readonly path = 'MovimientosInventario';

  constructor(private readonly crud: CrudService<MovimientoInventario>) {}

  listar(): Observable<MovimientoInventario[]> {
    return this.crud.getAll(this.path);
  }

  obtenerPorId(id: string): Observable<MovimientoInventario | undefined> {
    return this.crud.getById(this.path, id);
  }

  crear(data: Omit<MovimientoInventario, 'id'>): Promise<string> {
    return this.crud.create(this.path, data);
  }

  actualizar(id: string, cambios: Partial<Omit<MovimientoInventario, 'id'>>): Promise<void> {
    return this.crud.update(this.path, id, cambios);
  }

  eliminar(id: string): Promise<void> {
    return this.crud.delete(this.path, id);
  }

  /**
   * Obtiene los movimientos de un inventario específico
   */
  obtenerPorInventario(inventarioId: string): Observable<MovimientoInventario[]> {
    return this.listar().pipe(
      map(movimientos => movimientos.filter(mov => mov.inventarioId === inventarioId))
    );
  }

  /**
   * Obtiene los movimientos de un producto específico
   */
  obtenerPorProducto(productoId: string): Observable<MovimientoInventario[]> {
    return this.listar().pipe(
      map(movimientos => movimientos.filter(mov => mov.productoId === productoId))
    );
  }

  /**
   * Obtiene los movimientos de una sucursal específica
   */
  obtenerPorSucursal(sucursalId: string): Observable<MovimientoInventario[]> {
    return this.listar().pipe(
      map(movimientos => movimientos.filter(mov => mov.sucursalId === sucursalId))
    );
  }

  /**
   * Registra un movimiento de inventario
   */
  registrarMovimiento(
    inventarioId: string,
    productoId: string,
    sucursalId: string,
    cantidadAnterior: number,
    cantidadNueva: number,
    tipoMovimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE',
    motivo?: string
  ): Promise<string> {
    const cantidadMovida = Math.abs(cantidadNueva - cantidadAnterior);
    
    const movimiento: Omit<MovimientoInventario, 'id'> = {
      inventarioId,
      productoId,
      sucursalId,
      cantidadAnterior,
      cantidadNueva,
      cantidadMovida,
      tipoMovimiento,
      fechaHora: new Date(),
      motivo: motivo || `Ajuste de stock de ${cantidadAnterior} a ${cantidadNueva}`
    };

    return this.crear(movimiento);
  }
}

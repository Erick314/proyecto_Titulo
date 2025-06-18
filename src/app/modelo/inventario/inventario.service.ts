import { Injectable } from '@angular/core';
import { CrudService } from '../crud/crud.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Producto } from '../producto/producto.service';
import { Sucursal } from '../sucursal/sucursal.service';
import { MovimientosService, MovimientoInventario } from '../movimientos/movimientos.service';
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

  constructor(
    private readonly crud: CrudService<Inventario>,
    private readonly movimientosService: MovimientosService
  ) {}

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
   * Actualiza la cantidad de un producto en inventario y registra el movimiento
   */
  async actualizarCantidad(
    id: string, 
    nuevaCantidad: number, 
    cantidadAnterior: number,
    motivo?: string
  ): Promise<void> {
    // Solo actualizar si la cantidad realmente cambió
    if (cantidadAnterior === nuevaCantidad) {
      return; // No hacer nada si no hay cambio
    }

    // Obtener el inventario actual para registrar el movimiento
    const inventario = await firstValueFrom(this.crud.getById(this.path, id));
    if (!inventario) {
      throw new Error('Inventario no encontrado');
    }

    // Determinar el tipo de movimiento
    let tipoMovimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
    if (nuevaCantidad > cantidadAnterior) {
      tipoMovimiento = 'ENTRADA';
    } else if (nuevaCantidad < cantidadAnterior) {
      tipoMovimiento = 'SALIDA';
    } else {
      tipoMovimiento = 'AJUSTE';
    }

    // Registrar el movimiento
    await this.movimientosService.registrarMovimiento(
      id,
      inventario.producto.id!,
      inventario.sucursal.id!,
      cantidadAnterior,
      nuevaCantidad,
      tipoMovimiento,
      motivo
    );

    // Actualizar el inventario
    await this.actualizar(id, {
      cantidad: nuevaCantidad,
      ultimaActualizacion: new Date()
    });
  }

  /**
   * Incrementa la cantidad de un producto en inventario
   */
  async incrementarCantidad(id: string, cantidad: number = 1, motivo?: string): Promise<void> {
    const inventario = await firstValueFrom(this.crud.getById(this.path, id));
    if (!inventario) {
      throw new Error('Inventario no encontrado');
    }

    const nuevaCantidad = inventario.cantidad + cantidad;
    await this.actualizarCantidad(
      id, 
      nuevaCantidad, 
      inventario.cantidad,
      motivo || `Incremento de ${cantidad} unidades`
    );
  }

  /**
   * Decrementa la cantidad de un producto en inventario
   */
  async decrementarCantidad(id: string, cantidad: number = 1, motivo?: string): Promise<void> {
    const inventario = await firstValueFrom(this.crud.getById(this.path, id));
    if (!inventario) {
      throw new Error('Inventario no encontrado');
    }

    const nuevaCantidad = Math.max(0, inventario.cantidad - cantidad);
    await this.actualizarCantidad(
      id, 
      nuevaCantidad, 
      inventario.cantidad,
      motivo || `Decremento de ${cantidad} unidades`
    );
  }

  /**
   * Verifica si un producto está por debajo del stock mínimo
   */
  verificarStockMinimo(inventario: Inventario): boolean {
    return inventario.cantidad <= inventario.stockMinimo;
  }

  /**
   * Obtiene los movimientos de un inventario específico
   */
  obtenerMovimientos(inventarioId: string): Observable<MovimientoInventario[]> {
    return this.movimientosService.obtenerPorInventario(inventarioId);
  }
}

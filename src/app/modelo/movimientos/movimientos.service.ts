import { Injectable } from '@angular/core';
import { ProductoService } from '../producto/producto.service';
@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  private _id: number = 0;
  private _facturaAsociada: number = 0;
  private _fechaHora: Date = new Date();
  private _tipoMovimiento: 'Agregar' | 'Quitar' = 'Agregar';
  private _productos: Record<string, ProductoService> = {};

  constructor(data?: {
    id?: number;
    facturaAsociada?: number;
    fechaHora?: Date;
    tipoMovimiento?: 'Agregar' | 'Quitar';
    productos?: Record<string, ProductoService>;
  }) {
    if (data) {
      this._id = data.id ?? 0;
      this._facturaAsociada = data.facturaAsociada ?? 0;
      this._fechaHora = data.fechaHora ?? new Date();
      this._tipoMovimiento = data.tipoMovimiento ?? 'Agregar';
      this._productos = data.productos ?? {};
    }
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get facturaAsociada(): number {
    return this._facturaAsociada;
  }

  get fechaHora(): Date {
    return this._fechaHora;
  }

  get tipoMovimiento(): 'Agregar' | 'Quitar' {
    return this._tipoMovimiento;
  }

  get productos(): Record<string, ProductoService> {
    return this._productos;
  }

  // Setters
  set id(value: number) {
    this._id = value;
  }

  set facturaAsociada(value: number) {
    this._facturaAsociada = value;
  }

  set fechaHora(value: Date) {
    this._fechaHora = value;
  }

  set tipoMovimiento(value: 'Agregar' | 'Quitar') {
    this._tipoMovimiento = value;
  }

  set productos(value: Record<string, ProductoService>) {
    this._productos = value;
  }
}

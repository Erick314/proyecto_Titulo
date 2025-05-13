import { Injectable } from '@angular/core';
import { ProductoService } from '../producto/producto.service';
@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  
  private _id: number = 0;
  private _nombre: string = '';
  private _direccion: string = '';
  private _contacto: string = '';
  private _productosDisponibles: Record<string, ProductoService> = {};
  constructor(data?: {
    id?: number;
    nombre?: string;
    direccion?: string;
    contacto?: string;
    productosDisponibles?: Record<string, ProductoService>;
    
  },
  ) {
    if (data) {
      this._id = data.id ?? 0;
      this._nombre = data.nombre ?? '';
      this._direccion = data.direccion ?? '';
      this._contacto = data.contacto ?? '';
      this._productosDisponibles = data.productosDisponibles ?? {};
    }
  }

  // Getters
  get direccion(): string {
    return this._direccion;
  }

  get contacto(): string {
    return this._contacto;
  }

  get productosDisponibles(): Record<string, ProductoService> {
    return this._productosDisponibles;
  }

  get id(): number {
    return this._id;
  }

  get nombre(): string {
    return this._nombre;
  }

  // Setters
  set direccion(value: string) {
    this._direccion = value;
  }

  set contacto(value: string) {
    this._contacto = value;
  }

  set productosDisponibles(value: Record<string, ProductoService>) {
    this._productosDisponibles = value;
  }

  set id(value: number) {
    this._id = value;
  }

  set nombre(value: string) {
    this._nombre = value;
  }
}

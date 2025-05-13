import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private _categoria: string = '';
  private _descripcion: string = '';
  private _estado: string = '';
  private _id: number = 0;
  private _nombre: string = '';
  private _precioUnitario: number = 0;
  private _cantidad: number = 0;

  constructor(data?: {
    categoria?: string;
    descripcion?: string;
    estado?: string;
    id?: number;
    nombre?: string;
    precioUnitario?: number;
    cantidad?: number;
  }) {
    if (data) {
      this._categoria = data.categoria ?? '';
      this._descripcion = data.descripcion ?? '';
      this._estado = data.estado ?? '';
      this._id = data.id ?? 0;
      this._nombre = data.nombre ?? '';
      this._precioUnitario = data.precioUnitario ?? 0;
      this._cantidad = data.cantidad ?? 0;
    }
  }

  // Getters
  get categoria(): string {
    return this._categoria;
  }

  get descripcion(): string {
    return this._descripcion;
  }

  get estado(): string {
    return this._estado;
  }

  get id(): number {
    return this._id;
  }

  get nombre(): string {
    return this._nombre;
  }

  get precioUnitario(): number {
    return this._precioUnitario;
  }
  get cantidad(): number {
    return this._cantidad;
  }

  // Setters
  set categoria(value: string) {
    this._categoria = value;
  }

  set descripcion(value: string) {
    this._descripcion = value;
  }

  set estado(value: string) {
    this._estado = value;
  }

  set id(value: number) {
    this._id = value;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  set precioUnitario(value: number) {
    this._precioUnitario = value;
  }
  set cantidad(value: number) {
    this._cantidad = value;
  }
}

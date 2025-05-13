import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private _contacto: string = '';
  private _correo: string = '';
  private _direccion: string = '';
  private _id: number = 0;
  private _nombreCliente: string = '';
  private _razonSocial: string = '';
  private _rutEmpresa: string = '';

  constructor(data?: {
    contacto?: string;
    correo?: string;
    direccion?: string;
    id?: number;
    nombreCliente?: string;
    razonSocial?: string;
    rutEmpresa?: string;
  }) {
    if (data) {
      this._contacto = data.contacto ?? '';
      this._correo = data.correo ?? '';
      this._direccion = data.direccion ?? '';
      this._id = data.id ?? 0;
      this._nombreCliente = data.nombreCliente ?? '';
      this._razonSocial = data.razonSocial ?? '';
      this._rutEmpresa = data.rutEmpresa ?? '';
    }
  }

  // Getters
  get contacto(): string {
    return this._contacto;
  }

  get correo(): string {
    return this._correo;
  }

  get direccion(): string {
    return this._direccion;
  }

  get id(): number {
    return this._id;
  }

  get nombreCliente(): string {
    return this._nombreCliente;
  }

  get razonSocial(): string {
    return this._razonSocial;
  }

  get rutEmpresa(): string {
    return this._rutEmpresa;
  }

  // Setters
  set contacto(value: string) {
    this._contacto = value;
  }

  set correo(value: string) {
    this._correo = value;
  }

  set direccion(value: string) {
    this._direccion = value;
  }

  set id(value: number) {
    this._id = value;
  }

  set nombreCliente(value: string) {
    this._nombreCliente = value;
  }

  set razonSocial(value: string) {
    this._razonSocial = value;
  }

  set rutEmpresa(value: string) {
    this._rutEmpresa = value;
  }
}

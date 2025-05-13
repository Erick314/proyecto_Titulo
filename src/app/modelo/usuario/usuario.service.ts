import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private _uid: string = '';
  private _apellido: string = '';
  private _correo: string = '';
  private _id: number = 0;
  private _nombre: string = '';
  private _rol: string = '';
  private _usuario: string = '';

  constructor(data?: {
    uid?: string;
    apellido?: string;
    correo?: string;
    id?: number;
    nombre?: string;
    rol?: string;
    usuario?: string;
  }) {
    if (data) {
      this._uid = data.uid ?? '';
      this._apellido = data.apellido ?? '';
      this._correo = data.correo ?? '';
      this._id = data.id ?? 0;
      this._nombre = data.nombre ?? '';
      this._rol = data.rol ?? '';
      this._usuario = data.usuario ?? '';
    }
  }

  // Getters
  get uid(): string {
    return this._uid;
  }

  get apellido(): string {
    return this._apellido;
  }

  get correo(): string {
    return this._correo;
  }

  get id(): number {
    return this._id;
  }

  get nombre(): string {
    return this._nombre;
  }

  get rol(): string {
    return this._rol;
  }

  get usuario(): string {
    return this._usuario;
  }

  // Setters
  set uid(value: string) {
    this._uid = value;
  }

  set apellido(value: string) {
    this._apellido = value;
  }

  set correo(value: string) {
    this._correo = value;
  }

  set id(value: number) {
    this._id = value;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  set rol(value: string) {
    this._rol = value;
  }

  set usuario(value: string) {
    this._usuario = value;
  }
}

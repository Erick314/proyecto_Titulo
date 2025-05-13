import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolService {

    private _id: number = 0;
    private _tipoRol: string = '';
  
    constructor(data?: {
      id?: number;
      tipoRol?: string;
    }) {
      if (data) {
        this._id = data.id ?? 0;
        this._tipoRol = data.tipoRol ?? '';
      }
    }
  
    // Getters
    get id(): number {
      return this._id;
    }
  
    get tipoRol(): string {
      return this._tipoRol;
    }
  
    // Setters
    set id(value: number) {
      this._id = value;
    }
  
    set tipoRol(value: string) {
      this._tipoRol = value;
    }
}

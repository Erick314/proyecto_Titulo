import { Injectable } from '@angular/core';
import { ProductoService } from '../producto/producto.service';
@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private _id: number = 0;
  private _esVisible: boolean = true;
  private _fechaEmision: Date = new Date();
  private _iva: number = 0;
  private _idUsuario: string = '';
  private _nombreProveedor: string = '';
  private _numeroFactura: string = '';
  private _pdfAsociado: string = '';
  private _productos: Record<string, ProductoService> = {};
  private _totalFinal: number = 0;
  private _totalNeto: number = 0;

  constructor(data?: {
    id?: number;
    esVisible?: boolean;
    fechaEmision?: Date;
    iva?: number;
    idUsuario?: string;
    nombreProveedor?: string;
    numeroFactura?: string;
    pdfAsociado?: string;
    productos?: Record<string, ProductoService>;
    totalFinal?: number;
    totalNeto?: number;
  }) {
    if (data) {
      this._id = data.id ?? 0;
      this._esVisible = data.esVisible ?? true;
      this._fechaEmision = data.fechaEmision ?? new Date();
      this._iva = data.iva ?? 0;
      this._idUsuario = data.idUsuario ?? '';
      this._nombreProveedor = data.nombreProveedor ?? '';
      this._numeroFactura = data.numeroFactura ?? '';
      this._pdfAsociado = data.pdfAsociado ?? '';
      this._productos = data.productos ?? {};
      this._totalFinal = data.totalFinal ?? 0;
      this._totalNeto = data.totalNeto ?? 0;
    }
  }

  // Getters
  get id(): number {
    return this._id;
  }
  get esVisible(): boolean {
    return this._esVisible;
  }
  get fechaEmision(): Date {
    return this._fechaEmision;
  }
  get iva(): number {
    return this._iva;
  }
  get idUsuario(): string {
    return this._idUsuario;
  }
  get nombreProveedor(): string {
    return this._nombreProveedor;
  }
  get numeroFactura(): string {
    return this._numeroFactura;
  }
  get pdfAsociado(): string {
    return this._pdfAsociado;
  }
  get productos(): Record<string, ProductoService> {
    return this._productos;
  }
  get totalFinal(): number {
    return this._totalFinal;
  }
  get totalNeto(): number {
    return this._totalNeto;
  }

  // Setters
  set id(value: number) {
    this._id = value;
  }
  set esVisible(value: boolean) {
    this._esVisible = value;
  }
  set fechaEmision(value: Date) {
    this._fechaEmision = value;
  }
  set iva(value: number) {
    this._iva = value;
  }
  set idUsuario(value: string) {
    this._idUsuario = value;
  }
  set nombreProveedor(value: string) {
    this._nombreProveedor = value;
  }
  set numeroFactura(value: string) {
    this._numeroFactura = value;
  }
  set pdfAsociado(value: string) {
    this._pdfAsociado = value;
  }
  set productos(value: Record<string, ProductoService>) {
    this._productos = value;
  }
  set totalFinal(value: number) {
    this._totalFinal = value;
  }
  set totalNeto(value: number) {
    this._totalNeto = value;
  }
}

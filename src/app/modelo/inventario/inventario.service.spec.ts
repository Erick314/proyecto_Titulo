import { TestBed } from '@angular/core/testing';
import { InventarioService } from './inventario.service';
import { CrudService } from '../crud/crud.service';
import { of } from 'rxjs';
import { Inventario } from './inventario.service';
import { Producto } from '../producto/producto.service';
import { Sucursal } from '../sucursal/sucursal.service';

describe('InventarioService', () => {
  let service: InventarioService;
  let crudServiceSpy: jasmine.SpyObj<CrudService<any>>;

  const mockProducto: Producto = {
    id: '1',
    nombre: 'Producto Test',
    descripcion: 'Descripción test',
    categoria: 'Test',
    precioUnitario: 100,
    unidadMedida: 'g',
    cantidadUnidadMedida: 100,
    estado: 'ACTIVO',
  };

  const mockSucursal: Sucursal = {
    id: '1',
    nombre: 'Sucursal Test',
    direccion: 'Dirección test',
    numContacto: '123456789',
    ventas: 0,
    ultimoPedido: new Date(),
  };

  const mockInventario: Inventario = {
    id: '1',
    producto: mockProducto,
    sucursal: mockSucursal,
    cantidad: 10,
    stockMinimo: 5,
    ultimaActualizacion: new Date(),
    estado: 'ACTIVO',
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CrudService', [
      'getAll',
      'getById',
      'create',
      'update',
      'delete',
    ]);

    TestBed.configureTestingModule({
      providers: [InventarioService, { provide: CrudService, useValue: spy }],
    });

    service = TestBed.inject(InventarioService);
    crudServiceSpy = TestBed.inject(CrudService) as jasmine.SpyObj<
      CrudService<any>
    >;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAll when listar is called', () => {
    const mockData: Inventario[] = [mockInventario];
    crudServiceSpy.getAll.and.returnValue(of(mockData));

    service.listar().subscribe((data) => {
      expect(data).toEqual(mockData);
      expect(crudServiceSpy.getAll).toHaveBeenCalledWith('Inventario');
    });
  });

  it('should call getById when obtenerPorId is called', () => {
    const mockId = '123';
    crudServiceSpy.getById.and.returnValue(of(mockInventario));

    service.obtenerPorId(mockId).subscribe((data) => {
      expect(data).toEqual(mockInventario);
      expect(crudServiceSpy.getById).toHaveBeenCalledWith('Inventario', mockId);
    });
  });

  it('should call create when crear is called', async () => {
    const newInventario: Omit<Inventario, 'id'> = {
      producto: mockProducto,
      sucursal: mockSucursal,
      cantidad: 10,
      stockMinimo: 5,
      ultimaActualizacion: new Date(),
      estado: 'ACTIVO',
    };
    const mockId = '123';
    crudServiceSpy.create.and.returnValue(Promise.resolve(mockId));

    const result = await service.crear(newInventario);
    expect(result).toBe(mockId);
    expect(crudServiceSpy.create).toHaveBeenCalledWith(
      'Inventario',
      newInventario
    );
  });

  it('should call update when actualizar is called', async () => {
    const mockId = '123';
    const updateData: Partial<Inventario> = { cantidad: 20 };

    await service.actualizar(mockId, updateData);
    expect(crudServiceSpy.update).toHaveBeenCalledWith(
      'Inventario',
      mockId,
      updateData
    );
  });

  it('should call delete when eliminar is called', async () => {
    const mockId = '123';

    await service.eliminar(mockId);
    expect(crudServiceSpy.delete).toHaveBeenCalledWith('Inventario', mockId);
  });

  it('should verify stock minimo correctly', () => {
    const inventario: Inventario = {
      ...mockInventario,
      cantidad: 5,
      stockMinimo: 10,
    };

    expect(service.verificarStockMinimo(inventario)).toBeTrue();
  });
});

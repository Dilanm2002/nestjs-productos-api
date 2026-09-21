import { Injectable, NotFoundException } from '@nestjs/common';
import type { CrearProductoDto } from './dto/crear-producto.dto.js';
import type { ActualizarPrecioDto } from './dto/actualizar-precio.dto.js';



export interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

@Injectable()
export class ProductosService {
  private readonly productos: Producto[] = [
    { id: 1, nombre: 'Teclado mecánico', precio: 45.9 },
    { id: 2, nombre: 'Mouse inalámbrico', precio: 19.5 },
    { id: 3, nombre: 'Monitor 24"', precio: 129.99 },
  ];

  /** Devuelve todos los productos del catálogo. */
  findAll(): Producto[] {
    return this.productos;
  }

  /**
   * Busca un producto por id.
   * @throws NotFoundException si no existe ningún producto con ese id.
   */
  findOne(id: number): Producto {
    const producto = this.productos.find((p) => p.id === id);
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

    /** Crea un producto nuevo y lo agrega al catálogo. */
  crear(dto: CrearProductoDto): Producto {
    const nuevoId = Math.max(...this.productos.map((p) => p.id)) + 1;
    const nuevo: Producto = { id: nuevoId, ...dto };
    this.productos.push(nuevo);
    return nuevo;
  }

    /** Reemplaza por completo un producto existente. */
  reemplazar(id: number, dto: CrearProductoDto): void {
    const index = this.productos.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    this.productos[index] = { id, ...dto };
  }

  /** Actualiza únicamente el precio de un producto existente. */
  actualizarPrecio(id: number, dto: ActualizarPrecioDto): Producto {
    const index = this.productos.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    this.productos[index] = { ...this.productos[index], precio: dto.precio };
    return this.productos[index];
  }

  /** Elimina un producto existente del catálogo. */
  eliminar(id: number): void {
    const index = this.productos.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    this.productos.splice(index, 1);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Producto } from './producto.entity.js';
import type { CrearProductoDto } from './dto/crear-producto.dto.js';
import type { ActualizarPrecioDto } from './dto/actualizar-precio.dto.js';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
  ) {}

  /** Devuelve los productos del catálogo, filtrando por nombre si se indica. */
  findAll(nombre?: string): Promise<Producto[]> {
    if (!nombre) return this.productosRepository.find();
    return this.productosRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });
  }

  /**
   * Busca un producto por id.
   * @throws NotFoundException si no existe ningún producto con ese id.
   */
  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

  /** Crea un producto nuevo y lo agrega al catálogo. */
  async crear(dto: CrearProductoDto): Promise<Producto> {
    const nuevo = this.productosRepository.create(dto);
    return this.productosRepository.save(nuevo);
  }

  /** Reemplaza por completo un producto existente. */
  async reemplazar(id: number, dto: CrearProductoDto): Promise<void> {
    const producto = await this.findOne(id);
    await this.productosRepository.save({ ...producto, ...dto });
  }

  /** Actualiza únicamente el precio de un producto existente. */
  async actualizarPrecio(id: number, dto: ActualizarPrecioDto): Promise<Producto> {
    const producto = await this.findOne(id);
    producto.precio = dto.precio;
    return this.productosRepository.save(producto);
  }

  /** Elimina un producto existente del catálogo. */
  async eliminar(id: number): Promise<void> {
    const resultado = await this.productosRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ProductosService } from './productos.service.js';
import type { Producto } from './producto.entity.js';
import type { Response } from 'express';
import { CrearProductoDto } from './dto/crear-producto.dto.js';
import { ActualizarPrecioDto } from './dto/actualizar-precio.dto.js';

const productoSchema = {
  type: 'object' as const,
  properties: {
    id: { type: 'number', example: 1 },
    nombre: { type: 'string', example: 'Teclado mecánico' },
    precio: { type: 'number', example: 45.9 },
  },
};

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos disponibles, opcionalmente filtrados por nombre' })
  @ApiOkResponse({
    description: 'Lista de productos.',
    schema: { type: 'array', items: productoSchema },
  })
  findAll(@Query('nombre') nombre?: string): Promise<Producto[]> {
    return this.productosService.findAll(nombre);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por id' })
  @ApiOkResponse({
    description: 'Producto encontrado, con enlaces HATEOAS.',
    schema: {
      allOf: [
        productoSchema,
        {
          type: 'object',
          properties: {
            _links: {
              type: 'object',
              properties: {
                self: { type: 'object' },
                actualizar: { type: 'object' },
                eliminar: { type: 'object' },
              },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const producto = await this.productosService.findOne(id);
    return {
      ...producto,
      _links: {
        self: { href: `/api/v1/productos/${producto.id}` },
        actualizar: { href: `/api/v1/productos/${producto.id}`, method: 'PUT' },
        eliminar: { href: `/api/v1/productos/${producto.id}`, method: 'DELETE' },
      },
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(
    @Body() dto: CrearProductoDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Producto> {
    const nuevo = await this.productosService.crear(dto);
    res.setHeader('Location', `/api/v1/productos/${nuevo.id}`);
    return nuevo;
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reemplazar(@Param('id', ParseIntPipe) id: number, @Body() dto: CrearProductoDto): Promise<void> {
    await this.productosService.reemplazar(id, dto);
  }

  @Patch(':id')
  actualizarPrecio(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarPrecioDto): Promise<Producto> {
    return this.productosService.actualizarPrecio(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productosService.eliminar(id);
  }
}

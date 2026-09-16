import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ProductosService } from './productos.service.js';
import type { Producto } from './productos.service.js';

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
  @ApiOperation({ summary: 'Listar productos disponibles' })
  @ApiOkResponse({
    description: 'Lista de productos.',
    schema: { type: 'array', items: productoSchema },
  })
  findAll(): Producto[] {
    return this.productosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por id' })
  @ApiOkResponse({
    description: 'Producto encontrado.',
    schema: productoSchema,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number): Producto {
    return this.productosService.findOne(id);
  }
}

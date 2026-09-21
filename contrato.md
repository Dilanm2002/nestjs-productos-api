# Mini-contrato: GET /productos

| Campo | Valor |
|---|---|
| Recurso | `/productos` |
| Verbo | `GET` |
| Respuesta 200 | Lista de `{ id, nombre, precio }` |
| Respuesta de error | `500` si falla el servidor |

# Mini-contrato: GET /productos/{id}

| Campo | Valor |
|---|---|
| Recurso | `/productos/{id}` |
| Verbo | `GET` |
| Parámetro | `id` (path, integer) |
| Respuesta 200 | `{ id, nombre, precio }` del producto encontrado |
| Respuesta de error | `404` si no existe un producto con ese `id`; `400` si `id` no es un número |



# Contrato CRUD completo /productos (Semana 2)

| Operación | Verbo | URI | Éxito |
|---|---|---|---|
| Listar | GET | `/api/v1/productos` | 200 |
| Obtener uno | GET | `/api/v1/productos/{id}` | 200 / 404 |
| Crear | POST | `/api/v1/productos` | 201 + Location |
| Reemplazar | PUT | `/api/v1/productos/{id}` | 204 |
| Actualizar parcial | PATCH | `/api/v1/productos/{id}` | 200 |
| Eliminar | DELETE | `/api/v1/productos/{id}` | 204 / 404 |

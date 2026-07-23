# MascotasApp — Front-End (React)

Front-End que consume la API REST pública de MascotasApp (`https://mascotas.pythonanywhere.com/api/`)
para listar, ver detalle, crear, editar el estado, eliminar mascotas, y gestionar sus comentarios.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre la URL que muestre la terminal (por defecto `http://localhost:5173`).

Para revisar el código con el linter:

```bash
npm run lint
```

## Endpoints utilizados

| Acción                        | Método | Endpoint                           |
| ----------------------------- | ------ | ---------------------------------- |
| Listar mascotas               | GET    | `/mascotas/`                       |
| Ver detalle (con comentarios) | GET    | `/mascotas/{id}/`                  |
| Crear mascota                 | POST   | `/mascotas/` (multipart/form-data) |
| Cambiar estado                | PATCH  | `/mascotas/{id}/`                  |
| Eliminar mascota              | DELETE | `/mascotas/{id}/`                  |
| Comentar                      | POST   | `/mascotas/{id}/comentar/`         |
| Eliminar comentario           | DELETE | `/comentarios/{id}/`               |
| Catálogo de choices           | GET    | `/choices/`                        |

## Manejo de errores

Todas las peticiones usan `try/catch` junto a la función `parsearErrorApi()` (`src/api/errores.js`),
que revisa `error.response?.status` y `error.response?.data` y devuelve un mensaje ya traducido
para el usuario final, sin exponer el JSON crudo de la API. Se diferencian especialmente los
errores 400 (validación) y 404 (recurso no encontrado).

## Uso de herramientas de IA

- **Herramienta usada:** Claude (Anthropic).
- **Partes del proyecto donde se usó:** estructura de la instancia de Axios, el manejo
  centralizado de errores, y los componentes de listado, detalle, formulario de creación
  y comentarios.
- **Cómo se validó lo sugerido:** se probó cada endpoint manualmente contra la API real
  (creación, cambio de estado, eliminación, comentarios) y se corrió el linter antes de
  cada entrega.

## Equipo

Este proyecto fue desarrollado individualmente por jose antonio ccahuana lloclla, sin equipo asignado,
con apoyo de IA (Claude) para la implementación del consumo de la API, la corrección de
errores y el diseño visual, avanzando en 3 sesiones de trabajo en días distintos.

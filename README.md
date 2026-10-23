# Mercadito · Gestión de inventario

Actividad individual formativa 1, Semana 1 de **Desarrollo Frontend II (PFY2202)**.

**Autora:** Verioska Ramírez.

**Repositorio:** [supermercado-verioska-ramirez-PFY2202](https://github.com/verioska/supermercado-verioska-ramirez-PFY2202)

Sitio de supermercado desarrollado con HTML, CSS, JavaScript y React. Utiliza React Router para navegar entre el inicio y las dos páginas adicionales seleccionadas: **Quiénes somos** y **Nuestras tiendas**.

## Ejecutar el proyecto

Requisito: Node.js **20.19+** (si utilizas Node 22, requiere 22.12+). Se recomienda Node 24 LTS. Comprueba tu versión con `node --version`. El Node 16 instalado originalmente en este equipo debe actualizarse para utilizar Vite.

```bash
npm install
npm run dev
```

Abre la dirección que indica Vite en la terminal, normalmente `http://127.0.0.1:5173`.

```bash
npm test          # Pruebas de validación, filtros, stock y CSV
npm run build    # Genera dist/ para producción
npm run preview  # Sirve la compilación de producción
```

## Pantallas y navegación

| Ruta | Pantalla | Contenido |
| --- | --- | --- |
| `/` | Inicio / Inventario | Resumen de existencias y gestión de productos |
| `/nosotros` | Quiénes somos | Presentación, propósito y valores del supermercado |
| `/tiendas` | Nuestras tiendas | Tres sucursales de ejemplo, direcciones, horarios y enlaces a mapas |
| Cualquier otra | Página no encontrada | Mensaje 404 y enlace al inicio |

`BrowserRouter` está configurado en `src/main.jsx`; `Routes` y `Route` en `src/App.jsx`. El menú inferior utiliza `NavLink` para señalar la ruta activa y permanece visible en las tres pantallas. Los enlaces internos utilizan React Router para navegar sin recargar el documento.

Si se publica el sitio en un alojamiento estático, se debe configurar una reescritura de todas las rutas hacia `index.html` para que las URLs de React Router funcionen al abrirlas directamente. En GitHub Pages, que no ofrece esa reescritura por defecto, habría que adaptar la aplicación a `HashRouter` y configurar la ruta base de Vite. La actividad solicita entregar un repositorio; publicar en GitHub Pages no es obligatorio.

## Funciones del inventario

- Buscar por nombre o SKU, sin distinguir mayúsculas ni tildes.
- Filtrar por categoría, estado y tienda, con paginación.
- Agregar, editar y eliminar productos; la eliminación requiere confirmación.
- Validar precios, existencias y códigos únicos por tienda.
- Identificar productos disponibles, con stock bajo o agotados. Un producto presenta stock bajo cuando su existencia es menor o igual al mínimo; si es cero, está agotado.
- Exportar los productos que coinciden con los filtros a CSV, compatible con Excel.
- Guardar los cambios en `localStorage` y mantenerlos al recargar el navegador.
- Usar un diseño adaptable, etiquetas accesibles, navegación con teclado y formularios en diálogos.

Los productos que se venden por kilogramo utilizan kilogramos enteros para simplificar esta actividad. El valor mostrado es el precio por kilogramo o por unidad, según corresponda.

**Datos de demostración:** Mercadito es una marca ficticia para este proyecto. Los productos, existencias, tiendas, direcciones y horarios son ilustrativos. El inventario se guarda únicamente en el navegador y origen donde se modifica; no hay servidor, base de datos compartida ni autenticación. El distintivo VR identifica a la autora del proyecto. La tipografía se descarga de Google Fonts y cuenta con una fuente de respaldo local.

## Organización del código

```text
src/
  main.jsx                       Punto de entrada y BrowserRouter
  App.jsx                        Rutas, estructura común y almacenamiento
  data.js                        Productos y tiendas de ejemplo
  inventory.js                   Reglas de inventario, filtros y exportación
  styles.css                     Estilos y diseño adaptable
  components/ProductDialog.jsx   Formulario para agregar o editar
  pages/Home.jsx                 Página principal e inventario
  pages/About.jsx                Quiénes somos
  pages/Stores.jsx               Nuestras tiendas
tests/inventory.test.js          Pruebas de las reglas de inventario
```

## Entrega en GitHub

Nombre requerido del repositorio:

**`supermercado-verioska-ramirez-PFY2202`**

1. Crea un repositorio con ese nombre en tu cuenta de GitHub, sin agregar un README, licencia o `.gitignore` desde GitHub, porque este proyecto ya incluye sus archivos.
2. Desde **esta carpeta del proyecto**, ejecuta los siguientes comandos. Usa `git init` aunque una carpeta superior tenga otro repositorio; este trabajo debe quedar en un repositorio independiente.

```bash
git init -b main
git add .
git commit -m "Implementa supermercado con React Router e inventario"
git remote add origin https://github.com/verioska/supermercado-verioska-ramirez-PFY2202.git
git push -u origin main
```

Para subir los cambios utiliza la autenticación de GitHub configurada en tu equipo; GitHub no admite la contraseña de tu cuenta para `git push` por HTTPS. Si prefieres, puedes publicar el repositorio con GitHub Desktop. Si el repositorio local ya está inicializado y enlazado, omite `git init` y `git remote add origin`.

3. Comparte con tu docente la URL real del repositorio. Si es privado, concede acceso al docente desde GitHub.

No debes subir `node_modules` ni `dist`: `.gitignore` ya los excluye. Sí debes subir `package-lock.json` para que las dependencias sean reproducibles.

## Comprobación manual para la entrega

1. Inicia el proyecto y navega por las tres pantallas desde el menú inferior. Comprueba las URLs y el indicador de página activa.
2. Abre directamente `/nosotros` y `/tiendas`, y prueba los botones atrás y adelante del navegador.
3. Busca un producto y combina filtros. Cambia de página y verifica la cantidad de resultados.
4. Agrega un producto, edítalo y recarga la página para comprobar que sigue guardado.
5. Prueba un código repetido en la misma tienda; el formulario debe impedirlo.
6. Cancela una eliminación y después confirma otra. Exporta el inventario filtrado a CSV.
7. Revisa el sitio en una ventana estrecha y utiliza Tab para navegar con teclado.

## Referencias

- [React](https://react.dev/)
- [React Router: instalación y enrutamiento declarativo](https://reactrouter.com/start/declarative/installation)
- [Vite](https://vite.dev/guide/)
- [Lucide: iconos](https://lucide.dev/)

El contenido del sitio y sus estilos fueron preparados para esta actividad; el texto de la pauta académica no está incorporado al sitio.

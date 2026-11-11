# Reporte de validación: Dashboard SPA Responsivo (CloudPanel)

**Materia:** Interfaces Web · Unidad 3 · Dashboard SPA Responsivo  
**Docente** Peral Huizar José Esteban  
**Alumno** Del Angel Villa Omar

---

## 1. Los 5 estados de cada control

Los controles se tomaron del **panel de configuración** (zona de interacción) y del **modal de confirmación**.

| Control | Default | Hover | Focus | Disabled | Loading |
|---|---|---|---|---|---|
| Campo de texto | ![](capturas/estados/texto-1-default.png) | ![](capturas/estados/texto-2-hover.png) | ![](capturas/estados/texto-3-focus.png) | ![](capturas/estados/texto-4-disabled.png) | ![](capturas/estados/texto-5-loading.png) |
| Área de texto | ![](capturas/estados/area-texto-1-default.png) | ![](capturas/estados/area-texto-2-hover.png) | ![](capturas/estados/area-texto-3-focus.png) | ![](capturas/estados/area-texto-4-disabled.png) | ![](capturas/estados/area-texto-5-loading.png) |
| Desplegable (select) | ![](capturas/estados/selector-1-default.png) | ![](capturas/estados/selector-2-hover.png) | ![](capturas/estados/selector-3-focus.png) | ![](capturas/estados/selector-4-disabled.png) | ![](capturas/estados/selector-5-loading.png) |
| Calendario (date) | ![](capturas/estados/fecha-1-default.png) | ![](capturas/estados/fecha-2-hover.png) | ![](capturas/estados/fecha-3-focus.png) | ![](capturas/estados/fecha-4-disabled.png) | ![](capturas/estados/fecha-5-loading.png) |
| Switch / toggle | ![](capturas/estados/switch-1-default.png) | ![](capturas/estados/switch-2-hover.png) | ![](capturas/estados/switch-3-focus.png) | ![](capturas/estados/switch-4-disabled.png) | ![](capturas/estados/switch-5-loading.png) |
| Botón primario | ![](capturas/estados/boton-primario-1-default.png) | ![](capturas/estados/boton-primario-2-hover.png) | ![](capturas/estados/boton-primario-3-focus.png) | ![](capturas/estados/boton-primario-4-disabled.png) | ![](capturas/estados/boton-primario-5-loading.png) |
| Botón de peligro | ![](capturas/estados/boton-peligro-1-default.png) | ![](capturas/estados/boton-peligro-2-hover.png) | ![](capturas/estados/boton-peligro-3-focus.png) | ![](capturas/estados/boton-peligro-4-disabled.png) | ![](capturas/estados/boton-peligro-5-loading.png) |

**Cómo se implementa cada estado (CSS nativo):**

| Estado | Regla | Cuándo ocurre en la app |
|---|---|---|
| Default | Borde `--color-border-input`, con contraste ≥ 3:1 contra el fondo | Siempre |
| Hover | `:hover` dentro de `@media (hover: hover)`, con fondo o borde más intenso | Solo con mouse. En pantallas táctiles no se queda "pegado" |
| Focus | `:focus-visible` (o `:focus` en campos), con contorno de **3 px** en `--color-focus` | Al navegar con teclado (Tab) o al escribir |
| Disabled | `:disabled`, con opacidad 0.5 y `cursor: not-allowed` | "Guardar" mientras carga el panel, "Eliminar" hasta escribir el nombre, el switch mientras se guarda, "Máximo de instancias" sin autoescalado, "Limpiar filtros" sin filtros |
| Loading | `aria-busy="true"` + spinner, con borde punteado en campos | Al abrir el panel (600 ms), "Guardando…" y "Eliminando…" (800 ms), búsqueda con *debounce* ("Buscando…") |

> En los campos de texto, área de texto, select y fecha, el estado *Disabled* se activó con DevTools (`disabled = true`) solo para tomar la captura. Usa la misma regla `:disabled` que los controles que se deshabilitan solos (columna "Cuándo ocurre").

---

## 2. Vista responsiva: móvil y escritorio

El CSS es **mobile-first**: la base es para celular y las media queries `min-width` agregan diseño en **768 px**, **1024 px** y **1280 px**.

| Pantalla | Móvil (375 px) | Escritorio (1440 px) |
|---|---|---|
| Dashboard (bento grid) | ![](capturas/responsivo-dashboard-movil.png) | ![](capturas/responsivo-dashboard-escritorio.png) |
| Servidores (tabla) | ![](capturas/responsivo-servidores-movil.png) | ![](capturas/responsivo-servidores-escritorio.png) |
| Panel de configuración | ![](capturas/responsivo-panel-movil.png) | ![](capturas/responsivo-panel-escritorio.png) |
| Navegación / modal | ![](capturas/responsivo-menu-movil.png) | ![](capturas/responsivo-modal-escritorio.png) |

**Qué cambia entre tamaños:**

| Elemento | Móvil | Escritorio |
|---|---|---|
| Layout (CSS Grid) | Áreas `header` / `main` | Áreas `sidebar header` / `sidebar main` |
| Sidebar | Menú hamburguesa que se desliza sobre el contenido | Persistente y colapsable |
| Bento grid | 2 columnas | 4 columnas (768) → 12 columnas (1280) |
| Tabla | Cada fila es una tarjeta (`data-label`) | Tabla real |
| Panel de configuración | Hoja inferior (*bottom sheet*) | Panel lateral derecho |

En ningún tamaño hay scroll horizontal (verificado en 375 px).

---

## 3. Modo oscuro

La paleta usa variables CSS en `:root`, en tres capas (`src/styles/tokens.css`):

1. `:root`: tema claro, el valor base.
2. `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) {…} }`: sigue al sistema operativo.
3. `:root[data-theme='dark']`: elección manual con el botón ☀/🌙 del header.

La elección manual se guarda en `localStorage` y se aplica antes del primer pintado (script en `index.html`), así que no hay destello blanco al recargar.

| Dashboard (escritorio) | Dashboard (móvil) |
|---|---|
| ![](capturas/oscuro-dashboard-escritorio.png) | ![](capturas/oscuro-dashboard-movil.png) |

| Panel de configuración | Modal de confirmación |
|---|---|
| ![](capturas/oscuro-panel-escritorio.png) | ![](capturas/oscuro-modal-escritorio.png) |

**Toggle manual** (sistema en modo claro, el usuario pulsa 🌙):

| Antes | Después |
|---|---|
| ![](capturas/oscuro-toggle-antes.png) | ![](capturas/oscuro-toggle-despues.png) |

**Pruebas realizadas:**
- Con el sistema en oscuro y sin elección manual, el fondo cambia a `#0b1120` (`prefers-color-scheme`).
- Con el toggle, `<html data-theme="dark">` se guarda como `theme=dark` y se mantiene al recargar.
- El toggle funciona en los dos sentidos: forzar claro sobre un sistema oscuro y forzar oscuro sobre uno claro.

---

## 4. Checklist de las 5 dimensiones de IxD

| Dimensión | Criterio | Cómo se cumple en el proyecto | |
|---|---|---|---|
| **1D: Palabras** | Etiquetas claras | Todos los campos tienen `<label>` visible ("Nombre del servidor", "Ventana de mantenimiento", "Tipo de instancia"). |  |
| | Microcopia de botones | Verbo + objeto: "Guardar cambios", "Eliminar servidor", "Limpiar filtros", "Configurar". En carga, el verbo en gerundio: "Guardando…", "Eliminando…", "Buscando…". |  |
| | Mensajes informativos | Ayudas bajo los campos ("El servidor se reiniciará ese día a las 02:00.", "29/200 caracteres"), avisos ("Cambios guardados en web-01.") y estados vacíos ("Todo en orden: no hay alertas activas."). |  |
| | Mensajes de error | Dicen cómo corregir: "Escribe un nombre para el servidor.", "Escribe un valor entre 50 y 99.". Se asocian al campo con `aria-describedby` + `aria-invalid`. |  |
| **2D: Representaciones visuales** | Iconografía consistente | Un solo set de iconos SVG de trazo (`Icon.jsx`): mismo grosor y tamaño, siempre acompañados de texto o de `aria-label`. |  |
| | Jerarquía tipográfica | Fuente Inter con escala de tokens (`--font-size-xs … 2xl`): título de página › título de tarjeta › dato › texto de ayuda. |  |
| | Paleta funcional | Azul = acción principal; verde, ámbar y rojo = en línea, alerta y caído/peligro. Se aplica igual en badges, medidores, gráficas y botones, con contraste WCAG en claro y oscuro. |  |
| **3D: Objetos físicos** | Zonas táctiles ≥ 44×44 px | Token `--touch-min: 2.75rem` (44 px) en botones, enlaces, campos, switch (zona ampliada con `::before`) y breadcrumbs. **Auditoría automática en 375 px: 150 elementos interactivos en 6 pantallas, 0 por debajo de 44 px.** |  |
| | Precisión con mouse | En escritorio: hover solo con puntero (`@media (hover:hover)`), cursores `pointer`, `not-allowed` y `progress`, filas de tabla resaltadas al pasar el mouse. |  |
| **4D: Tiempo** | Duración controlada (200–350 ms) | Tokens `--duration-fast 200ms`, `--duration-base 250ms` y `--duration-slow 300ms`. Ninguna transición usa otro valor. |  |
| | Microinteracciones | Hover de tarjetas (elevación, 250 ms), pulsación de botones, apertura y cierre del modal (fade + zoom, 250/200 ms), panel deslizante (300 ms), menú móvil (300 ms), switch, barras de métricas y aviso. |  |
| | Spinners en carga | Spinner + `aria-busy` al abrir el panel, guardar, eliminar y buscar. |  |
| | Accesibilidad del movimiento | `prefers-reduced-motion: reduce` desactiva las animaciones, salvo el spinner, que informa de un proceso. |  |
| **5D: Comportamiento** | Atajos de teclado | **Escape** cierra el modal, el panel y el menú móvil. **Tab** recorre todo con foco visible. **Enter** envía formularios. Enlace "Saltar al contenido". |  |
| | Reglas ante clics | Clic en el fondo cierra el panel, pero **no** el modal destructivo. Para eliminar hay que escribir el nombre exacto del servidor. Los botones se bloquean mientras procesan (no hay doble envío) y el panel no se cierra mientras guarda. |  |
| | Gestión del foco | Al abrir un diálogo, el foco entra en él (*focus trap* nativo de `<dialog>`). Al cerrarlo, vuelve al botón que lo abrió. Al cambiar de página, el foco pasa al contenido. |  |
| | Consistencia operativa | Los mismos componentes (`Button`, `Control`, `Switch`, `Dialog`) en toda la app: la misma acción se ve y se comporta igual en cualquier pantalla. |  |

---

## 5. Pruebas automáticas

Además de las capturas, se ejecutó una prueba E2E con Edge headless mediante el Chrome DevTools Protocol: **37 de 37 comprobaciones correctas**. Cubre:

- Métricas en vivo, breadcrumbs y `aria-current`, paginación y filtros.
- Los 5 estados en botones y campos: foco de 3 px, opacidad en *disabled*, cambio de fondo en *hover*, spinners en *loading*.
- El panel: carga, guardado, Escape bloqueado mientras guarda, aviso y retorno del foco.
- El modal: confirmación por nombre, animación de apertura y cierre, y eliminación.
- El modo oscuro: automático, manual y persistente.
- Ausencia de scroll horizontal en móvil.

# Sileo — Sistema de Notificaciones Toast

## Resumen

Sileo es una librería ligera de toasts para React que utiliza animaciones SVG morphing y spring physics para crear notificaciones fluidas y atractivas. Se integró en **syscom-race-timing** para reemplazar el `window.confirm()` nativo y agregar feedback visual consistente en todas las operaciones del sistema.

## Instalación

```bash
cd frontend
npm install sileo
```

Versión instalada: `0.1.5`

## Configuración

### Toaster (App.jsx)

El componente `<Toaster />` se agregó en el componente raíz `App.jsx` con tema oscuro uniforme:

```jsx
import { Toaster } from 'sileo';

<Toaster
  position="top-right"
  options={{
    fill: '#171717',
    roundness: 16,
    styles: {
      title: 'text-white!',
      description: 'text-white/75!',
      badge: 'bg-white/10!',
      button: 'bg-white/10! hover:bg-white/15! text-white!',
    },
  }}
/>
```

Configuración:
- **Posición:** `top-right` (esquina superior derecha)
- **Fondo:** `#171717` (oscuro)
- **Texto:** blanco con opacidad 75% para descripciones
- **Badge/Botones:** fondo semitransparente (`bg-white/10!`)
- **Border radius:** `16px` (predeterminado)

## API Utilizada

### Métodos de toast

| Método | Color | Uso en el proyecto |
|--------|-------|-------------------|
| `sileo.success()` | Verde | Operaciones exitosas: crear/editar/eliminar pilotos, guardar registros, iniciar carrera |
| `sileo.error()` | Rojo | (Reservado para errores futuros del backend) |
| `sileo.warning()` | Ámbar | Pausar carrera, advertencias |
| `sileo.info()` | Azul | Desmarcar items de seguridad, eventos informativos |
| `sileo.action()` | — | Confirmación de eliminación con botón de acción |
| `sileo.promise()` | — | Operaciones asíncronas con estados loading/success/error |

### sileo.promise()

Se utiliza para operaciones CRUD que envuelven lógica asíncrona (actualmente localStorage, preparado para migrar a backend real):

```jsx
sileo.promise(
  new Promise((resolve) => {
    const created = create(data);
    resolve(created);
  }),
  {
    loading: { title: 'Registrando piloto...' },
    success: (p) => ({ title: 'Piloto registrado', description: `${p.piloto} agregado exitosamente` }),
    error: () => ({ title: 'Error al registrar piloto' }),
  }
);
```

### sileo.action()

Reemplaza `window.confirm()` para eliminaciones con confirmación:

```jsx
sileo.action({
  title: '¿Eliminar a Juan Pérez?',
  description: 'Esta acción no se puede deshacer',
  button: {
    title: 'Eliminar',
    onClick: () => {
      remove(id);
      sileo.success({ title: 'Piloto eliminado' });
    },
  },
});
```

## Componentes Modificados

| Componente | Archivo | Cambios realizados |
|------------|---------|-------------------|
| **App.jsx** | `frontend/src/App.jsx` | Agregado `<Toaster />` con tema oscuro |
| **PilotsView.jsx** | `frontend/src/components/PilotsView.jsx` | `window.confirm()` → `sileo.action()` para eliminar; `sileo.promise()` para crear/editar con toast de éxito |
| **SeguridadView.jsx** | `frontend/src/components/SeguridadView.jsx` | Toast al marcar/desmarcar cada item del checklist |
| **CameraView.jsx** | `frontend/src/components/CameraView.jsx` | `useEffect` detecta cuando la cámara queda configurada y muestra toast de éxito |
| **SpeedTestPanel.jsx** | `frontend/src/components/SpeedTestPanel.jsx` | Toast al guardar tiempo, eliminar registro o limpiar historial |
| **BrakeTestPanel.jsx** | `frontend/src/components/BrakeTestPanel.jsx` | Toast al guardar registro; `sileo.action()` para confirmar limpiar todo el historial |
| **EnduranceView.jsx** | `frontend/src/components/EnduranceView.jsx` | Toast al iniciar, pausar o reiniciar carrera |

## Toasts por Acción

### Pilotos (PilotsView.jsx)
| Acción | Toast |
|--------|-------|
| Crear piloto | `sileo.promise()` → success: "Piloto registrado — {nombre}" |
| Editar piloto | `sileo.promise()` → success: "Piloto actualizado — {nombre}" |
| Eliminar piloto | `sileo.action()` con botón "Eliminar" → `sileo.success()` |

### Seguridad (SeguridadView.jsx)
| Acción | Toast |
|--------|-------|
| Marcar item | `sileo.success()` — "{label} verificado — {piloto}" |
| Desmarcar item | `sileo.info()` — "{label} desmarcado — {piloto}" |

### Cámara (CameraView.jsx)
| Acción | Toast |
|--------|-------|
| Configurar todos los campos | `sileo.success()` — "Configuración guardada" |

### Prueba de Velocidad (SpeedTestPanel.jsx)
| Acción | Toast |
|--------|-------|
| Guardar tiempo | `sileo.success()` — "{matricula} — {tiempo}" |
| Eliminar registro | `sileo.success()` — "Registro eliminado" |
| Limpiar historial | `sileo.success()` — "Historial limpiado" |

### Prueba de Frenado (BrakeTestPanel.jsx)
| Acción | Toast |
|--------|-------|
| Guardar registro | `sileo.success()` — "{matricula} — {distancia}m" |
| Eliminar registro | `sileo.success()` — "Registro eliminado" |
| Limpiar historial | `sileo.action()` con confirmación → `sileo.success()` |

### Carrera (EnduranceView.jsx)
| Acción | Toast |
|--------|-------|
| Iniciar carrera | `sileo.success()` — "¡Carrera iniciada!" |
| Pausar carrera | `sileo.warning()` — "Carrera pausada" |
| Reiniciar carrera | `sileo.success()` — "¡Nueva carrera!" |

## Convenciones

1. **Tema oscuro:** Todos los toasts usan fondo `#171717` con texto blanco
2. **Títulos cortos:** Máximo 4-5 palabras en el título del toast
3. **Descripciones informativas:** Incluyen el nombre del piloto o valor relevante
4. **sileo.promise()** para operaciones que eventualmente serán async (preparado para backend)
5. **sileo.action()** solo para acciones destructivas (eliminar, limpiar historial)

## Documentación Oficial

- [Sileo Docs](https://sileo.aaryan.design/docs)
- [API Reference](https://sileo.aaryan.design/docs/api)
- [Styling Guide](https://sileo.aaryan.design/docs/styling)

## Notas Técnicas

- Sileo expone dos exports: `Toaster` (componente visor) y `sileo` (controlador global)
- Los estilos con `!` son necesarios para override de Tailwind CSS
- El border radius `roundness: 16` es el valor recomendado para equilibrio entre estética y rendimiento
- `autopilot` está activado por defecto (auto-expand y auto-collapse antes de dismiss)
- Duración predeterminada: 6000ms (`duration: 6000`)

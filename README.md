# SYSCOM Race Timing

Sistema de cronometraje, telemetría y pruebas técnicas para el **Reto Solar Chihuahua 2026**. Diseñado bajo un enfoque **Local-First** para operar de forma autónoma en localhost a través de salida HDMI directa, garantizando latencia cero sin dependencia de redes externas.

---

## Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | ^19.2.7 | UI SPA |
| Vite | ^8.1.1 | Build tool y dev server |
| Tailwind CSS | ^4.3.2 | Estilos utilitarios |
| Sileo | ^0.1.5 | Notificaciones toast |
| lucide-react | ^1.24.0 | Iconos |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Python | — | Lenguaje backend |
| FastAPI | 0.139.0 | Framework web asíncrono |
| Uvicorn | 0.51.0 | ASGI server |
| Websockets | 16.1 | Comunicación bidireccional |
| SQLite | (stdlib) | Base de datos local |

---

## Arquitectura

```
[Hardware: RFID / Cámaras / E/S]
         │  (Tramas vía TCP Sockets o Webhooks)
         ▼
[FastAPI / Python Backend] ──── (Worker asyncio)
         │
         ├─► [SQLite / WAL] (Persistencia)
         │
         └─► [WebSocket Server] (Broadcasting JSON)
                 │
                 ▼
      [React Frontend / Dashboard] (Tablero en tiempo real)
```

### Capas

1. **Hardware e Ingestión** — Lector RFID UHF, Cámara con radar Doppler, sensores vía TCP/Webhooks
2. **Procesamiento y Persistencia** — FastAPI escucha eventos, valida, aplica debounce, persiste en SQLite y broadcasting por WebSocket
3. **Presentación** — React SPA con WebSocket nativo, ordenamiento dinámico, visualización en Dashboard HDMI

---

## Estructura del Proyecto

```
syscom-race-timing/
├── backend/
│   ├── main.py                 # Servidor FastAPI + WebSocket + SQLite
│   ├── requirements.txt
│   └── venv/                   # Entorno virtual Python
├── database/
│   └── cronometraje.db         # Base de datos SQLite
├── docs/
│   ├── sileo.md                # Documentación de Sileo
│   └── ...                     # Documentación adicional
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Componente raíz + Toaster Sileo
│   │   ├── main.jsx            # Entry point React
│   │   ├── index.css           # Estilos globales + tema Tailwind v4
│   │   ├── theme.js            # Definición de temas (RACE / SYSCOM)
│   │   ├── components/         # Componentes de UI
│   │   │   ├── Sidebar.jsx
│   │   │   ├── EnduranceView.jsx
│   │   │   ├── TechnicalView.jsx
│   │   │   ├── SpeedTestPanel.jsx
│   │   │   ├── BrakeTestPanel.jsx
│   │   │   ├── PilotsView.jsx
│   │   │   ├── RecordsView.jsx
│   │   │   ├── SeguridadView.jsx
│   │   │   ├── CameraView.jsx
│   │   │   ├── CameraPanel.jsx
│   │   │   ├── CarCard.jsx
│   │   │   └── MetricCard.jsx
│   │   ├── hooks/              # Custom hooks con estado y persistencia
│   │   │   ├── useSimulatedRace.js
│   │   │   ├── usePilots.js
│   │   │   ├── useSeguridad.js
│   │   │   └── useCameraConfig.js
│   │   └── utils/
│   │       └── iconRenderer.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── architecture.md             # Documento detallado de arquitectura
└── README.md
```

---

## Vistas del Sistema

| Vista | Componente | Descripción |
|-------|-----------|-------------|
| **Carrera** | `EnduranceView` | Carrera de resistencia de 4h con cronómetro circular, líder, cámara y tabla de posiciones |
| **Técnicas** | `TechnicalView` | Pruebas de Velocidad (cronometraje manual) y Frenado (registro de distancia) |
| **Pilotos** | `PilotsView` | CRUD de pilotos con tarjetas, modal de formulario, selector de iconos |
| **Records** | `RecordsView` | Tabla de ranking con búsqueda, ordenamiento y estadísticas |
| **Seguridad** | `SeguridadView` | Checklist de equipamiento de seguridad por piloto |
| **Cámara** | `CameraView` | Configuración de cámara IP + preview en vivo |

---

## Feedback UI (Sileo)

Sileo reemplaza todos los diálogos nativos y agrega notificaciones toast consistentes. [Documentación completa →](docs/sileo.md)

### Toasts implementados

- CRUD pilotos (crear, editar, eliminar)
- Checklist de seguridad (marcar/desmarcar items)
- Configuración de cámara
- Registro de tiempos (velocidad y frenado)
- Control de carrera (iniciar, pausar, reiniciar)

---

## Ejecución Local

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # Producción
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Persistencia

| Clave localStorage | Tipo | Propósito |
|-------------------|------|-----------|
| `syscom_pilotos` | Array | Pilotos registrados |
| `syscom_seguridad` | Object | Checklists de seguridad |
| `syscom_camera_config` | Object | Configuración de cámara IP |
| `syscom_records_velocidad` | Array | Registros de prueba de velocidad |
| `syscom_records_frenado` | Array | Registros de prueba de frenado |

---

## Temas

El sistema soporta dos temas visuales intercambiables desde la barra lateral:

- **RACE** — Acento rojo (`#ea2d45`)
- **SYSCOM** — Acento azul (`#2c46a3`)

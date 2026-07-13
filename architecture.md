# Arquitectura del Sistema: SYSCOM-RACE-TIMING 2026

Este documento detalla la arquitectura de software y hardware local para el sistema de cronometraje, telemetría y pruebas técnicas del Reto Solar Chihuahua 2026. El sistema está diseñado bajo un enfoque "Local-First" para operar de manera autónoma en localhost a través de una salida HDMI directa, garantizando latencia cero y eliminando la dependencia de redes externas o conectividad a Internet.

---

## 1. Capas del Sistema

La arquitectura está dividida en tres capas principales desacopladas para asegurar la concurrencia y el procesamiento continuo de eventos de hardware.

### 1.1. Capa de Hardware e Ingestión
Esta capa abarca los dispositivos físicos provistos por SYSCOM que capturan los eventos en pista y en la zona de pruebas. Su integración se realiza mediante sockets externos y comunicación perimetral sin invadir los vehículos solares:

**NOTA:** Esta arquitectura puede cambiar a lo largo del proyecto dado que nos encontramos en una etapa de generación de ideas.

* **Lector RFID UHF de Largo Alcance:** Ubicado en la línea de meta. Lee tags pasivos (stickers o tarjetas UHF) adheridos a los autos y envía tramas de bytes crudas por protocolo TCP/IP al detectar cada cruce.
* **Cámara Hikvision con Radar Doppler Integrado:** Ubicada en la zona de pruebas técnicas. Mide la velocidad de los vehículos y genera una trama formateada en texto o evento HTTP al detectar el paso de un auto por el haz del radar.

### 1.2. Capa de Procesamiento y Persistencia (Backend)
Desarrollada en Python utilizando FastAPI debido a su alta eficiencia asíncrona para manejar streams de red en tiempo real.

* **Oyente TCP / Receptor de Webhooks:** Hilos asíncronos que escuchan los puertos locales dedicados a la cámara y al lector RFID. Reciben los datos crudos y los colocan de inmediato en una cola de eventos en memoria (`asyncio.Queue`) para evitar la pérdida de paquetes.
* **Motor de Reglas y Debounce:** Un proceso secundario (Worker) consume la cola de eventos y aplica la lógica de negocio. Para el lector RFID, implementa un filtro de rebote (Debounce) que ignora lecturas consecutivas del mismo tag en un margen corto de tiempo (ej. 2 segundos) ocasionadas por el paso lento del auto bajo la antena.
* **Base de Datos (SQLite en Modo WAL):** Un motor relacional local y ligero en un solo archivo. Se activa el modo Write-Ahead Logging (WAL) para permitir operaciones de escritura concurrentes ultrarrápidas sin bloquear las consultas de lectura simultáneas realizados por la interfaz.
* **Servidor WebSockets (Broadcast Manager):** Una vez que un cruce de meta o un registro de velocidad es validado y persistido en SQLite, este módulo serializa el evento en formato JSON y lo transmite inmediatamente a todas las conexiones frontend activas.

### 1.3. Capa de Presentación (Frontend)
Desarrollada en React estructurada mediante Vite para agilizar la compilación en local y estilizada con clases utilitarias de Tailwind CSS.

* **Cliente WebSocket Nativo:** Mantiene un canal de comunicación bidireccional activo con el servidor local del backend (`ws://localhost:8000/ws`).
* **Gestor de Estado y Ordenamiento:** Recibe los payloads de datos del WebSocket y actualiza un arreglo local. Realiza un ordenamiento dinámico basado en la cantidad de vueltas (para la carrera de resistencia) o por velocidades y distancias (para las pruebas técnicas).
* **Interfaz de Usuario Monopágina (SPA):** Diseñada en base a una paleta oscura industrial de alto rendimiento. Muestra los tableros de control principales dentro de un panel redondeado y contrastante a la derecha de la pantalla, el cual se proyecta de forma directa por salida de video HDMI hacia las pantallas del evento.

---

## 2. Flujo de Datos

El flujo del sistema opera de forma secuencial y local en la máquina de control:

1.  El hardware de SYSCOM (RFID o Radar) detecta el movimiento y envía un flujo de datos local a la computadora a través de la red local ethernet configurada.
2.  El backend en Python escucha el evento en el puerto designado, valida la estructura del payload e inserta el registro en la base de datos SQLite.
3.  Tras la confirmación de la inserción en la base de datos, el backend emite un mensaje JSON a través de WebSockets.
4.  El frontend en React captura el JSON, actualiza el estado local del componente específico en memoria y reordena la tabla de posiciones o las tarjetas de los autos en milisegundos.

---

## 3. Esquema de la Base de Datos (SQLite)

El almacenamiento en la base de datos local consta de tres tablas principales estructuradas para soportar la integridad referencial y búsquedas veloces:

```sql
-- Información general de los automóviles inscritos
CREATE TABLE IF NOT EXISTS autos (
    id TEXT PRIMARY KEY,
    matricula TEXT NOT NULL,
    equipo TEXT NOT NULL
);

-- Historial de vueltas para la carrera de resistencia de 4 horas
CREATE TABLE IF NOT EXISTS registro_vueltas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auto_id TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    tiempo_vuelta TEXT,
    FOREIGN KEY(auto_id) REFERENCES autos(id)
);

-- Datos arrojados por las pruebas técnicas individuales
CREATE TABLE IF NOT EXISTS pruebas_tecnicas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auto_id TEXT,
    tipo_prueba TEXT, -- Valores permitidos: 'velocidad' o 'frenado'
    valor REAL,       -- Representa km/h o metros según el tipo
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(auto_id) REFERENCES autos(id)
);

# COLORES PROPUESTOS

module.exports = {
  theme: {
    extend: {
      colors: {
        syscomBlue: '#00539B',     // Azul institucional de SYSCOM
        raceDark: '#111214',       // Fondo de la aplicación y barra lateral
        racePanelLight: '#F3F4F6', // Fondo del panel principal redondeado a la derecha
        raceAccentRed: '#E10600',  // Alertas, cronómetros y acentos críticos
        cardWhite: '#FFFFFF'       // Fondo de los componentes tipo tarjeta
      }
    }
  }
}

------------ ARQUITECTURA DEL HARDWARE CON VISTA Y CONTROLADOR ------------

[Hardware: RFID / Cámaras / E/S] 
             │ (Tramas directas vía TCP Sockets o Webhooks)
             ▼
    [FastAPI / Python Backend] ──── (Worker concurrente / Asyncio)
             │ 
             ├─► [Base de Datos Local: SQLite/PostgreSQL] (Persistencia)
             │
             └─► [WebSocket Server]
                     │ (Broadcasting instantáneo en JSON)
                     ▼
          [React Frontend / Dashboard] (Tablero de posiciones en tiempo real)
# PRD — App de Inglés B1 → B2 con SRS tipo Anki
**Versión:** 1.0  
**Autor:** Kiev  
**Fecha:** Junio 2026  
**Stack:** React (Vite) + Capacitor + Supabase + Dexie.js + Claude API

---

## 1. Resumen del Producto

Aplicación móvil/web híbrida de estudio de inglés personalizada, enfocada en llevar al usuario de nivel B1 a B2. Combina un sistema de flashcards con repetición espaciada (SRS tipo Anki), generación automática de tarjetas y cuestionarios con IA, y práctica de writing con feedback inteligente.

---

## 2. Objetivos

- Permitir al usuario ingresar notas/vocabulario libremente y convertirlos en material de estudio con IA.
- Implementar un sistema SRS que optimice la retención a largo plazo.
- Ofrecer práctica activa de writing con feedback orientado al nivel B2.
- Funcionar offline con sincronización a la nube.
- Instalable en Android como app nativa (APK via Capacitor).

---

## 3. Usuarios

- **Usuario principal:** Kiev (uso personal, no multiusuario en v1)
- **Dispositivos:** Android (primario) + navegador web (secundario)

---

## 4. Módulos y Requerimientos Funcionales

### 4.1 📝 Módulo de Notas (Ingreso de Vocabulario)
- [ ] Campo de texto libre para ingresar palabras, frases o ejemplos
- [ ] Soporte de entrada en español, inglés o mezclado
- [ ] Selector de modo de salida: **Flashcard** o **Cuestionario**
- [ ] Botón "Generar con IA" que llama a Claude API
- [ ] Historial de notas ingresadas (guardado local)

---

### 4.2 🃏 Módulo de Flashcards (SRS tipo Anki)
- [ ] Estructura de tarjeta: `frente` (inglés) | `reverso` (español) | `ejemplo` (oración)
- [ ] Vista de tarjeta con animación flip
- [ ] Sistema de calificación por tarjeta al estilo Anki:
  - 🔴 **Again** — reinicia intervalo (revisión en minutos)
  - 🟠 **Hard** — reduce intervalo
  - 🟢 **Good** — intervalo normal
  - 💙 **Easy** — intervalo largo
- [ ] Algoritmo SRS (basado en SM-2):
  - Calcular próxima fecha de revisión según calificación
  - Factor de facilidad (ease factor) por tarjeta
  - Contador de repeticiones por tarjeta
- [ ] Cola de revisión diaria: mostrar solo tarjetas que toca repasar hoy
- [ ] Indicador de tarjetas pendientes del día
- [ ] Separación de estados: **Nueva** | **Aprendiendo** | **Repaso** | **Suspendida**

---

### 4.3 ❓ Módulo de Cuestionario
- [ ] Preguntas de opción múltiple generadas por IA desde las notas
- [ ] Feedback inmediato por respuesta (correcto/incorrecto)
- [ ] Puntaje final al completar
- [ ] Opción de reintentar cuestionario

---

### 4.4 ✍️ Módulo de Writing
- [ ] Generación de prompt de escritura por IA (tema B1-B2)
- [ ] Campo de texto para respuesta del usuario en inglés
- [ ] Feedback en español de la IA enfocado en:
  - Gramática
  - Variedad de vocabulario nivel B2
  - Coherencia y cohesión
- [ ] Historial de sesiones de writing guardado

---

### 4.5 📊 Módulo de Progreso
- [ ] Contador de tarjetas creadas
- [ ] Contador de cuestionarios completados
- [ ] Contador de sesiones de writing
- [ ] Barra de progreso hacia B2 (meta: 50 flashcards dominadas)
- [ ] Racha de días de estudio consecutivos (streak)
- [ ] Estadísticas SRS: tarjetas nuevas / aprendiendo / maduras

---

### 4.6 🌙 UI/UX
- [ ] Modo oscuro / modo claro con toggle
- [ ] Diseño mobile-first responsive
- [ ] Notificaciones push diarias: "¡Tienes X tarjetas para repasar hoy!" (via Capacitor)
- [ ] Instalable como PWA / APK (Capacitor)

---

## 5. Requerimientos No Funcionales

### 5.1 Persistencia y Datos
- [ ] **Dexie.js (IndexedDB):** almacenamiento local offline-first
- [ ] **Supabase (PostgreSQL):** sincronización en la nube
- [ ] Sincronización automática cuando hay conexión a internet
- [ ] Sin pérdida de datos si se pierde conexión

### 5.2 IA
- [ ] Integración con **Claude API** (`claude-sonnet-4-6`)
- [ ] Generación de flashcards en formato JSON estructurado
- [ ] Generación de cuestionarios en formato JSON estructurado
- [ ] Generación de prompts de writing
- [ ] Feedback de writing en lenguaje natural (español)

### 5.3 Performance
- [ ] Tiempo de respuesta de la IA < 5 segundos
- [ ] App funcional completamente offline (sin IA)
- [ ] Carga inicial < 2 segundos

---

## 6. Schema de Base de Datos (Supabase)

```sql
-- Flashcards
CREATE TABLE flashcard (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  frente        TEXT NOT NULL,         -- palabra en inglés
  reverso       TEXT NOT NULL,         -- traducción en español
  ejemplo       TEXT,                  -- oración de ejemplo
  estado        TEXT DEFAULT 'nueva',  -- nueva | aprendiendo | repaso | suspendida
  intervalo     INT DEFAULT 0,         -- días hasta próxima revisión
  ease_factor   FLOAT DEFAULT 2.5,     -- factor de facilidad SM-2
  repeticiones  INT DEFAULT 0,         -- veces revisada correctamente
  proxima_revision DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Sesiones de Writing
CREATE TABLE writing_sesion (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt      TEXT NOT NULL,
  respuesta   TEXT NOT NULL,
  feedback    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Cuestionarios
CREATE TABLE cuestionario (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preguntas   JSONB NOT NULL,
  puntaje     INT,
  total       INT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Estadísticas diarias
CREATE TABLE estadistica_diaria (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha            DATE UNIQUE DEFAULT CURRENT_DATE,
  tarjetas_vistas  INT DEFAULT 0,
  minutos_estudio  INT DEFAULT 0,
  streak           INT DEFAULT 0
);
```

---

## 7. Algoritmo SRS (SM-2 simplificado)

```
Calificación del usuario → [0=Again, 1=Hard, 2=Good, 3=Easy]

Si calificación < 2 (Again / Hard):
  repeticiones = 0
  intervalo = 1 día

Si calificación >= 2 (Good / Easy):
  Si repeticiones == 0: intervalo = 1
  Si repeticiones == 1: intervalo = 6
  Si repeticiones > 1:  intervalo = intervalo_anterior × ease_factor

ease_factor = ease_factor + (0.1 - (3 - calificación) × 0.08)
ease_factor = max(1.3, ease_factor)  // mínimo 1.3

proxima_revision = hoy + intervalo días
```

---

## 8. Estructura del Proyecto

```
english-app/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/
├── src/
│   ├── api/
│   │   └── claude.js          # llamadas a Claude API
│   ├── db/
│   │   ├── dexie.js           # schema IndexedDB local
│   │   └── supabase.js        # cliente Supabase
│   ├── hooks/
│   │   ├── useFlashcards.js
│   │   ├── useSRS.js          # lógica del algoritmo SM-2
│   │   └── useSync.js         # sincronización local ↔ nube
│   ├── components/
│   │   ├── FlashCard.jsx
│   │   ├── QuizCard.jsx
│   │   └── WritingPanel.jsx
│   ├── pages/
│   │   ├── Progreso.jsx
│   │   ├── Notas.jsx
│   │   ├── Flashcards.jsx
│   │   ├── Cuestionario.jsx
│   │   └── Writing.jsx
│   ├── store/
│   │   └── appStore.js        # Zustand global state
│   ├── App.jsx
│   └── main.jsx
├── capacitor.config.ts        # config Capacitor (Android)
├── vite.config.js
└── index.html
```

---

## 9. Roadmap por Fases

| Fase | Contenido | Estado |
|------|-----------|--------|
| **Fase 1** | Proyecto base Vite + React + estructura de carpetas | 🔜 Siguiente |
| **Fase 2** | Dexie.js + schema local + CRUD de flashcards | ⏳ Pendiente |
| **Fase 3** | Algoritmo SRS (SM-2) + cola de revisión diaria | ⏳ Pendiente |
| **Fase 4** | Integración Claude API (flashcards + quiz + writing) | ⏳ Pendiente |
| **Fase 5** | Módulo de Writing con feedback IA | ⏳ Pendiente |
| **Fase 6** | UI completa + modo oscuro + mobile-first | ⏳ Pendiente |
| **Fase 7** | Supabase + sincronización offline/online | ⏳ Pendiente |
| **Fase 8** | Capacitor → APK Android + notificaciones push | ⏳ Pendiente |

---

## 10. Dependencias Principales

```json
{
  "react": "^18",
  "vite": "^5",
  "dexie": "^3",
  "@supabase/supabase-js": "^2",
  "zustand": "^4",
  "@capacitor/core": "^6",
  "@capacitor/android": "^6",
  "@capacitor/push-notifications": "^6",
  "vite-plugin-pwa": "^0.19"
}
```
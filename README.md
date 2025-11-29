# 🎮 SteamFront - Frontend SPA para Steam Group

Interfaz web para gestionar compras compartidas de juegos de Steam en grupo, conectada a la API REST de Steam (FastAPI, Supabase, Cloudinary). Construida con **React + Vite** para máxima velocidad y experiencia moderna.

---

## 🌐 Despliegue

- **Producción:** [Vercel](https://vercel.com/) (SPA con rutas protegidas)
- **Desarrollo local:** Vite + React

---

## 🚀 Características

- Autenticación segura (JWT, cookies HTTPOnly)
- Gestión de depósitos y saldo en tiempo real
- Propuestas de juegos y votación única
- Compras compartidas con split automático (40/60)
- Panel de control para el Master
- Visualización de historial y estadísticas
- Subida y edición de imagen de perfil (Cloudinary)
- Optimización de llamadas API (actualizaciones optimistas)
- SPA con rutas protegidas y navegación fluida

---

## 📦 Estructura del proyecto

```
src/
  App.jsx                # Rutas principales y layout
  main.jsx               # Entrada de la app
  context/AuthContext.jsx# Contexto global de autenticación
  data/
    api/                 # Configuración de axios y Supabase
    services/            # Servicios para consumir la API
    mock/                # Datos de prueba
    domain/entities/     # Modelos de dominio
  presentation/
    components/          # Componentes reutilizables (cards, sidebar, spinner, etc.)
    pages/               # Páginas principales (Login, Home, Propuestas, Compras, etc.)
public/
  images/                # Imágenes estáticas
```

---

## 🔧 Instalación y ejecución

1. **Clona el repositorio:**
   ```bash
   git clone <tu-repo>
   cd steamfront
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Configura variables de entorno:**
   - Crea un archivo `.env` en la raíz con tus URLs de API y claves públicas de Supabase/Cloudinary.

   Ejemplo:
   ```
   VITE_API_URL=https://<tu-api-backend>
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_KEY=tu_supabase_anon_key
   VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
   ```

4. **Ejecuta en desarrollo:**
   ```bash
   npm run dev
   ```

5. **Despliega en Vercel:**
   - El proyecto está listo para deploy automático en Vercel.
   - Incluye `vercel.json` para rutas SPA.

---

## 🖼️ Gestión de imágenes de perfil

- Subida directa a Cloudinary desde el frontend.
- Visualización de avatar optimizado en toda la app.
- Edición y borrado de imagen de perfil.

---

## 🔐 Autenticación y roles

- Login y registro con email y contraseña.
- Recuperación de contraseña vía Supabase.
- Roles: Master (control total) y usuarios normales.
- Rutas protegidas según rol.

---

## 🛠️ Servicios y consumo de API

- **authService:** Login, registro, recuperación de contraseña, gestión de perfil.
- **depositService:** Consulta y registro de depósitos.
- **proposalService:** Propuestas, votación, selección de ganador.
- **purchaseService:** Compras y participaciones.

---

## 🧑‍💻 Desarrollo y contribución

- Código modular y fácil de extender.
- Componentes reutilizables y estilos desacoplados.
- Optimización de llamadas API para UX instantánea.
- Pruebas unitarias recomendadas (no incluidas por defecto).


## 📚 Documentación adicional

- [Documentación FastAPI (backend)](https://fastapi.tiangolo.com/)
- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Cloudinary](https://cloudinary.com/documentation)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)

---

## 👤 Autor

**ManguinhoEXE**

---

## 🎮 ¡Disfruta tu biblioteca compartida de Steam!

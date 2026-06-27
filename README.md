# Futbol App — Frontend React

Frontend para el sistema de gestión de Fútbol 5 Real Madrid, conectado a `https://futbol-practica.onrender.com`.

## Estructura

```
src/
├── api/          → Cliente HTTP (fetch + JWT)
├── context/      → AuthContext (token, usuario)
├── components/   → Sidebar, Modal, Toast
├── hooks/        → useToast
├── pages/        → AuthPage, Dashboard, Players, Trainings, Results
├── App.jsx       → Rutas y layout
└── index.css     → Estilos globales
```

## Instalación y uso

```bash
npm install
npm start
```

La app corre en `http://localhost:3000`.

## Cambiar la URL del backend

Edita `src/api/index.js`, línea 1:

```js
const BASE = 'https://futbol-practica.onrender.com/api/v1/RealMadrid';
```

## Build para producción

```bash
npm run build
```

Genera la carpeta `build/` lista para desplegar en Netlify, Vercel, o Render.

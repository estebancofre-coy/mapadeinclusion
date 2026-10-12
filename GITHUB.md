# Guía: subir este proyecto a GitHub

## 1. Crear el repositorio

En github.com → **New repository** → nombre sugerido: `visibilizar-es-intervenir`
→ **sin** README, .gitignore ni licencia (este paquete ya los trae) → Create.

## 2. Subir el código

Descomprime el ZIP, entra a la carpeta y ejecuta:

```bash
git init -b main
git add .
git commit -m "Plataforma Visibilizar es Intervenir — versión inicial"
git remote add origin https://github.com/TU-USUARIO/visibilizar-es-intervenir.git
git push -u origin main
```

## 3. Verificación antes del push

- [ ] El archivo `.env` **no** está en la carpeta (solo `.env.example`). Verifica con `ls -la`.
- [ ] No hay carpeta `node_modules` ni `dist` (se regeneran con `npm install` / `npm run build`).
- [ ] `git status` no lista ningún archivo con credenciales.

## 4. Después del push

- Clona en otro equipo: `git clone <url>` → `npm install` → `cp .env.example .env` → completar credenciales → `npm run dev`.
- Si el repo es público, considera cambiar las contraseñas demo del panel en `src/data/organizaciones.ts` antes de compartir el enlace.

## 5. Despliegue continuo (opcional)

El proyecto compila con `npm run build` y arranca con `npm start` (puerto 3000), por lo que es compatible con cualquier VPS, Railway, Render o el servidor de la universidad. Recuerda definir `DATABASE_URL` como variable de entorno del servicio.

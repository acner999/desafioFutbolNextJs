# Contributing

Gracias por querer contribuir. Pautas rápidas:

- Haz fork y PR hacia la rama `main` o la rama que se indique.
- Antes de PR: `npm install` y `node node_modules/next/dist/bin/next build` para comprobar compilación.
- Para cambios en la base de datos, añade migraciones en `sql/schema.sql` y actualiza `scripts/seed-db.js` si es necesario.
- Añade tests cuando corresponda y describe los pasos para reproducir el cambio en la descripción del PR.

Si necesitas ayuda, abre un issue describiendo el objetivo.

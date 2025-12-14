**Ejemplo API - Inicialización con Node.js, Express y TypeScript**

**Instalación y comandos**
- **Inicializar proyecto**: ejecuta el siguiente comando para crear `package.json` por defecto:

```powershell
npm init -y
```

- **Instalar dependencias (runtime)**: instala Express, Axios y dotenv:

```powershell
npm install express axios dotenv
```

- **Instalar dependencias de desarrollo**: TypeScript, herramientas para ejecutar/recargar en caliente y tipos:

```powershell
npm install -D typescript ts-node ts-node-dev nodemon @types/node @types/express
```

- **Crear `tsconfig.json`**: genera un `tsconfig.json` base (luego puedes ajustar opciones):

```powershell
npx tsc --init ó npm run build -- --init
```

Recomendación: en `tsconfig.json` establece al menos:

- `rootDir`: `"./src"`
- `outDir`: `"./dist"`
- `esModuleInterop`: `true`

- **Agregar scripts útiles al `package.json`** (ejecuta estos comandos o copia en la sección `scripts`):

```powershell
//comando para ejecutar con ts-node-dev con ESM
npm set-script dev "ts-node-dev --respawn --transpile-only src/app.ts"
//comando para ejecutar con nodemon con ESM
npm set-script dev:nodemon "nodemon --watch src --exec \"ts-node\" src/app.ts"
//comando para ejecutar con nodemon con "type": "module"
npm set-script dev:nodemon-con-module "nodemon -L --watch src --ext ts,js,json --exec \"node --loader ts-node/esm src/app.ts\""
//comando para compilar de typescript a javascript
npm set-script build "tsc"
//comando para ejecutar el archivo JavaScript app.js con Node (normalmente el código generado por TypeScript). primero ejecutar npm run //build para construir la carpeta dist
npm set-script start "node dist/app.js"
```

```powershell
# Alternativa recomendada cuando en `package.json` usas "type": "module":
# (usa nodemon con polling y el loader ESM para ts-node)
npm set-script dev "nodemon -L --watch src --ext ts,js,json --exec \"node --loader ts-node/esm src/app.ts\""
```

- **Variables de entorno**: crea un archivo `.env` con variables básicas:

```powershell
# Crea archivo .env con variables básicas
Set-Content -Path .env -Value "PORT=3000`nNODE_ENV=development"
```

- **Estructura mínima y archivos de ejemplo**: crea la carpeta `src` y los archivos `app.ts` y `server.ts` con contenido básico.

```powershell
# Crear carpeta src
mkdir src

# Crear app.ts (configura Express y dotenv)
Set-Content -Path src/app.ts -Value "import express from 'express';`nimport dotenv from 'dotenv';`ndotenv.config();`nconst app = express();`napp.use(express.json());`napp.get('/', (_req, res) => res.json({ ok: true }));`nexport default app;"

# Crear server.ts (arranca el servidor)
Set-Content -Path src/server.ts -Value "import app from './app';`nconst PORT = process.env.PORT || 3000;`napp.listen(PORT, () => console.log(`Server running on port ${PORT}`));"
```

- **Instalar axios** (si no se instaló arriba):

```powershell
npm install axios
```

- **Instalar cors** (si no se instaló arriba):

```powershell
Para typescript:
npm i --save-dev @types/cors 

Para javascript:
npm i cors 
```

- **Comandos rápidos**:

```powershell
# Desarrollo (recarga automática)
npm run dev

# Compilar TypeScript a JavaScript
npm run build

# Ejecutar la build compilada
npm run start
```

**Notas y recomendaciones**
- `ts-node-dev` ofrece recarga rápida y es conveniente para desarrollo; `nodemon` + `ts-node` es una alternativa.
- Asegúrate de llamar a `dotenv.config()` (como en `src/app.ts`) antes de leer `process.env`.
- Ajusta `tsconfig.json` según necesidades del proyecto (ej. `strict`, `target`, `moduleResolution`).
- Si quieres, puedo aplicar automáticamente estos cambios en tu proyecto (crear archivos y actualizar `package.json`).

Nota importante sobre `type: "module"` y recarga en desarrollo
- Si en `package.json` pones `"type": "module"`, Node carga módulos como ESM. El script
	`"dev": "ts-node-dev --respawn --transpile-only src/app.ts"` falla porque `ts-node-dev`
	arranca con un cargador CommonJS por defecto y Node lanza: `Must use import to load ES Module`.

- Para que funcione `nodemon` con ESM y que el servidor se reinicie al guardar, usa el script:

```jsonc
"dev": "nodemon -L --watch src --ext ts,js,json --exec \"node --loader ts-node/esm src/app.ts\""
```

- Alternativa con `ts-node-dev` (si tu versión lo soporta):

```jsonc
"dev": "ts-node-dev --respawn --transpile-only --esm src/app.ts"
```

Cómo cambiar de CommonJS a ESM (usar `import` en vez de `require`)
1. En `package.json` añade o cambia la propiedad a: `"type": "module"`.
2. En `tsconfig.json` usa estas opciones recomendadas:

```jsonc
"compilerOptions": {
	"module": "nodenext",
	"moduleResolution": "nodenext",
	"target": "esnext",
	"rootDir": "./src",
	"outDir": "./dist",
	"esModuleInterop": true
}
```

3. Ajusta las importaciones en tus archivos `.ts` según ESM:
	 - Para importar archivos locales cuando ejecutes con Node ESM, agrega la extensión `.js` en tiempo de ejecución
		 si tu código se ejecuta como JavaScript (por ejemplo: `import Server from './server.js'`). TypeScript con
		 `module: "nodenext"` suele ayudar a resolver/emitir correctamente las extensiones al compilar.
4. Compila antes de ejecutar en producción: `npm run build` y luego `node dist/app.js` (asegúrate de que
	 la ruta coincida con tu `outDir`; por ejemplo `dist/app.js` si `rootDir` es `src`).
5. Para desarrollo sin compilar, usa el loader ESM de `ts-node`:

```powershell
node --loader ts-node/esm src/app.ts
# o con nodemon:
npm run dev
```

Con estos pasos podrás utilizar `import`/`export` nativamente y mantener recarga automática en desarrollo.

---

Contenido añadido automáticamente: comandos, ejemplos y notas para iniciar desde cero un proyecto con Node.js, Express y TypeScript.


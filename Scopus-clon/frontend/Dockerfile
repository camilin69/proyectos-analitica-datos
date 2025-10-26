# Usar Node.js 22 para desarrollo
FROM node:22-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto de desarrollo
EXPOSE 4200

# Health check para desarrollo
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:4200', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Comando para desarrollo con hot-reload
CMD ["npm", "start"]
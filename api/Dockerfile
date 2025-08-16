# Etapa de construcción
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install --production

# Copiar el código fuente
COPY . .

# Construir la aplicación (compilar TypeScript)
RUN npm run build

# Etapa de producción
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar las dependencias y los archivos construidos desde la etapa de construcción
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/.env /app/.env

# Exponer el puerto en el que se ejecutará la app
EXPOSE 5000

# Iniciar la aplicación en producción usando pm2 o node
CMD ["node", "dist/index.js"]
# 1️⃣ Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar solo los archivos esenciales para instalar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias sin generar archivos innecesarios
RUN npm install

# Copiar todo el código fuente
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# 2️⃣ Etapa final: Servir la aplicación en producción
FROM node:18-alpine

WORKDIR /app

# Copiar solo los archivos esenciales desde la etapa anterior
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Exponer el puerto en el que corre Next.js
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["npm", "run", "start"]

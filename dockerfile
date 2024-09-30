# Usa una imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo en /app
WORKDIR /usr/src/app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install 

# Copia el resto de la aplicación
COPY . .

RUN npx prisma generate
# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3002

# Használjuk a hivatalos Node.js alap imázst
FROM node:14

# Állítsuk be a munkakönyvtárat a konténerben
WORKDIR /usr/src/app

# Másoljuk a függőségi definíciókat és a csomagokat
COPY package*.json ./

# Telepítsük a függőségeket
RUN npm install

# Másoljuk az alkalmazás forráskódját a konténerbe
COPY . .

# Exportáljuk a szükséges portot
EXPOSE 3000

# Indítsuk el az alkalmazást
CMD ["npm", "start"]
FROM node:lts AS build

WORKDIR /app

COPY package.json . 

RUN npm install react@18 react-dom@18

COPY . .

RUN npm run build


FROM nginx:1.29.3-alpine AS server

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

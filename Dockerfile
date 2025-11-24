FROM node:lts AS build
WORKDIR /app

COPY package.json . 

RUN npm install react@18 react-dom@18

COPY . .

RUN npm run build


FROM nginx:1.29.3-alpine AS server

RUN mkdir -p /usr/share/nginx/html

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

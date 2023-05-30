FROM node:lts-alpine3.13 as builder-new

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


FROM nginx:stable-alpine

COPY --from=builder-new /app/build /mnt/build

COPY nginx /etc/nginx

CMD ["nginx", "-g", "daemon off;"]
FROM node:16-alpine3.13 as builder-new
RUN adduser --disabled-password --gecos "" exl_cap_user
WORKDIR /app
COPY package.json .
RUN chown -R exl_cap_user:exl_cap_user /app
USER exl_cap_user
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:stable-alpine
RUN adduser --disabled-password --gecos "" exl_cap_user
COPY --from=builder-new /app/build /mnt/build
COPY nginx /etc/nginx
RUN chown -R exl_cap_user:exl_cap_user /mnt/build /etc/nginx /var/log/nginx /var/cache/nginx /var/run /run
USER exl_cap_user
CMD ["nginx", "-g", "daemon off;"]
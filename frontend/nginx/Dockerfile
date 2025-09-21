# Usa a imagem leve do NGINX
FROM nginx:stable-alpine

# Copia frontend para o diretório do NGINX
COPY ../frontend/ /usr/share/nginx/html

# Copia configuração personalizada do NGINX
COPY default.conf /etc/nginx/conf.d/default.conf

# Expondo porta do frontend
EXPOSE 8080

# Inicia o NGINX
CMD ["nginx", "-g", "daemon off;"]

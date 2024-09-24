FROM node
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# RUN chmod +x ./entrypoint.sh
RUN node ./seeds.js
EXPOSE 3000
# ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server"]

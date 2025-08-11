FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 安装Ollama
RUN curl -L -o /tmp/install.sh https://ollama.ai/install.sh && \
    chmod +x /tmp/install.sh && \
    /tmp/install.sh

CMD ["npm", "run", "server"]
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema mínimas
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Crear directorio de cache y symlink AL DIRECTORIO COMPARTIDO
RUN mkdir -p /root/.cache && \
    rm -rf /root/.cache/chroma && \
    ln -s /shared_model_cache /root/.cache/chroma

# Copiar requirements primero para cachear dependencias
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación (SIN preload_model.py)
COPY . .

# Exponer puerto
EXPOSE 5001

# Script de espera mejorado
COPY wait-for-chroma.sh .
RUN chmod +x wait-for-chroma.sh

# Comando para inicializar ChromaDB y luego ejecutar la aplicación
CMD ["./wait-for-chroma.sh"]
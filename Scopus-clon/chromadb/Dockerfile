FROM chromadb/chroma:0.4.15

# Forzar la versión compatible de NumPy
RUN pip uninstall -y numpy onnxruntime
RUN pip install numpy==1.24.3 onnxruntime==1.16.0

# Crear directorio para el cache compartido
RUN mkdir -p /shared_model_cache

# Crear symlink para que ChromaDB use el cache compartido
RUN mkdir -p /root/.cache && \
    rm -rf /root/.cache/chroma && \
    ln -s /shared_model_cache /root/.cache/chroma

# Copiar el script de pre-carga
COPY preload_model.py .

# Ejecutar el script de pre-carga durante el build
RUN python preload_model.py

# Limpiar cache
RUN pip cache purge

# Comando por defecto de ChromaDB
CMD ["uvicorn", "chromadb.app:app", "--host", "0.0.0.0", "--port", "8000"]
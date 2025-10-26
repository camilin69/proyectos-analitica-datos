# chromadb/Dockerfile
FROM chromadb/chroma:0.4.15

# Forzar la versión compatible de NumPy
RUN pip uninstall -y numpy onnxruntime
RUN pip install numpy==1.24.3 onnxruntime==1.16.0

# Limpiar cache
RUN pip cache purge
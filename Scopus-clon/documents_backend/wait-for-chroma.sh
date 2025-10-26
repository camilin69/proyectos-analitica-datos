#!/bin/bash

set -e

echo "🔍 ============ INICIANDO SCRIPT DE ESPERA ============"

echo "🔍 Verificando directorio de trabajo..."
pwd
ls -la

echo "🔍 Verificando directorio de cache compartido..."
echo "📁 Contenido de /shared_model_cache:"
find /shared_model_cache -type f 2>/dev/null | head -20 || echo "⚠️ Directorio de cache vacío o no accesible"

echo "🔍 Verificando symlink del cache..."
ls -la /root/.cache/ | grep chroma || echo "⚠️ Symlink no encontrado"

echo "⏳ Esperando a ChromaDB en chromadb:8000..."
counter=0
max_attempts=30

until curl -f http://chromadb:8000/api/v1/heartbeat > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -ge $max_attempts ]; then
        echo "❌ ChromaDB no está disponible después de $max_attempts intentos"
        exit 1
    fi
    echo "⌛ Intento $counter/$max_attempts - ChromaDB no está listo..."
    sleep 2
done

echo "✅ ChromaDB está listo!"

# Esperar para asegurar inicialización completa
echo "⏳ Esperando inicialización completa del servidor ChromaDB..."
sleep 5

echo "🚀 Iniciando inicialización de la colección..."

# Verificar que el script de inicialización existe
if [ -f "initialize_chroma.py" ]; then
    echo "📄 Ejecutando initialize_chroma.py..."
    if python initialize_chroma.py; then
        echo "🎉 ChromaDB inicializado exitosamente"
    else
        echo "⚠️ Inicialización de ChromaDB falló, continuando en modo degradado"
    fi
else
    echo "❌ No se encontró initialize_chroma.py"
    ls -la *.py
fi

echo "🚀 Iniciando aplicación Flask..."
exec python app.py
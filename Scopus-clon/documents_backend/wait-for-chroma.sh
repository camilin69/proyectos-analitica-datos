#!/bin/bash

set -e

echo "🔍 ============ INICIANDO SCRIPT DE ESPERA ============"

echo "🔍 Verificando directorio de trabajo..."
pwd
ls -la

echo "🔍 Verificando curl..."
which curl
curl --version

echo "🔍 Verificando conectividad de red..."
ping -c 2 chromadb || echo "⚠️ Ping falló, continuando..."
nslookup chromadb || echo "⚠️ DNS lookup falló, continuando..."

echo "🔍 Verificando directorio de cache compartido..."
echo "📁 Contenido de /shared_model_cache:"
find /shared_model_cache -type f 2>/dev/null | head -10

echo "🔍 Verificando symlink del cache..."
ls -la /root/.cache/ | grep chroma || echo "⚠️ Symlink no encontrado"

echo "⏳ Esperando a ChromaDB en chromadb:8000..."
counter=0
max_attempts=30

until curl -f http://chromadb:8000/api/v1/heartbeat > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -ge $max_attempts ]; then
        echo "❌ ChromaDB no está disponible después de $max_attempts intentos"
        echo "🔍 Último error de curl:"
        curl -v http://chromadb:8000/api/v1/heartbeat || true
        exit 1
    fi
    echo "⌛ Intento $counter/$max_attempts - ChromaDB no está listo..."
    sleep 2
done

echo "✅ ChromaDB está listo!"

echo "⏳ Esperando inicialización completa del servidor ChromaDB..."
sleep 10

echo "🚀 Iniciando inicialización de la colección..."

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
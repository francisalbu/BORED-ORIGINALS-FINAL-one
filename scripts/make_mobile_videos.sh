#!/bin/bash
# ============================================================
# Gera versões "mobile" leves dos vídeos hero e faz upload ao
# Supabase Storage com o sufixo "-mobile.mp4".
#
# Convenção: para cada vídeo  X.mp4  cria  X-mobile.mp4  no mesmo
# bucket. O frontend (função mobileVideo() no App.tsx) deriva o URL
# mobile automaticamente, por isso basta correr este script sempre
# que se adiciona um novo hero_video.
#
# Requisitos: ffmpeg, curl, python3 e VITE_SUPABASE_SERVICE_KEY no .env
# Uso:  bash scripts/make_mobile_videos.sh
# ============================================================
set -euo pipefail

cd "$(dirname "$0")/.."

URL=$(grep VITE_SUPABASE_URL .env | cut -d= -f2- | tr -d '"'"'"' ')
SVC=$(grep VITE_SUPABASE_SERVICE_KEY .env | cut -d= -f2- | tr -d '"'"'"' ')
BUCKET="Originals"
PUBLIC="${URL}/storage/v1/object/public/${BUCKET}"
UPLOAD="${URL}/storage/v1/object/${BUCKET}"

# Ficheiros (nome URL-encoded tal como no Storage) a processar.
files=(
  "PICO%20ISLAND%20%20FAIAL%20AZORES%20PORTUGAL%20DRONE%204K_1.mp4"
  "videosobrevivencia.mp4"
  "marvaovideo.mp4"
  "bored_velaalgarve.mp4"
  "cabinevideo.mp4"
  "santiago_newvideo.mp4"
  "vicentina.mp4"
)

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

for enc in "${files[@]}"; do
  dec=$(python3 -c "import urllib.parse,sys;print(urllib.parse.unquote(sys.argv[1]))" "$enc")
  out_dec="${dec%.mp4}-mobile.mp4"
  out_enc=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$out_dec")

  echo "──────────────────────────────────────────────"
  echo "▶ ${dec}"

  curl -s -o "${work}/in.mp4" "${PUBLIC}/${enc}"
  in_mb=$(ls -l "${work}/in.mp4" | awk '{printf "%.1f", $5/1048576}')

  # Maior dimensão ≤ 1080, dimensões pares, sem áudio (são background muted).
  ffmpeg -y -loglevel error -i "${work}/in.mp4" -an \
    -vf "scale='min(1080,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 30 -preset medium \
    -movflags +faststart "${work}/out.mp4"
  out_mb=$(ls -l "${work}/out.mp4" | awk '{printf "%.1f", $5/1048576}')

  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${UPLOAD}/${out_enc}" \
    -H "Authorization: Bearer ${SVC}" \
    -H "Content-Type: video/mp4" \
    -H "Cache-Control: public, max-age=31536000, immutable" \
    -H "x-upsert: true" \
    --data-binary @"${work}/out.mp4")

  echo "  ${in_mb}MB → ${out_mb}MB   upload HTTP ${code}   → ${out_dec}"
done

echo "──────────────────────────────────────────────"
echo "✅ Concluído."

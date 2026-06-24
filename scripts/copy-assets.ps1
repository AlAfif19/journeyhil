$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$destRoot = Join-Path $root "public/assets"
New-Item -ItemType Directory -Force -Path $destRoot | Out-Null

$files = @(
  @{ Source = "keperluan/foto hilfia sendiri/hilfia keren.jpeg"; Dest = "photos/hero-hilfia-keren.jpeg" },
  @{ Source = "keperluan/foto hilfia sendiri/cutee.jpeg"; Dest = "photos/hilfia-cutee.jpeg" },
  @{ Source = "keperluan/foto hilfia sendiri/hilfia clean ( bisa jadi hero ).jpeg"; Dest = "photos/hilfia-clean.jpeg" },
  @{ Source = "keperluan/foto hilfia sendiri/hilfia baju hmtl.jpeg"; Dest = "photos/hilfia-hmtl.jpeg" },
  @{ Source = "keperluan/foto galeri/mentor & anak.jpg"; Dest = "gallery/mentor-anak.jpg" },
  @{ Source = "keperluan/foto galeri/main ke cafe.jpg"; Dest = "gallery/main-ke-cafe.jpg" },
  @{ Source = "keperluan/foto galeri/main di taman.jpg"; Dest = "gallery/main-di-taman.jpg" },
  @{ Source = "keperluan/foto galeri/foto bareng dpm.jpg"; Dest = "gallery/foto-bareng-dpm.jpg" },
  @{ Source = "keperluan/foto galeri/gaya wajib komisi 1 lucu.jpg"; Dest = "gallery/komisi-1-lucu.jpg" },
  @{ Source = "keperluan/smk 13 bandung.jpg"; Dest = "places/smk-13-bandung.jpg" },
  @{ Source = "keperluan/universitas kebangsaan republik indonesia.webp"; Dest = "places/universitas-kebangsaan.webp" },
  @{ Source = "keperluan/kamar kuromi pixel game.png"; Dest = "game/kuromi-room.png" },
  @{ Source = "keperluan/kuromi pixel.png"; Dest = "game/kuromi-pixel.png" },
  @{ Source = "keperluan/kuromi 2d.png"; Dest = "game/kuromi-2d.png" },
  @{ Source = "keperluan/aset game.png"; Dest = "game/game-assets.png" },
  @{ Source = "keperluan/hiasan game.png"; Dest = "game/game-decor.png" }
)

foreach ($file in $files) {
  $source = Join-Path $root $file.Source
  $dest = Join-Path $destRoot $file.Dest
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dest) | Out-Null
  Copy-Item -LiteralPath $source -Destination $dest -Force
}

$ErrorActionPreference = "Stop"

function Convert-ToSlug {
  param([string] $Value)

  $slug = $Value.ToLowerInvariant()
  $slug = $slug -replace '[^a-z0-9]+', '-'
  $slug = $slug.Trim('-')
  if ([string]::IsNullOrWhiteSpace($slug)) {
    return "asset"
  }
  return $slug
}

function Get-AssetCategory {
  param([string] $RelativePath)

  if ($RelativePath -like "aset game/*") { return "game" }
  if ($RelativePath -like "assets 3d overlay/*") { return "overlay3d" }
  if ($RelativePath -like "foto galeri/*") { return "gallery" }
  if ($RelativePath -like "foto hilfia sendiri/*") { return "profile" }
  if ($RelativePath -like "smk*" -or $RelativePath -like "universitas*") { return "place" }
  return "misc"
}

$root = Split-Path -Parent $PSScriptRoot
$sourceRoot = Join-Path $root "keperluan"
$destRoot = Join-Path $root "public/assets"
$libraryRoot = Join-Path $destRoot "library"
$manifestPath = Join-Path $root "src/data/generatedAssets.ts"
$processedManifestPath = Join-Path $root "src/data/processedAssets.ts"
$transparentProcessor = Join-Path $PSScriptRoot "process-transparent-assets.py"
$mediaExtensions = @(".jpg", ".jpeg", ".png", ".webp", ".mp4")

New-Item -ItemType Directory -Force -Path $destRoot | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $manifestPath) | Out-Null

$generatedRoots = @(
  $libraryRoot,
  (Join-Path $destRoot "processed")
)

foreach ($generatedRoot in $generatedRoots) {
  $resolvedDestRoot = [System.IO.Path]::GetFullPath($destRoot)
  $resolvedGeneratedRoot = [System.IO.Path]::GetFullPath($generatedRoot)

  if (-not $resolvedGeneratedRoot.StartsWith($resolvedDestRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to clear generated assets outside public/assets: $resolvedGeneratedRoot"
  }

  if (Test-Path -LiteralPath $generatedRoot) {
    Remove-Item -LiteralPath $generatedRoot -Recurse -Force
  }

  New-Item -ItemType Directory -Force -Path $generatedRoot | Out-Null
}

$stableFiles = @(
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

foreach ($file in $stableFiles) {
  $source = Join-Path $root $file.Source
  if (-not (Test-Path -LiteralPath $source)) { continue }
  $dest = Join-Path $destRoot $file.Dest
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dest) | Out-Null
  Copy-Item -LiteralPath $source -Destination $dest -Force
}

$manifest = New-Object System.Collections.Generic.List[object]
$processedManifest = New-Object System.Collections.Generic.List[object]
$mediaFiles = Get-ChildItem -LiteralPath $sourceRoot -Recurse -File |
  Where-Object { $mediaExtensions -contains $_.Extension.ToLowerInvariant() } |
  Sort-Object FullName

foreach ($file in $mediaFiles) {
  $sourcePrefix = $sourceRoot.TrimEnd("\") + "\"
  $relative = $file.FullName.Substring($sourcePrefix.Length).Replace("\", "/")
  $category = Get-AssetCategory -RelativePath $relative
  $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
  $slug = Convert-ToSlug -Value $baseName
  $folder = Join-Path $libraryRoot $category
  $destName = "$slug$($file.Extension.ToLowerInvariant())"
  $dest = Join-Path $folder $destName
  $counter = 2

  New-Item -ItemType Directory -Force -Path $folder | Out-Null

  while (Test-Path -LiteralPath $dest) {
    $destName = "$slug-$counter$($file.Extension.ToLowerInvariant())"
    $dest = Join-Path $folder $destName
    $counter++
  }

  Copy-Item -LiteralPath $file.FullName -Destination $dest -Force

  $manifest.Add([ordered]@{
    name = $baseName
    src = "/assets/library/$category/$destName"
    category = $category
    kind = if ($file.Extension.ToLowerInvariant() -eq ".mp4") { "video" } else { "image" }
    source = $relative
  })

  if (($category -eq "game" -or $category -eq "overlay3d") -and $file.Extension.ToLowerInvariant() -eq ".png") {
    $processedFolder = Join-Path $destRoot "processed/$category"
    $processedName = "$slug.png"
    $processedDest = Join-Path $processedFolder $processedName
    $processedCounter = 2

    while (Test-Path -LiteralPath $processedDest) {
      $processedName = "$slug-$processedCounter.png"
      $processedDest = Join-Path $processedFolder $processedName
      $processedCounter++
    }

    python $transparentProcessor $file.FullName $processedDest

    $processedManifest.Add([ordered]@{
      name = $baseName
      src = "/assets/processed/$category/$processedName"
      category = $category
      source = $relative
    })
  }
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("export type GeneratedAsset = {")
$lines.Add("  name: string;")
$lines.Add("  src: string;")
$lines.Add('  category: "game" | "overlay3d" | "gallery" | "profile" | "place" | "misc";')
$lines.Add('  kind: "image" | "video";')
$lines.Add("  source: string;")
$lines.Add("};")
$lines.Add("")
$lines.Add("export const generatedAssets = [")

foreach ($asset in $manifest) {
  $name = ($asset.name -replace "\\", "\\") -replace '"', '\"'
  $src = ($asset.src -replace "\\", "\\") -replace '"', '\"'
  $category = $asset.category
  $kind = $asset.kind
  $source = ($asset.source -replace "\\", "\\") -replace '"', '\"'
  $lines.Add("  { name: ""$name"", src: ""$src"", category: ""$category"", kind: ""$kind"", source: ""$source"" },")
}

$lines.Add("] as const satisfies readonly GeneratedAsset[];")

Set-Content -LiteralPath $manifestPath -Value $lines -Encoding UTF8

$processedLines = New-Object System.Collections.Generic.List[string]
$processedLines.Add("export type ProcessedAsset = {")
$processedLines.Add("  name: string;")
$processedLines.Add("  src: string;")
$processedLines.Add('  category: "game" | "overlay3d";')
$processedLines.Add("  source: string;")
$processedLines.Add("};")
$processedLines.Add("")
$processedLines.Add("export const processedAssets = [")

foreach ($asset in $processedManifest) {
  $name = ($asset.name -replace "\\", "\\") -replace '"', '\"'
  $src = ($asset.src -replace "\\", "\\") -replace '"', '\"'
  $category = $asset.category
  $source = ($asset.source -replace "\\", "\\") -replace '"', '\"'
  $processedLines.Add("  { name: ""$name"", src: ""$src"", category: ""$category"", source: ""$source"" },")
}

$processedLines.Add("] as const satisfies readonly ProcessedAsset[];")

Set-Content -LiteralPath $processedManifestPath -Value $processedLines -Encoding UTF8

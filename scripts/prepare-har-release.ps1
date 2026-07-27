param(
  [string]$HarPath = '',
  [string]$OutputDirectory = ''
)

$ErrorActionPreference = 'Stop'
$repoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$packageFile = Join-Path $repoRoot 'myascf_runtime\oh-package.json5'
$package = Get-Content -LiteralPath $packageFile -Raw -Encoding UTF8 | ConvertFrom-Json

if (-not $HarPath) {
  $har = Get-ChildItem -LiteralPath (Join-Path $repoRoot 'myascf_runtime\build') -Recurse -Filter '*.har' -File |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $har) { throw 'No HAR artifact found. Run scripts/build-har.ps1 first.' }
} else {
  $resolvedHar = if ([IO.Path]::IsPathRooted($HarPath)) {
    [IO.Path]::GetFullPath($HarPath)
  } else {
    [IO.Path]::GetFullPath((Join-Path $repoRoot $HarPath))
  }
  if (-not (Test-Path -LiteralPath $resolvedHar -PathType Leaf)) { throw "HAR file not found: $resolvedHar" }
  $har = Get-Item -LiteralPath $resolvedHar
}

if ($har.Extension -ne '.har' -or $har.Length -eq 0) { throw "Invalid HAR artifact: $($har.FullName)" }
if (-not $OutputDirectory) { $OutputDirectory = Join-Path $repoRoot 'release-artifacts' }
$resolvedOutput = if ([IO.Path]::IsPathRooted($OutputDirectory)) {
  [IO.Path]::GetFullPath($OutputDirectory)
} else {
  [IO.Path]::GetFullPath((Join-Path $repoRoot $OutputDirectory))
}
[IO.Directory]::CreateDirectory($resolvedOutput) | Out-Null

$assetName = "$($package.name)-v$($package.version).har"
$assetPath = Join-Path $resolvedOutput $assetName
& node (Join-Path $repoRoot 'scripts\check-har-release.mjs') --har $har.FullName
if ($LASTEXITCODE -ne 0) { throw "HAR release check failed with exit code $LASTEXITCODE" }

$checksumPath = Join-Path $resolvedOutput 'SHA256SUMS.txt'
$temporaryAsset = Join-Path $resolvedOutput "$assetName.tmp"
$temporaryChecksum = Join-Path $resolvedOutput 'SHA256SUMS.txt.tmp'
try {
  Copy-Item -LiteralPath $har.FullName -Destination $temporaryAsset -Force
  $hash = (Get-FileHash -LiteralPath $temporaryAsset -Algorithm SHA256).Hash.ToLowerInvariant()
  [IO.File]::WriteAllText($temporaryChecksum, "$hash  $assetName`n", [Text.UTF8Encoding]::new($false))
  Move-Item -LiteralPath $temporaryAsset -Destination $assetPath -Force
  Move-Item -LiteralPath $temporaryChecksum -Destination $checksumPath -Force
} finally {
  Remove-Item -LiteralPath $temporaryAsset -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $temporaryChecksum -Force -ErrorAction SilentlyContinue
}

Write-Output '[HAR Release] assets prepared; no upload was performed'
Write-Output "[HAR Release] artifact: $assetPath"
Write-Output "[HAR Release] size: $((Get-Item -LiteralPath $assetPath).Length) bytes"
Write-Output "[HAR Release] SHA-256: $hash"
Write-Output "[HAR Release] checksums: $checksumPath"

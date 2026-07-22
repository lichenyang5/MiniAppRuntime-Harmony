param(
  [string]$DemoPath = '',
  [string]$HarPath = ''
)

$ErrorActionPreference = 'Stop'
$repoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if (-not $DemoPath) { $DemoPath = Join-Path $repoRoot 'examples\npm-har-consumer-demo\harmony' }
$resolvedDemo = if ([IO.Path]::IsPathRooted($DemoPath)) {
  [IO.Path]::GetFullPath($DemoPath)
} else {
  [IO.Path]::GetFullPath((Join-Path $repoRoot $DemoPath))
}
$entryDir = Join-Path $resolvedDemo 'entry'
if (-not (Test-Path -LiteralPath $entryDir -PathType Container)) {
  throw "HarmonyOS entry module not found: $entryDir"
}

if ($HarPath) {
  $resolvedHar = if ([IO.Path]::IsPathRooted($HarPath)) {
    [IO.Path]::GetFullPath($HarPath)
  } else {
    [IO.Path]::GetFullPath((Join-Path $repoRoot $HarPath))
  }
  if (-not (Test-Path -LiteralPath $resolvedHar -PathType Leaf)) { throw "HAR file not found: $resolvedHar" }
  $har = Get-Item -LiteralPath $resolvedHar
} else {
  $har = Get-ChildItem -LiteralPath (Join-Path $repoRoot 'myascf_runtime\build') -Recurse -Filter '*.har' -File |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $har) { throw 'No HAR artifact found. Run scripts/build-har.ps1 first.' }
}

if ($har.Extension -ne '.har' -or $har.Length -eq 0) { throw "Invalid HAR artifact: $($har.FullName)" }
$signature = [IO.File]::ReadAllBytes($har.FullName)[0..1]
$isZip = $signature[0] -eq 0x50 -and $signature[1] -eq 0x4B
$isGzip = $signature[0] -eq 0x1F -and $signature[1] -eq 0x8B
if (-not $isZip -and -not $isGzip) { throw "HAR is not a supported ZIP or gzip archive: $($har.FullName)" }

$libsDir = Join-Path $entryDir 'libs'
[IO.Directory]::CreateDirectory($libsDir) | Out-Null
$target = Join-Path $libsDir 'myascf_runtime.har'
if (Test-Path -LiteralPath $target) { Write-Output "[HAR] overwriting existing artifact: $target" }
Copy-Item -LiteralPath $har.FullName -Destination $target -Force
$copied = Get-Item -LiteralPath $target
$sourceHash = (Get-FileHash -LiteralPath $har.FullName -Algorithm SHA256).Hash
$targetHash = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash
if ($sourceHash -ne $targetHash) { throw 'Copied HAR SHA-256 does not match the source artifact.' }
Write-Output "[HAR] source: $($har.FullName)"
Write-Output "[HAR] target: $($copied.FullName)"
Write-Output "[HAR] size: $($copied.Length) bytes"
Write-Output "[HAR] SHA-256: $targetHash"

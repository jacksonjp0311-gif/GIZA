param(
  [switch]$SkipAcquire,
  [switch]$SkipBuild
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $Root
function Step([string]$Name,[scriptblock]$Body) {
  Write-Host "`n[GIZA] $Name"
  & $Body
  if ($LASTEXITCODE -ne 0) { throw "Step failed: $Name ($LASTEXITCODE)" }
}
if (-not $SkipAcquire) {
  Step 'Acquire Petrie public-domain source bytes' { node scripts/source_bytes/acquire-petrie.mjs }
}
if ($SkipAcquire) { Write-Host '[GIZA] acquisition skipped by operator' }
Step 'Run similarity/holdout benchmark' { node scripts/plate_registration/benchmark.mjs }
Step 'Validate source-byte custody state' { node scripts/source_bytes/validate.mjs }
Step 'Validate plate-registration governance' { node scripts/plate_registration/validate.mjs }
if (-not $SkipBuild) {
  Step 'Full preflight' { $env:NODE_PATH=(npm root -g); npm run check }
}
if ($SkipBuild) { Write-Host '[GIZA] full preflight skipped by operator' }
Write-Host "`n[GIZA] First-plate campaign staged."
Write-Host '[GIZA] If source bytes were acquired, visually confirm Plate VI and populate/freeze controls + holdouts before running npm run plate:register.'

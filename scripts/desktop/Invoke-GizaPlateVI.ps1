param(
  [string]$LocalPdf = "",
  [string]$Landmarks = "",
  [switch]$ConfirmPlate,
  [switch]$RunFit,
  [switch]$SkipFullCheck
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $Root
function Step([string]$Name,[scriptblock]$Body) {
  Write-Host "`n[GIZA] $Name" -ForegroundColor Cyan
  & $Body
  if ($LASTEXITCODE -ne 0) { throw "Step failed: $Name ($LASTEXITCODE)" }
}
if ($LocalPdf) {
  Step 'Import and SHA-256-lock Petrie PDF' { node scripts/source_bytes/import-petrie.mjs --file $LocalPdf --origin OPERATOR_LOCAL_FILE }
} else {
  Step 'Attempt public-domain Petrie acquisition' { node scripts/source_bytes/acquire-petrie.mjs }
}
Step 'Render checksum-bound Plate VI / PDF page 305' { node scripts/plate_registration/render-plate-vi.mjs }
Write-Host "[GIZA] Inspect public/vault/derived/petrie1883_plate_vi_p305.png before confirmation." -ForegroundColor Yellow
if ($ConfirmPlate) { Step 'Record explicit Plate VI visual confirmation' { node scripts/plate_registration/confirm-plate-vi.mjs --confirm } }
if ($Landmarks) { Step 'Freeze landmark controls + holdouts' { node scripts/plate_registration/freeze-landmarks.mjs --input $Landmarks } }
if ($RunFit) { Step 'Run frozen archaeological similarity fit' { node scripts/plate_registration/register-similarity.mjs } }
Step 'Validate source-byte custody' { node scripts/source_bytes/validate.mjs }
Step 'Validate plate-registration governance' { node scripts/plate_registration/validate.mjs }
if (-not $SkipFullCheck) { Step 'Full preflight' { $env:NODE_PATH=(npm root -g); npm run check } }
Write-Host "`n[GIZA] Plate VI flow complete to the highest authority allowed by supplied evidence." -ForegroundColor Green

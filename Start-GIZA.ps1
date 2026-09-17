param([ValidateSet('Studio','Workbench','Explorer')][string]$Mode='Studio')
$ErrorActionPreference='Stop'
$Root=$PSScriptRoot
Set-Location -LiteralPath $Root
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js is required. Install a supported Node.js release, then run this script again.' }
Write-Host "GIZA NEXUS v0.10.12 / $Mode" -ForegroundColor Cyan
if ($Mode -eq 'Studio') { & node scripts/start.mjs }
if ($Mode -eq 'Workbench') {
  Write-Host 'Open http://127.0.0.1:4174/workbench/ in your browser. Ctrl+C stops the service.'
  Write-Host 'No npm install is needed. PDF import requires pdfinfo and pdftoppm (Poppler).'
  & node scripts/workbench/server.mjs
}
if ($Mode -eq 'Explorer') {
  if (-not (Test-Path -LiteralPath '.\node_modules\.bin\vite.cmd')) { throw 'Explorer dependencies are missing. Run npm install once with network access. The workbench can launch without them.' }
  Write-Host 'Open http://127.0.0.1:4173. Run the Workbench in a second terminal for the Registration surface.'
  & npm run dev
}
Set-Location -LiteralPath $Root

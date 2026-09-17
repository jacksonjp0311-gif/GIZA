import fs from 'node:fs';
import crypto from 'node:crypto';

const contract = JSON.parse(fs.readFileSync('docs/design/LAYOUT_CONTRACT.json', 'utf8'));
const css = fs.readFileSync('src/styles.css', 'utf8');
const header = fs.readFileSync('src/workstation/WorkstationHeader.tsx', 'utf8');
const workstationTypes = fs.readFileSync('src/workstation/types.ts', 'utf8');
const navigationSource = header + '\n' + workstationTypes;
const inspector = fs.readFileSync('src/workstation/ObjectInspectorPanel.tsx', 'utf8');
const spatial = fs.readFileSync('src/workstation/SpatialViewport.tsx', 'utf8');
const errors = [];

function mustContain(haystack, needle, label) {
  if (!haystack.includes(needle)) errors.push(`missing ${label}: ${needle}`);
}
function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.toString('ascii', 1, 4) !== 'PNG') throw new Error(`${file} is not PNG`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}
function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

const base = contract.baseline;
if (!fs.existsSync(base.path)) errors.push(`missing approved baseline ${base.path}`);
else {
  const size = pngSize(base.path);
  if (size.width !== base.width_px || size.height !== base.height_px) errors.push(`baseline dimensions drift ${size.width}x${size.height}`);
  if (sha256(base.path) !== base.sha256) errors.push('approved baseline SHA-256 drift');
}
const runtime = contract.runtime_reference;
if (!fs.existsSync(runtime.path)) errors.push(`missing runtime reference ${runtime.path}`);
else {
  const size = pngSize(runtime.path);
  if (size.width !== runtime.width_px || size.height !== runtime.height_px) errors.push(`runtime reference dimensions drift ${size.width}x${size.height}`);
  if (sha256(runtime.path) !== runtime.sha256) errors.push('runtime reference SHA-256 drift');
}

mustContain(css, '.app.nexusEdge{grid-template-rows:76px minmax(0,1fr) 28px}', 'approved model-first app rows');
mustContain(header, 'compactModelHeader', 'compact model header');
mustContain(header, 'headerSummary', 'header evidence metrics');
if (header.includes('modeRail')) errors.push('removed five-mode rail must not return');
if (spatial.includes('targetHeader')) errors.push('model title must not overlay the viewport');
mustContain(css, 'grid-template-columns:252px minmax(0,1fr) 410px', 'canonical workspace columns');
mustContain(css, 'grid-template-rows:auto minmax(0,1fr) 112px 126px', 'canonical inspector rows');
mustContain(css, 'grid-template-columns:repeat(4,minmax(0,1fr))', '4-column inspector tabs');
mustContain(css, '.edgeRight{position:relative;inset:auto;z-index:auto}', 'non-overlay inspector guard');

mustContain(header, 'GIZA <em>NEXUS</em>', 'GIZA NEXUS product identity');
mustContain(header, 'CINEMATIC SPATIAL REVERSE-ENGINEERING WORKSTATION', 'canonical product tagline');
for (const label of contract.navigation) mustContain(navigationSource, label, `primary navigation ${label}`);
if (header.includes('<b>FIELD</b>')) errors.push('FIELD must not become a sixth primary navigation mode');
if (header.includes('GIZA <em>STRATA</em>') || header.includes('GIZA <em>ECHO</em>')) errors.push('feature codename replaced product identity');

mustContain(inspector, 'rightRail edgeRight inspectorDock', 'docked object inspector');
mustContain(inspector, "'FINDINGS'", 'FINDINGS tab');
mustContain(inspector, "'SIMULATION'", 'SIMULATION tab');
if (inspector.includes('globalFocus')) errors.push('FINDINGS may not reflow the inspector dock');
mustContain(header, 'KHAFRE / PYRAMID CORE', 'top-level model title');

if (fs.existsSync('GIZA-v0.9.3-DESIGN-FREEZE.png')) errors.push('rejected v0.9.3 design freeze remains at repository root');
if (!fs.existsSync('docs/archive/REJECTED-v0.9.3-DESIGN-FREEZE.png')) errors.push('rejected design freeze audit artifact missing');

if (errors.length) {
  console.error('GIZA visual contract FAILED');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log('GIZA v0.10.7 visual contract');
console.log(`baseline=${base.width_px}x${base.height_px} shell=MODEL_FIRST_APPROVED brand=GIZA_NEXUS nav=3 inspector=DOCKED_4x2`);
console.log('PASS');

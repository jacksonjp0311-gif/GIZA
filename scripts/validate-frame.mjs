import fs from 'node:fs';

const required = [
  'src/workstation/WorkstationHeader.tsx',
  'src/workstation/LeftRail.tsx',
  'src/workstation/SpatialViewport.tsx',
  'src/workstation/ObjectInspectorPanel.tsx',
  'src/workstation/WorkstationFooter.tsx',
  'src/scene/MonumentLayer.tsx',
  'src/scene/MasonryLayer.tsx',
  'src/scene/FieldLayer.tsx',
  'src/scene/CameraRig.tsx',
  'src/scene/SimulationLayer.tsx',
  'src/scene/geometry.ts',
  'src/scene/types.ts',
];
const errors = [];
for (const file of required) if (!fs.existsSync(file)) errors.push(`missing FRAME module ${file}`);

const appBytes = fs.statSync('src/App.tsx').size;
const sceneBytes = fs.statSync('src/components/GizaScene.tsx').size;
if (appBytes > 15000) errors.push(`App.tsx regressed above 15 KB: ${appBytes}`);
if (sceneBytes > 7000) errors.push(`GizaScene.tsx regressed above 7 KB: ${sceneBytes}`);

const app = fs.readFileSync('src/App.tsx', 'utf8');
const scene = fs.readFileSync('src/components/GizaScene.tsx', 'utf8');
for (const token of ['WorkstationHeader','LeftRail','SpatialViewport','ObjectInspectorPanel','WorkstationFooter']) {
  if (!app.includes(token)) errors.push(`App orchestration missing ${token}`);
}
for (const token of ['MonumentLayer','MasonryLayer','FieldLayer','SimulationLayer','CameraRig']) {
  if (!scene.includes(token)) errors.push(`Scene composition missing ${token}`);
}
if (app.includes('<Canvas')) errors.push('App.tsx must not own Three.js Canvas');
if (fs.existsSync('src/components/ObjectHud.tsx')) errors.push('legacy ObjectHud.tsx should remain removed after FRAME');
if (scene.includes('evidenceSummary(') || scene.includes('promotionForTarget(')) errors.push('GizaScene must not own research/evidence policy');

console.log('GIZA v0.10.7 // FRAME architecture validation');
console.log(`App.tsx=${appBytes} bytes GizaScene.tsx=${sceneBytes} bytes modules=${required.length}`);
if (errors.length) {
  console.error('ERRORS\n' + errors.join('\n'));
  process.exit(1);
}
console.log('PASS');

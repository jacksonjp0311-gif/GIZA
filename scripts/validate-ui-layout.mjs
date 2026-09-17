import fs from 'node:fs';
const inspector=fs.readFileSync('src/workstation/ObjectInspectorPanel.tsx','utf8');
const css=fs.readFileSync('src/styles.css','utf8');
const errors=[];
function need(h,n,l){if(!h.includes(n))errors.push(`missing ${l}: ${n}`)}
need(inspector,'rightRail edgeRight inspectorDock','docked inspector class');
need(inspector,"'SIMULATION'",'SIMLAB inspector tab');
need(inspector,"'FINDINGS'",'persistent findings tab');
need(inspector,"activeSimulation === 'STRATA'",'STRATA solver selector');
need(inspector,"tab === 'OVERVIEW' || tab === 'PHOTOS'",'conditional photo allocation');
need(css,'.inspectorDock{','inspector dock rule');
need(css,'grid-template-rows:auto minmax(0,1fr) 112px 126px','right dock row contract');
need(css,'grid-template-columns:repeat(4,minmax(0,1fr))','4-column inspector tab contract');
need(css,'.findingsPanel{','findings design integration');
need(css,'.strataHero{','STRATA design integration');
need(css,'.mainInspector.dataOnly{','data-only inspector layout');
need(css,'.mainInspector.withHero{','photo inspector layout');
need(css,'.edgeRight{position:relative;inset:auto;z-index:auto}','non-overlay position guard');
need(css,'@media(max-width:1020px)','pre-overlap responsive breakpoint');
const dock=css.match(/\.inspectorDock\{([\s\S]*?)\}/)?.[1]??'';
if(/position\s*:\s*(absolute|fixed)/i.test(dock))errors.push('inspectorDock must never use absolute/fixed positioning');
if(inspector.includes('globalFocus'))errors.push('FINDINGS must not reflow the inspector dock');
if(errors.length){console.error('GIZA v0.10.7 UI layout validation FAILED');for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('GIZA v0.10.7 UI layout validation');
console.log('inspector=docked tabs=4x2 hero=conditional solverSwitch=3 findings=fixed-shell responsiveGuard=1020px');
console.log('PASS');

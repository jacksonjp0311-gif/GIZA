import fs from 'node:fs';
const frame = JSON.parse(fs.readFileSync('public/model/field/geospatial_frame.json','utf8'));
const lat = Number(process.argv[2]);
const lon = Number(process.argv[3]);
if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
  console.error('Usage: node scripts/field/local-frame.mjs <latitude_deg> <longitude_deg>');
  process.exit(2);
}
const a = 6378137.0;
const e2 = 6.69437999014e-3;
const lat0 = frame.reference_anchor.latitude_deg * Math.PI / 180;
const dLat = (lat - frame.reference_anchor.latitude_deg) * Math.PI / 180;
const dLon = (lon - frame.reference_anchor.longitude_deg) * Math.PI / 180;
const sin = Math.sin(lat0);
const den = Math.sqrt(1 - e2 * sin * sin);
const rn = a / den;
const rm = a * (1-e2) / Math.pow(1-e2*sin*sin,1.5);
const east = dLon * rn * Math.cos(lat0);
const north = dLat * rm;
console.log(JSON.stringify({east_m:east,north_m:north,z_m:null,status:'CONTEXT_ONLY',warning:frame.transform.precision_rule},null,2));

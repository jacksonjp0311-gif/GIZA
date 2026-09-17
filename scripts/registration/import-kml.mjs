import fs from 'node:fs';
const input=process.argv[2],output=process.argv[3]??'public/model/registration/imported_survey_points.json';
if(!input){console.error('Usage: node scripts/registration/import-kml.mjs <file.kml> [output.json]');process.exit(2)}
const xml=fs.readFileSync(input,'utf8'); const rows=[];
const placemarks=[...xml.matchAll(/<Placemark[\s\S]*?<\/Placemark>/gi)].map(m=>m[0]);
for(const p of placemarks){
 const name=(p.match(/<name>([\s\S]*?)<\/name>/i)?.[1]??'').replace(/<!\[CDATA\[|\]\]>/g,'').trim();
 const c=p.match(/<coordinates>\s*([-+\d.]+),\s*([-+\d.]+)(?:,\s*([-+\d.]+))?/i); if(!c)continue;
 rows.push({name,longitude_deg:Number(c[1]),latitude_deg:Number(c[2]),elevation_m:c[3]!==undefined?Number(c[3]):null,source_file:input,registration_status:'NATIVE_GEOGRAPHIC_COORDINATE_UNTRANSFORMED'});
}
const doc={schema_version:'1.0.0',version:'0.9.8',source_file:input,count:rows.length,rule:'Imported WGS84/geographic coordinates remain native until a CRS/vertical-datum transform receipt maps them into the GIZA local engineering frame.',points:rows};
fs.writeFileSync(output,JSON.stringify(doc,null,2)+'\n'); console.log(`imported ${rows.length} points -> ${output}`);

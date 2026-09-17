import fs from 'node:fs';
import crypto from 'node:crypto';
const args=process.argv.slice(2); const get=k=>{const i=args.indexOf(k); return i>=0?args[i+1]:null};
const assetId=get('--asset'), input=get('--input'), parser=get('--parser'), locator=get('--locator'), output=get('--output');
if(!assetId||!input||!parser||!locator||!output){console.error('Usage: --asset <id> --input <file> --parser <name@version> --locator <page/table/record> --output <json>');process.exit(2)}
if(!fs.existsSync(input)) throw new Error(`input missing ${input}`);
const sha=crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex');
const receipt={schema_version:'1.0.0',version:'0.10.1',asset_id:assetId,input_path:input,input_sha256:sha,parser,locator,output_path:output,truth_class:'PARSED_DERIVED',geometry_write_authority:'NONE_UNTIL_SEPARATE_PROMOTION_RECEIPT',canonical_mutation:false,created_at:new Date().toISOString()};
const outPath=`public/vault/receipts/parser.${assetId.replaceAll('.','_')}.${Date.now()}.json`; fs.writeFileSync(outPath,JSON.stringify(receipt,null,2)+'\n'); console.log(outPath);

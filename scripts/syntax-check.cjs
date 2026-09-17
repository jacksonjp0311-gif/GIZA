const fs = require('fs');
const path = require('path');

let ts;
try {
  ts = require('typescript');
} catch {
  console.error('TypeScript is not installed. Run npm install first.');
  process.exit(2);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(p);
    // Declaration files have no emitted output; the full tsc check validates them.
    return /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts') ? [p.replaceAll('\\', '/')] : [];
  });
}

const files = walk('src').sort();
let failures = 0;
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    },
    reportDiagnostics: true,
    fileName: file,
  });
  const errors = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
  if (errors.length) {
    failures += 1;
    console.error(`FAIL ${file}`);
    for (const error of errors) console.error(ts.flattenDiagnosticMessageText(error.messageText, '\n'));
  } else {
    console.log(`PASS ${file}`);
  }
}
console.log(`syntax files=${files.length}`);
process.exitCode = failures ? 1 : 0;

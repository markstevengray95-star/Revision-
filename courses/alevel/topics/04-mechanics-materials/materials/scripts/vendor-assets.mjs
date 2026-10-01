import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'vendor');
fs.mkdirSync(out,{recursive:true});

function copyFirst(candidates,name){
  const found=candidates.map(src=>path.join(root,src)).find(src=>fs.existsSync(src));
  if(!found)throw new Error(`Missing dependency asset for ${name}. Tried: ${candidates.join(', ')}`);
  fs.copyFileSync(found,path.join(out,name));
  console.log(`Vendored ${name} from ${path.relative(root,found)}`);
}

copyFirst([
  'node_modules/three/build/three.module.min.js',
  'node_modules/three/build/three.module.js'
],'three.module.min.js');
copyFirst([
  'node_modules/xlsx/dist/xlsx.full.min.js',
  'node_modules/xlsx/dist/xlsx.full.js'
],'xlsx.full.min.js');

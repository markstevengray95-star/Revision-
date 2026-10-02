// Compile the supplied graph activity's utilities once, without a browser CDN.
const fs=require('node:fs'),path=require('node:path');
async function buildGraphStyles(){
 const root=path.resolve(__dirname,'..'),dir=path.join(root,'tools/graph-practice');
 const sources=['index.html','graph-practice.js','enhancements.js'].map(name=>fs.readFileSync(path.join(dir,name),'utf8')).join('\n');
 const candidates=[...new Set(sources.match(/[A-Za-z0-9:_/\[\].%()\-]+/g))];
 const {compile}=require('@tailwindcss/node');
 const compiler=await compile('@import "tailwindcss" source(none);',{base:root,onDependency:()=>{}});
 fs.writeFileSync(path.join(dir,'utilities.css'),compiler.build(candidates));
 console.log('Built local graph practice styles.');
}
if(require.main===module)buildGraphStyles().catch(error=>{console.error(error);process.exit(1);});
module.exports={buildGraphStyles};

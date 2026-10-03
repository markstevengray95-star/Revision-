// Compile practice tool utilities once, without a browser CDN.
const fs=require('node:fs'),path=require('node:path');
async function buildGraphStyles(){
 const root=path.resolve(__dirname,'..');
 const {compile}=require('@tailwindcss/node');
 for(const [tool,files] of [['graph-practice',['index.html','graph-practice.js','enhancements.js']],['practical-sim',['index.html']]]){
 const dir=path.join(root,'tools',tool);
 const sources=files.map(name=>fs.readFileSync(path.join(dir,name),'utf8')).join('\n');
 const candidates=[...new Set(sources.match(/[A-Za-z0-9:_/\[\].%()\-]+/g))];
 const compiler=await compile('@import "tailwindcss" source(none);\n@custom-variant dark (&:where(.dark, .dark *));',{base:root,onDependency:()=>{}});
 fs.writeFileSync(path.join(dir,'utilities.css'),compiler.build(candidates));
 console.log(`Built local ${tool} styles.`);
 }
}
if(require.main===module)buildGraphStyles().catch(error=>{console.error(error);process.exit(1);});
module.exports={buildGraphStyles};

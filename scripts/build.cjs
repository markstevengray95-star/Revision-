const fs=require('node:fs');
const path=require('node:path');
const {generateCatalog}=require('./catalog.cjs');
const {writePractice}=require('./practice-catalog.cjs');
const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const modules=['topics/01-measurements','topics/02-particles-radiation','topics/03-waves','topics/04-mechanics-materials/mechanics','topics/04-mechanics-materials/materials','topics/05-electricity','topics/06-further-mechanics-thermal','topics/07-fields','topics/08-nuclear','tools/practicals'];
for(const module of modules)if(!fs.existsSync(path.join(root,'courses/alevel',module,'index.html')))throw new Error(`Missing bundled module: ${module}`);
fs.writeFileSync(path.join(root,'catalog.js'),`// Generated from the bundled course data by scripts/catalog.cjs.\nwindow.REVISION_CATALOG = ${JSON.stringify(generateCatalog(),null,2)};\n`);
writePractice();
if(path.resolve(dist)!==path.resolve(root,'dist')||!dist.startsWith(root+path.sep))throw new Error('Invalid build output directory');
fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(dist,{recursive:true});
for(const name of ['index.html','dashboard.css','dashboard.js','catalog.js','practice.html','practice.css','practice.js','practice-data.js','icon.svg','manifest.webmanifest','.nojekyll','teacher.html','teacher-dashboard.css','teacher-cloud.css','teacher-cloud.js','student.html','student-dashboard.js','activity.html','activity.js','activities.css','teacher-activities.js','teacher-interventions.js','teacher-insights.js','teacher-markbook.js','teacher-set-work.js','teacher-workspace.js','teacher-workspace.css','teacher-simple.js','teacher-simple.css','shared','courses','tools']){
  fs.cpSync(path.join(root,name),path.join(dist,name),{recursive:true,filter:source=>!source.split(path.sep).some(p=>['.git','node_modules','tests','scripts','supabase','.github'].includes(p))});
}
// Preserve the upstream stable Paper 3 renderer used by its deployment build.
const textbook=path.join(dist,'courses/alevel/textbook.js');
fs.writeFileSync(textbook,fs.readFileSync(path.join(root,'courses/alevel/textbook.js'),'utf8')+['textbook-options.js','textbook-option-glossary.js','textbook-safe-options.js'].map(name=>`\n/* ${name} */\n`+fs.readFileSync(path.join(root,'courses/alevel',name),'utf8')).join(''));
console.log('Built dist: complete GCSE and A-level courses plus teacher/student cloud workspaces; no submodule checkout required.');

// Next serves the course and practical assets alongside the marking routes.
const publicDir=path.join(root,'public');
fs.rmSync(publicDir,{recursive:true,force:true});
fs.cpSync(dist,publicDir,{recursive:true});

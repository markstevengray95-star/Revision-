const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {generateCatalog}=require('../scripts/catalog.cjs');
const root=path.resolve(__dirname,'..');
const catalog=generateCatalog();
assert.equal(catalog.courses.length,6);
assert.equal(catalog.topics.length,44);
assert.equal(catalog.topics.filter(t=>t.level==='gcse').length,25);
assert.equal(catalog.topics.filter(t=>t.level==='alevel').length,19);
assert.equal(new Set(catalog.topics.map(t=>`${t.course}:${t.id}`)).size,44);
for(const item of [...catalog.courses,...catalog.topics]){
  const url=new URL(item.href,'http://localhost');assert.ok(fs.existsSync(path.join(root,url.pathname)),`Broken catalog link: ${item.href}`);
}
const context=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(root,'catalog.js'),'utf8'),context);
assert.equal(JSON.stringify(context.window.REVISION_CATALOG),JSON.stringify(catalog),'Catalog is out of date');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
let assets=0;
const htmlFiles=[path.join(root,'index.html'),path.join(root,'teacher.html'),path.join(root,'student.html'),path.join(root,'activity.html'),...walk(path.join(root,'courses')).filter(f=>f.endsWith('.html'))];
// Check scripts and stylesheets requested by the combined dashboard, teacher/student workspaces and topic apps.
for(const file of htmlFiles){
  const html=fs.readFileSync(file,'utf8');
  assert.ok(html.includes('shared/revision-shell.js'),`Missing shared navigation: ${file}`);
  for(const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"']+)["']/gi)){
    const href=match[1];if(/^(https?:|data:|#|\/\/)/.test(href))continue;
    if(!/\.(js|css|webmanifest)([?#]|$)/.test(href))continue;
    const target=decodeURIComponent(href.split(/[?#]/)[0]);
    const resolved=target.startsWith('/')?path.join(root,target):path.resolve(path.dirname(file),target);
    assert.ok(fs.existsSync(resolved),`Missing HTML asset: ${path.relative(root,file)} → ${href}`);assets++;
  }
}
for(const page of ['teacher.html','student.html','activity.html']){
  const html=fs.readFileSync(path.join(root,page),'utf8');
  assert.ok(!/<script\b[^>]*src=["']https?:\/\//i.test(html),`${page} must not depend on an external runtime script`);
}
for(const file of ['teacher.html','teacher-dashboard.css','teacher-cloud.css','teacher-cloud.js','teacher-simple.css','teacher-simple.js','student.html','student-dashboard.js','shared/revision-supabase.js']){
  assert.ok(fs.existsSync(path.join(root,file)),`Missing cloud workspace asset: ${file}`);
}
const shell=fs.readFileSync(path.join(root,'shared/revision-shell.js'),'utf8');
assert.ok(shell.includes('teacher-simple.css'),'Teacher shell must load simplified dashboard styling');
assert.ok(shell.includes('teacher-simple.js'),'Teacher shell must load simplified dashboard logic');
for(const file of ['teacher-cloud.js','teacher-activities.js','teacher-simple.js','activity.js','shared/activity-generator.js','shared/activity-ui.js','student-dashboard.js','shared/revision-supabase.js','shared/revision-shell.js']){
  new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
}
console.log(`Integration passed: 6 courses, 44 topic links, teacher/student cloud assets, ${assets} local HTML assets, simple teacher monitoring, self-contained workspaces, and valid workspace scripts.`);
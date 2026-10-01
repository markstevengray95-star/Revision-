const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const routes=['tools/gcse-exam','tools/alevel-marking'];
for(const route of routes){assert.ok(fs.existsSync(path.join(root,'src/app',route,'page.tsx')));assert.ok(read('index.html').includes(`href="${route}"`));}
for(const [level,route] of [['gcse',routes[0]],['alevel',routes[1]]]){
 const files=[path.join(root,'src/app',route,'page.tsx'),...walk(path.join(root,'src/modules',level))];let endpoints=0;
 for(const file of files.filter(f=>/\.tsx?$/.test(f))){for(const match of fs.readFileSync(file,'utf8').matchAll(/['"](\/api\/[^'"\s]+)['"]/g)){
  assert.ok(match[1].startsWith(`/api/${level}/`),`Wrong marking namespace: ${file} → ${match[1]}`);
  assert.ok(fs.existsSync(path.join(root,'src/app',match[1],'route.ts')),`Missing handler: ${match[1]}`);endpoints++;
 }}assert.ok(endpoints>5);
}
assert.ok(read('courses/gcse/project-hub.js').includes("EXAM_APP_URL='../../tools/gcse-exam'"));
assert.ok(read('courses/alevel/course-tools.js').includes("markingUrl='../../tools/alevel-marking'"));
assert.ok(!/vercel\.app/.test(read('courses/alevel/course-tools.js')));
assert.ok(!/vercel\.app/.test(read('courses/gcse/project-hub.js')));
for(const file of ['courses/alevel/tools/practicals/index.html','tools/practical-sim/index.html']){assert.ok(read(file).includes('shared/revision-shell.js'));assert.ok(read('index.html').includes(`href="${file}"`));}
assert.equal(JSON.parse(read('vercel.json')).framework,'nextjs');
console.log('Unified tools passed: four local launchers, isolated marking handlers, and shared navigation.');

const fs=require('node:fs'),path=require('node:path');
const registry=require('../courses/subjects/registry.js');
const root=path.resolve(__dirname,'..');
function readCourses(){return registry.filter(c=>fs.existsSync(path.join(root,`courses/subjects/content/${c.id}.cjs`))).map(meta=>({meta,data:require(path.join(root,`courses/subjects/content/${meta.id}.cjs`))}));}
function writeCourses(){for(const {meta,data}of readCourses())fs.writeFileSync(path.join(root,`courses/subjects/${meta.id}.json`),JSON.stringify(data));}
if(require.main===module)writeCourses();
module.exports={readCourses,writeCourses};

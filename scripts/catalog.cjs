const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
function generateCatalog(){
  const context=vm.createContext({window:{location:{search:''}},document:{querySelector(){return null},readyState:'loading',addEventListener(){}},URLSearchParams,console});
  const load=file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
  for(const name of ['chemistry-physical-detail','chemistry-inorganic-detail','chemistry-organic-detail','chemistry-detail'])load(`courses/alevel/subjects/${name}.js`);
  load('courses/alevel/course-config.js');
  load('courses/alevel/curriculum-map.js');
  for(const name of ['course-data','physics-spec-detail','biology-spec-detail','chemistry-spec-detail'])load(`courses/gcse/${name}.js`);
  const data=context.window.GCSE_COURSE_DATA;
  const catalog={courses:[],topics:[]};
  for(const subject of data.subjects){
    const id=`gcse-${subject.id}`;
    catalog.courses.push({id,level:'gcse',subject:subject.id,title:`GCSE ${subject.name}`,spec:data.specifications[subject.id],summary:`Combined and Separate Science. Lessons, practicals and exam practice.`,progressKey:'gcse-science-progress-v1',href:`courses/gcse/index.html?subject=${subject.id}`});
    for(const topic of data.topics.filter(t=>t.subject===subject.id))catalog.topics.push({id:topic.id,course:id,level:'gcse',subject:subject.id,code:topic.code,title:topic.title,summary:topic.summary,scope:topic.scope,paper:topic.paper,lessonCount:topic.lessons.length,combinedLessonCount:topic.lessons.filter(l=>l[1]!=='triple').length,search:topic.lessons.map(l=>l[0]).join(' '),href:`courses/gcse/index.html?subject=${subject.id}&topic=${topic.id}`});
  }
  for(const subject of Object.values(context.window.ALEVEL_COURSE_REGISTRY)){
    const id=`alevel-${subject.id}`;
    catalog.courses.push({id,level:'alevel',subject:subject.id,title:`A-level ${subject.subject}`,spec:`AQA ${subject.specCode}`,summary:subject.id==='physics'?'Core topics, Paper 3 options and required practicals.':subject.id==='biology'?'From biological molecules to ecosystems and gene expression.':'Physical, inorganic and organic chemistry, step by step.',progressKey:subject.storage.progress,href:`courses/alevel/index.html?subject=${subject.id}`});
    for(const topic of subject.topics){
      const lessons=(context.window.ALEVEL_LESSONS||[]).filter(l=>l.topicId===topic.id);
      catalog.topics.push({id:topic.id,course:id,level:'alevel',subject:subject.id,code:topic.code,title:topic.title,summary:topic.description,year:topic.year,moduleCount:topic.modules.length,search:topic.modules.map(m=>[m.title||m.label,m.summary,...(m.focus||[])].filter(Boolean).join(' ')).join(' ')+' '+lessons.map(l=>l.title).join(' '),href:`courses/alevel/index.html?subject=${subject.id}&view=course&topic=${topic.id}&module=0`});
    }
  }
  return JSON.parse(JSON.stringify(catalog));
}
if(require.main===module){const catalog=generateCatalog();fs.writeFileSync(path.join(root,'catalog.js'),`// Generated from the bundled course data by scripts/catalog.cjs.\nwindow.REVISION_CATALOG = ${JSON.stringify(catalog,null,2)};\n`);console.log(`Indexed ${catalog.courses.length} courses and ${catalog.topics.length} topics.`);}
module.exports={generateCatalog};

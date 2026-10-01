const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
function loadCourses(){
 const document={readyState:'loading',addEventListener(){},querySelector(){return null},querySelectorAll(){return []},getElementById(){return null}};
 const context=vm.createContext({window:{location:{search:''},addEventListener(){}},document,URLSearchParams,console,setTimeout(){},requestAnimationFrame(){}});
 const load=file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
 load('shared/practice-skills.js');
 for(const file of ['course-data','physics-spec-detail','biology-spec-detail','chemistry-spec-detail','rich-content','question-bank','physics-lesson-content','biology-lesson-content','chemistry-lesson-content','lesson-sequences','lesson-reviewed-content','lesson-quality-schema','lesson-teaching-depth','lesson-question-ladder','lesson-presentation-catalog','lesson-exam-studio','lesson-review-assessment'])load(`courses/gcse/${file}.js`);
 for(const file of ['curriculum-map','lesson-content','lesson-phase3','lesson-slide-design'])load(`courses/alevel/${file}.js`);
 for(const file of ['chemistry-physical-detail','chemistry-inorganic-detail','chemistry-organic-detail','chemistry-detail','biology-content','biology-answer-detail','chemistry-content','science-answer-support'])load(`courses/alevel/subjects/${file}.js`);
 load('courses/alevel/course-config.js');
 load('courses/alevel/subjects/assessment-data.js');
 return context.window;
}
module.exports={loadCourses,root};

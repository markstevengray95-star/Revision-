// Extended, repeatable checks for lesson formats and simulation engines.
const path=require('node:path'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const checks=[
 ['.', 'tests/lesson-formats.cjs'],
 ['.', 'tests/practical-sim-models.cjs'],
 ['courses/gcse','tests/full-audit.mjs'],
 ['courses/gcse','tests/all-lesson-presentations-audit.mjs'],
 ['courses/gcse','tests/presentation-runtime-audit.mjs'],
 ['courses/gcse','tests/learning-flow-audit.mjs'],
 ['courses/alevel','tests/specification-completeness.mjs'],
 ['courses/alevel','tests/science-lesson-detail.mjs'],
 ['courses/alevel','tests/biology-lesson-answers.mjs'],
 ['courses/alevel','tests/biology-content-coverage.mjs'],
 ['courses/alevel','tests/chemistry-content-coverage.mjs'],
 ['courses/alevel','tests/biology-interactives-coverage.mjs'],
 ['courses/alevel','tests/chemistry-interactives-coverage.mjs'],
 ['courses/alevel','tests/biology-practicals-coverage.mjs'],
 ['courses/alevel','tests/chemistry-practicals-coverage.mjs'],
 ['courses/alevel','tests/biology-data-coach-coverage.mjs'],
 ['courses/alevel','tests/chemistry-calculation-coach-coverage.mjs'],
 ['courses/alevel','tests/assessment-coverage.mjs'],
 ['courses/alevel','tests/teaching-strength.mjs'],
 ['courses/alevel','tests/lesson-uniqueness.mjs'],
 ['courses/alevel','tests/progress-mastery-coverage.mjs'],
 ['courses/alevel/tools/practicals','tests/audit-model-sweep.js'],
 ['courses/alevel/tools/practicals','tests/model-checks.js'],
 ['courses/alevel/tools/practicals','tests/first-three-regression.cjs'],
 ['courses/alevel/tools/practicals','tests/practicals-456-regression.cjs'],
 ['courses/alevel/tools/practicals','tests/labbook-integrity.cjs'],
 ['courses/alevel/tools/practicals','tests/test-worked-examples-complete.cjs']
];
(async()=>{
 try{
  for(const [dir,file] of checks){
   process.chdir(path.join(root,dir));
   await import(pathToFileURL(path.join(root,dir,file)).href);
  }
  console.log(`Extended app audit passed: ${checks.length} lesson, coverage and simulation checks.`);
 }finally{process.chdir(root);}
})().catch(error=>{console.error(error);process.exitCode=1;});

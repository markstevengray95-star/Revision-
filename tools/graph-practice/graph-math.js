(function(root){
  'use strict';
  function numeric(value){const text=String(value).trim();return text!==''&&/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(text)?Number(text):NaN;}
  function close(value,target,tolerance=0){const n=numeric(value);return Number.isFinite(n)&&Math.abs(n-target)<=tolerance+1e-9;}
  function gradient(a,b){return a&&b&&b.x!==a.x?(b.y-a.y)/(b.x-a.x):NaN;}
  function springConstant(extensionCmPerNewton){return 100/extensionCmPerNewton;}
  function interpolate(points,x){const sorted=[...points].sort((a,b)=>a.x-b.x);for(let i=1;i<sorted.length;i++){const a=sorted[i-1],b=sorted[i];if(x>=a.x&&x<=b.x)return a.y+(x-a.x)*gradient(a,b);}return NaN;}
  function fitError(points,data){if(points.length<2)return Infinity;return Math.max(...data.map(p=>Math.abs(interpolate(points,p.x)-p.y)));}
  function gradeTest(state,answer){if(state.answered||state.currentQ>=state.questions.length)return null;const q=state.questions[state.currentQ];if(q.type==='input'&&!Number.isFinite(numeric(answer))||q.type==='mcq'&&!answer)return null;const correct=q.type==='mcq'?answer===q.correctAnswer:close(answer,q.correctAnswer,q.tolerance||0);state.answered=true;state.score+=Number(correct);state.answers.push({question:q.text,answer:String(answer),correct,expected:q.correctAnswer,explanation:q.explanation||''});return correct;}
  const api={numeric,close,gradient,springConstant,interpolate,fitError,gradeTest};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GraphMath=api;
})(typeof globalThis!=='undefined'?globalThis:this);

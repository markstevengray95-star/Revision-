(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RevisionTaskPresets=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const presets=[
  {
    "id": "recall",
    "title": "Quick recall homework",
    "description": "8 automatic questions · about 10 minutes",
    "format": "choice",
    "kind": "quiz",
    "mode": "quiz",
    "count": 8,
    "demand": "support",
    "duration": 10,
    "feedback": "after_final_attempt"
  },
  {
    "id": "objective",
    "title": "Auto-marked mixed homework",
    "description": "12 choices and calculations · about 15 minutes",
    "format": "objective",
    "kind": "revision",
    "mode": "mixed",
    "count": 12,
    "demand": "standard",
    "duration": 15,
    "feedback": "after_final_attempt"
  },
  {
    "id": "calculations",
    "title": "Calculation homework",
    "description": "10 numerical questions with worked solutions",
    "format": "calculation",
    "kind": "exam",
    "mode": "exam",
    "count": 10,
    "demand": "standard",
    "duration": 20,
    "feedback": "after_final_attempt"
  },
  {
    "id": "weekly",
    "title": "Weekly revision homework",
    "description": "20 varied questions from your selected topic",
    "format": "mixed",
    "kind": "revision",
    "mode": "mixed",
    "count": 20,
    "demand": "standard",
    "duration": 25,
    "feedback": "after_final_attempt"
  },
  {
    "id": "written",
    "title": "Exam-answer homework",
    "description": "12 written questions for teacher review",
    "format": "written",
    "kind": "exam",
    "mode": "exam",
    "count": 12,
    "demand": "standard",
    "duration": 25,
    "feedback": "after_final_attempt"
  },
  {
    "id": "application",
    "title": "Application assessment",
    "description": "10 unfamiliar-context questions across the subject",
    "format": "application",
    "kind": "exam",
    "mode": "test",
    "count": 10,
    "demand": "standard",
    "duration": 25,
    "feedback": "after_final_attempt",
    "allTopics": true
  },
  {
    "id": "practical",
    "title": "Practical skills assessment",
    "description": "4 method, control and measurement questions across the subject",
    "format": "practical",
    "kind": "exam",
    "mode": "test",
    "count": 4,
    "demand": "standard",
    "duration": 20,
    "feedback": "after_final_attempt",
    "allTopics": true
  },
  {
    "id": "data",
    "title": "Data and evidence assessment",
    "description": "5 interpretation and evaluation questions across the subject",
    "format": "analysis",
    "kind": "exam",
    "mode": "test",
    "count": 5,
    "demand": "stretch",
    "duration": 20,
    "feedback": "after_final_attempt",
    "allTopics": true
  },
  {
    "id": "topic-test",
    "title": "End-of-topic assessment",
    "description": "20 mixed questions · one attempt · teacher-reviewed writing",
    "format": "mixed",
    "kind": "exam",
    "mode": "test",
    "count": 20,
    "demand": "standard",
    "duration": 30,
    "feedback": "after_final_attempt",
    "attempts": 1
  },
  {
    "id": "cumulative",
    "title": "Cumulative assessment",
    "description": "30 mixed questions across the subject · one attempt",
    "format": "mixed",
    "kind": "exam",
    "mode": "test",
    "count": 30,
    "demand": "stretch",
    "duration": 45,
    "feedback": "after_final_attempt",
    "attempts": 1,
    "allTopics": true
  }
];
return {presets};
});

(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.REVISION_HOMEWORK_RESOURCES=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const examples=[
  {
    "id": "cell",
    "type": "diagram",
    "title": "Cell structures",
    "href": "courses/homework-assets/cell.svg",
    "alt": "Cell with pointers A to the thick outer boundary, B to the large central space and C to a small oval containing stacked internal lines."
  },
  {
    "id": "circuit",
    "type": "diagram",
    "title": "Circuit symbols",
    "href": "courses/homework-assets/circuit.svg",
    "alt": "Single-loop circuit: A is a pair of unequal parallel lines at the top; B is a circle containing a cross at the right; C is a circle containing A at the bottom."
  },
  {
    "id": "distance-time",
    "type": "graph",
    "title": "Distance-time interpretation",
    "href": "courses/homework-assets/distance-time.svg",
    "alt": "Distance-time points: 0 seconds, 0 metres; 10 seconds, 20 metres; 20 seconds, 20 metres; 30 seconds, 40 metres. Linear axes."
  }
];
const find=id=>examples.find(e=>e.id===id),forType=type=>examples.filter(e=>e.type===type),fromHref=href=>examples.find(e=>e.href===href);
return {examples,find,forType,fromHref};
});

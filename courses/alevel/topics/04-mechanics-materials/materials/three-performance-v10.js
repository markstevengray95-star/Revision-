import * as THREE_BASE from './vendor/three.module.min.js';
export * from './vendor/three.module.min.js';

const configs={
  ultra:{pixelRatio:2,antialias:true,shadows:true},
  standard:{pixelRatio:1.5,antialias:true,shadows:true},
  low:{pixelRatio:1,antialias:false,shadows:false},
  '2d':{pixelRatio:1,antialias:false,shadows:false}
};
function mode(){try{return localStorage.getItem('materials.performance.v10')||'standard';}catch{return 'standard';}}
function config(){return configs[mode()]||configs.standard;}

export class WebGLRenderer extends THREE_BASE.WebGLRenderer{
  constructor(parameters={}){
    const c=config();
    super({...parameters,antialias:c.antialias});
    this._materialsMode='';

    // Three.js WebGLRenderer exposes key renderer methods as instance methods,
    // not superclass prototype methods. Capture those methods before wrapping
    // them so performance limits work across current Three.js releases.
    const baseSetPixelRatio=this.setPixelRatio.bind(this);
    const baseRender=this.render.bind(this);

    this.setPixelRatio=(value)=>{
      const current=config();
      return baseSetPixelRatio(Math.min(value||1,current.pixelRatio));
    };
    this.render=(scene,camera)=>{
      const m=mode(),current=config();
      if(m!==this._materialsMode){
        this._materialsMode=m;
        baseSetPixelRatio(Math.min(globalThis.devicePixelRatio||1,current.pixelRatio));
      }
      if(this.shadowMap)this.shadowMap.enabled=current.shadows;
      return baseRender(scene,camera);
    };

    this.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,c.pixelRatio));
  }
}

(() => {
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const details={
    charge:{
      title:"Microscopic current laboratory",
      apparatus:[["Metal conductor","Contains a lattice of positive ions and mobile conduction electrons."],["Current control","Changes the rate of charge flow through the conductor."],["Temperature control","Changes lattice vibration and therefore collision frequency."],["Virtual meters","Compare current, p.d. and resistance while conditions change."]],
      steps:["Set current to a low value and observe electron drift.","Double the current while holding time constant; compare charge transferred.","Raise temperature and describe how the lattice animation changes.","Use Q = It and V = IR to predict a reading before changing the control.","Capture at least four readings and explain which variables were controlled."],
      prompts:["Why is electron drift opposite to conventional current?","Why does a hotter metal usually have greater resistance?","What is conserved when charge moves through a component?"],
      presets:[["Low current",[.2,20,10,293]],["Double current",[.4,20,10,293]],["Hot lattice",[.4,20,10,650]],["Long time",[.4,50,10,293]]]
    },
    iv:{
      title:"Full I–V practical workstation",
      apparatus:[["Variable supply / rheostat","Changes the p.d. across the test component."],["Ammeter","Measures current in series."],["Voltmeter","Measures p.d. across the component."],["Test component","Swap between ohmic resistor, filament lamp and diode."]],
      steps:["Select the ohmic resistor and collect readings from negative to positive p.d.","Repeat for the filament lamp and compare curvature.","Select the diode and identify forward and reverse behaviour.","At two operating points calculate R = V/I and compare.","Use the graph to explain why gradient interpretation depends on the axes."],
      prompts:["Why does the lamp curve flatten at larger |V|?","Why should an ideal voltmeter have infinite resistance?","How would heating affect an intended ohmic-resistor experiment?"],
      presets:[["Resistor 2 V",[2,20,0]],["Resistor 6 V",[6,20,0]],["Lamp 6 V",[6,20,1]],["Diode forward",[1.2,20,2]],["Diode reverse",[-4,20,2]]]
    },
    resistivity:{
      title:"Required Practical 5 enhanced bench",
      apparatus:[["Metre wire","The active test length is changed with the movable contact."],["Crocodile clip","Defines the chosen length of test wire."],["Micrometer","Measures wire diameter; repeated readings improve reliability."],["Ammeter + voltmeter","Provide V and I so resistance can be calculated."],["Switch / low-voltage supply","Helps limit heating between readings."]],
      steps:["Record at least three diameter readings and calculate a mean.","Choose a low p.d. so the wire does not heat strongly.","Move the crocodile clip through several lengths and capture V and I.","Calculate R for each length and inspect the R–L graph.","Use gradient × area to estimate resistivity and comment on uncertainty."],
      prompts:["Why is diameter measured in several places?","Why does heating create a systematic problem?","What should the R–L graph intercept ideally be?"],
      presets:[["20 cm",[.2,.40,1.5,293]],["40 cm",[.4,.40,1.5,293]],["60 cm",[.6,.40,1.5,293]],["80 cm",[.8,.40,1.5,293]],["Hot wire",[.8,.40,1.5,350]]]
    },
    circuits:{
      title:"Circuit reasoning and conservation lab",
      apparatus:[["DC source","Provides the circuit p.d."],["R₁ and R₂","Can be compared in series and parallel."],["Junctions","In parallel mode they show current splitting and recombination."],["Power readout","Links current and p.d. to rate of energy transfer."],["Circuit Sandbox","Build additional idealised networks below the main simulation."]],
      steps:["Use the same R₁ and R₂ first in series and then in parallel.","Compare total resistance and explain why parallel is smaller.","Check that branch currents add to the total current.","Change one resistor only and predict total current before testing.","Compare total power for the series and parallel arrangements at fixed supply p.d."],
      prompts:["Which conservation law gives the junction rule?","Why is p.d. the same across parallel branches?","What quick check tells you a parallel-resistance answer is impossible?"],
      presets:[["Series",[9,10,15,0]],["Parallel",[9,10,15,1]],["Equal series",[9,10,10,0]],["Equal parallel",[9,10,10,1]],["High supply",[15,10,15,1]]]
    },
    divider:{
      title:"Sensor and potential-divider design lab",
      apparatus:[["Input supply","Provides Vin across the divider."],["Upper resistor","Fixed comparison resistance."],["Lower component","Choose fixed, NTC or LDR behaviour."],["Stimulus control","Represents temperature or light level."],["Output meter","Reads Vout across the lower component."]],
      steps:["Start with two fixed resistors and verify the divider equation.","Select the NTC and increase the stimulus; observe R and Vout.","Select the LDR and repeat.","Choose resistor values that place Vout near half Vin at the middle of the range.","Explain how swapping the sensor position would reverse the response direction."],
      prompts:["Which resistance belongs in the numerator of the divider equation?","Why does Vout across an NTC fall as temperature rises in this arrangement?","Why does a high-resistance voltmeter reduce loading?"],
      presets:[["Fixed midpoint",[9,4000,4000,0,50]],["NTC cool",[9,2000,4000,1,20]],["NTC hot",[9,2000,4000,1,80]],["LDR dark",[9,2000,4000,2,10]],["LDR bright",[9,2000,4000,2,90]]]
    },
    internal:{
      title:"Required Practical 6 enhanced source lab",
      apparatus:[["Cell with emf ε","Supplies energy per unit charge."],["Internal resistance r","Models energy transfer inside the source."],["Variable load","Changes current drawn from the source."],["Ammeter","Measures circuit current."],["Voltmeter","Measures terminal p.d. across the cell."],["Switch","Should be opened between readings in a real experiment to reduce heating/discharge."]],
      steps:["Start with a large load resistance and capture V and I.","Reduce the load step-by-step to increase current.","Collect at least five V–I points.","Use the graph intercept to estimate emf and the gradient magnitude to estimate internal resistance.","Compare terminal p.d. with emf and explain the difference as lost volts Ir."],
      prompts:["Why does terminal p.d. fall as current increases?","Why should the switch be opened between readings?","What physical meaning does the graph intercept have?"],
      presets:[["Open circuit",[6,1,8,0]],["Large load",[6,1,20,1]],["Medium load",[6,1,8,1]],["Small load",[6,1,2,1]],["High r",[6,3,8,1]]]
    }
  };
  let active="charge",completed={};
  function infer(){return $(".sim-tab.active")?.dataset.sim||active;}
  function controls(){return $$("#lpControls input, #lpControls select");}
  function setControls(vals){const cs=controls();vals.forEach((v,i)=>{const el=cs[i];if(!el)return;el.value=v;el.dispatchEvent(new Event(el.tagName==="SELECT"?"change":"input",{bubbles:true}));});}
  function render(){active=infer();const d=details[active],root=$("#labPlus");if(!d||!root)return;let panel=$("#simulationDepth");if(!panel){panel=document.createElement("section");panel.id="simulationDepth";panel.className="sim-depth";root.insertAdjacentElement("afterend",panel);}const done=completed[active]||new Set();completed[active]=done;panel.innerHTML=`
    <div class="sim-depth-head"><div><span class="eyebrow">Advanced interactive layer</span><h3>${d.title}</h3><p>Use the apparatus explorer, guided practical sequence and presets to turn the model into a complete learning activity.</p></div><div class="sim-depth-progress"><strong>${done.size}/${d.steps.length}</strong><span>tasks checked</span></div></div>
    <div class="sim-depth-grid">
      <section class="sim-depth-card"><h4>Apparatus explorer</h4><div class="apparatus-grid">${d.apparatus.map((a,i)=>`<button class="apparatus-item" data-apparatus="${i}"><strong>${a[0]}</strong><span>Tap for function</span></button>`).join("")}</div><div class="apparatus-explain" id="apparatusExplain">Select a piece of equipment to see why it is used.</div></section>
      <section class="sim-depth-card"><h4>Guided practical sequence</h4><div class="task-list">${d.steps.map((s,i)=>`<label class="task-item ${done.has(i)?"done":""}"><input type="checkbox" data-sim-task="${i}" ${done.has(i)?"checked":""}><span><strong>Step ${i+1}</strong>${s}</span></label>`).join("")}</div></section>
    </div>
    <section class="sim-depth-card"><div class="sim-depth-row"><div><h4>Interactive presets</h4><p>Jump to useful experimental states, then alter one variable and compare the result.</p></div><button class="button" id="autoCaptureSeries">Run preset series + capture</button></div><div class="preset-row">${d.presets.map((p,i)=>`<button class="preset-button" data-preset="${i}">${p[0]}</button>`).join("")}</div></section>
    <div class="sim-depth-grid">
      <section class="sim-depth-card"><h4>Explain the physics</h4>${d.prompts.map((p,i)=>`<details><summary>${p}</summary><textarea placeholder="Write an A-level explanation before checking your notes..."></textarea></details>`).join("")}</section>
      <section class="sim-depth-card"><h4>Measurement strategy</h4><div class="strategy-grid"><article><strong>Change one variable</strong><span>Keep other relevant variables controlled.</span></article><article><strong>Use a wide range</strong><span>Improves the quality of graph interpretation.</span></article><article><strong>Repeat</strong><span>Helps identify random variation or anomalies.</span></article><article><strong>Check units</strong><span>Convert to SI units before equation work.</span></article></div></section>
    </div>`;
  }
  document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.apparatus!==undefined){const d=details[active],a=d.apparatus[Number(b.dataset.apparatus)];const out=$("#apparatusExplain");if(out)out.innerHTML=`<strong>${a[0]}</strong><p>${a[1]}</p>`;return;}if(b.dataset.preset!==undefined){const p=details[active].presets[Number(b.dataset.preset)];setControls(p[1]);return;}if(b.id==="autoCaptureSeries") {const ps=details[active].presets;let i=0;const run=()=>{if(i>=ps.length)return;setControls(ps[i][1]);setTimeout(()=>{$("#lpCapture")?.click();i++;setTimeout(run,130);},100);};run();return;}if(b.classList.contains("sim-tab"))setTimeout(render,80);});
  document.addEventListener("change",e=>{if(e.target.dataset.simTask!==undefined){const i=Number(e.target.dataset.simTask),set=completed[active]||(completed[active]=new Set());e.target.checked?set.add(i):set.delete(i);render();}});
  const start=()=>{const lp=$("#labPlus");if(!lp){setTimeout(start,100);return;}render();const obs=new MutationObserver(()=>{const a=infer();if(a!==active){active=a;render();}});const tabs=$("#simTabs");if(tabs)obs.observe(tabs,{subtree:true,attributes:true,attributeFilter:["class"]});};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();

(() => {
  if(document.querySelector('script[data-real-wiring]')) return;
  const s=document.createElement('script');
  s.src='real-lab-wiring.js?v=1';
  s.dataset.realWiring='1';
  document.body.appendChild(s);
})();

(() => {
  const modules=[['extended-response.js?v=1','extendedResponse'],['simulation-interaction-v2.js?v=1','simulationInteractionV2']];
  modules.forEach(([src,key])=>{
    if(document.querySelector(`script[data-module="${key}"]`))return;
    const s=document.createElement('script');s.src=src;s.dataset.module=key;document.body.appendChild(s);
  });
})();
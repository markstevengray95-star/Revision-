// --- Core Framework ---
        function switchTab(moduleId) {
            document.querySelectorAll('.module-section').forEach(el => el.classList.add('hidden'));
            document.getElementById(moduleId).classList.remove('hidden');
            document.getElementById(moduleId).classList.add('flex');
            
            document.querySelectorAll('nav button').forEach(el => {
                el.classList.remove('bg-slate-800', 'border-blue-500', 'font-semibold', 'text-white');
                el.classList.add('border-transparent', 'text-slate-300');
            });
            
            const activeTab = document.getElementById('tab-' + moduleId);
            activeTab.classList.add('bg-slate-800', 'border-blue-500', 'font-semibold', 'text-white');
            activeTab.classList.remove('border-transparent', 'text-slate-300');

            resizeCanvases();
            
            // Re-init test if switching to it to ensure canvas renders
            if(moduleId === 'module-test' && testState.questions.length > 0) {
                renderTestQuestion();
            }
        }

        function showMessage(msg, isSuccess = true) {
            const alertBox = document.getElementById('custom-alert');
            const msgEl = document.getElementById('alert-message');
            const iconS = document.getElementById('alert-icon-success');
            const iconE = document.getElementById('alert-icon-error');
            
            msgEl.innerHTML = msg;
            
            if(isSuccess) {
                alertBox.classList.remove('bg-red-900');
                alertBox.classList.add('bg-green-900');
                iconE.classList.add('hidden');
                iconS.classList.remove('hidden');
            } else {
                alertBox.classList.remove('bg-green-900');
                alertBox.classList.add('bg-red-900');
                iconS.classList.add('hidden');
                iconE.classList.remove('hidden');
            }

            alertBox.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
            
            setTimeout(() => {
                alertBox.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
            }, 4000);
        }

        // --- Common Canvas Graphing Utilities ---
        class GraphGrid {
            constructor(canvas, xMin, xMax, yMin, yMax, xLabel, yLabel) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.padding = 60; 
                this.xMin = xMin; this.xMax = xMax;
                this.yMin = yMin; this.yMax = yMax;
                this.xLabel = xLabel; this.yLabel = yLabel;
            }

            mapX(x) { return this.padding + ((x - this.xMin) / (this.xMax - this.xMin)) * (this.canvas.width - 2 * this.padding); }
            mapY(y) { return this.canvas.height - this.padding - ((y - this.yMin) / (this.yMax - this.yMin)) * (this.canvas.height - 2 * this.padding); }
            unmapX(px) { return this.xMin + ((px - this.padding) / (this.canvas.width - 2 * this.padding)) * (this.xMax - this.xMin); }
            unmapY(py) { return this.yMin + ((this.canvas.height - this.padding - py) / (this.canvas.height - 2 * this.padding)) * (this.yMax - this.yMin); }

            draw() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fillStyle = '#f8fafc';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.lineWidth = 1;

                let xRange = this.xMax - this.xMin; let yRange = this.yMax - this.yMin;
                let xMajorStep = xRange / 10; let yMajorStep = yRange / 10;
                let xMinorStep = xMajorStep / 5; let yMinorStep = yMajorStep / 5;

                // Minor Grid Lines
                this.ctx.strokeStyle = '#e2e8f0';
                this.ctx.beginPath();
                for(let x = this.xMin; x <= this.xMax; x += xMinorStep) {
                    let px = this.mapX(x); this.ctx.moveTo(px, this.padding); this.ctx.lineTo(px, this.canvas.height - this.padding);
                }
                for(let y = this.yMin; y <= this.yMax; y += yMinorStep) {
                    let py = this.mapY(y); this.ctx.moveTo(this.padding, py); this.ctx.lineTo(this.canvas.width - this.padding, py);
                }
                this.ctx.stroke();

                // Major Grid Lines
                this.ctx.strokeStyle = '#cbd5e1';
                this.ctx.beginPath();
                for(let x = this.xMin; x <= this.xMax; x += xMajorStep) {
                    let px = this.mapX(x); this.ctx.moveTo(px, this.padding); this.ctx.lineTo(px, this.canvas.height - this.padding);
                }
                for(let y = this.yMin; y <= this.yMax; y += yMajorStep) {
                    let py = this.mapY(y); this.ctx.moveTo(this.padding, py); this.ctx.lineTo(this.canvas.width - this.padding, py);
                }
                this.ctx.stroke();

                // Axes
                this.ctx.strokeStyle = '#334155'; this.ctx.lineWidth = 2;
                let xAxisY = this.yMin <= 0 && this.yMax >= 0 ? this.mapY(0) : this.mapY(this.yMin);
                let yAxisX = this.xMin <= 0 && this.xMax >= 0 ? this.mapX(0) : this.mapX(this.xMin);

                this.ctx.beginPath();
                this.ctx.moveTo(this.padding, xAxisY); this.ctx.lineTo(this.canvas.width - this.padding, xAxisY);
                this.ctx.moveTo(yAxisX, this.padding); this.ctx.lineTo(yAxisX, this.canvas.height - this.padding);
                this.ctx.stroke();

                // Labels
                this.ctx.fillStyle = '#475569'; this.ctx.font = '12px Inter, sans-serif';
                this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'top';
                for(let x = this.xMin; x <= this.xMax; x += xMajorStep) this.ctx.fillText(Math.round(x * 10)/10, this.mapX(x), xAxisY + 5);
                this.ctx.textAlign = 'right'; this.ctx.textBaseline = 'middle';
                for(let y = this.yMin; y <= this.yMax; y += yMajorStep) this.ctx.fillText(Math.round(y * 10)/10, yAxisX - 5, this.mapY(y));

                // Titles
                this.ctx.fillStyle = '#0f172a'; this.ctx.font = 'bold 14px Inter, sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(this.xLabel, this.canvas.width / 2, this.canvas.height - 20);
                this.ctx.save();
                this.ctx.translate(20, this.canvas.height / 2); this.ctx.rotate(-Math.PI / 2);
                this.ctx.fillText(this.yLabel, 0, 0);
                this.ctx.restore();
            }

            drawCross(x, y, color = '#ef4444', size = 6) {
                const px = this.mapX(x); const py = this.mapY(y);
                this.ctx.strokeStyle = color; this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(px - size, py - size); this.ctx.lineTo(px + size, py + size);
                this.ctx.moveTo(px + size, py - size); this.ctx.lineTo(px - size, py + size);
                this.ctx.stroke();
            }
        }

        // --- Core Pointer Event Wrapper (Desktop & Mobile) ---
        function getPointerPos(e, canvas) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            let clientX = e.clientX, clientY = e.clientY;
            
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX; clientY = e.touches[0].clientY;
            }
            return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
        }

        // --- Modules 1-5 Logic Omitted for Brevity (Same as previously fixed code, highly condensed for space) ---
        // (Full logic for Plotting, Interpreting, Gradients, Area, BarChart included in full structure)
        
        // ... [Plotting Logic] ...
        const plottingCanvas = document.getElementById('canvas-plotting');
        let plottingGrid, activeData = [], datasets = {
            cooling: { xLabel: "Time (mins)", yLabel: "Temperature (°C)", vars: ["Time (mins)", "Temperature (°C)", "Volume (ml)", "Energy (J)"], xMin: 0, xMax: 60, yMin: 0, yMax: 100, desc: "A cup of hot liquid cooling down in a room." },
            spring: { xLabel: "Force (N)", yLabel: "Extension (cm)", vars: ["Force (N)", "Extension (cm)", "Mass (kg)", "Time (s)"], xMin: 0, xMax: 14, yMin: 0, yMax: 30, desc: "Adding weights to a spring." },
            filament: { xLabel: "Voltage (V)", yLabel: "Current (A)", vars: ["Voltage (V)", "Current (A)", "Resistance (Ω)", "Power (W)"], xMin: 0, xMax: 16, yMin: 0, yMax: 6, desc: "Current through a bulb as voltage increases." },
            enzyme: { xLabel: "pH Level", yLabel: "Rate of Reaction", vars: ["pH Level", "Rate of Reaction", "Temperature (°C)", "Concentration (mol/dm³)"], xMin: 0, xMax: 14, yMin: 0, yMax: 120, desc: "Enzyme breaking down a substrate." }
        };
        let currentDatasetKey = 'cooling', currentPlotTool = 'plot', userLine = { start: null, end: null }, showIdealLine = false, anomalyIdentified = false, variablesConfirmed = false, missedClicks = [];
        
        function changeDataset() {
            currentDatasetKey = document.getElementById('dataset-selector').value;
            let ds = datasets[currentDatasetKey];
            activeData = [];
            let anomalyIdx = Math.floor(Math.random() * 3) + 1;
            
            if(currentDatasetKey==='cooling') {
                ds.idealFn = x => 60 * Math.exp(-0.05 * x) + 20;
                [10, 20, 30, 40, 50].forEach((x,i) => activeData.push({x:x, y: Math.round(ds.idealFn(x)) + (i===anomalyIdx?15:0), found:false, anomaly:i===anomalyIdx}));
                ds.interpX = 25; ds.interpQ = "Expected temp at 25 mins?"; ds.extrapX = 55; ds.extrapQ = "Expected temp at 55 mins?"; ds.contextQ = "What is the room temperature based on the asymptote?"; ds.contextAns = 20;
            } else if(currentDatasetKey==='spring') {
                ds.idealFn = x => 2 * x;
                [2,4,6,8,10].forEach((x,i) => activeData.push({x:x, y: ds.idealFn(x) + (i===anomalyIdx?-4:0), found:false, anomaly:i===anomalyIdx}));
                ds.interpX = 7; ds.interpQ = "Extension at 7N?"; ds.extrapX = 13; ds.extrapQ = "Extension at 13N?"; ds.contextQ = "Calculate spring constant (1/gradient)"; ds.contextAns = 0.5;
            } else if(currentDatasetKey==='filament') {
                ds.idealFn = x => 1.5 * Math.sqrt(x);
                [2,4,6,8,10].forEach((x,i) => activeData.push({x:x, y: Math.round(ds.idealFn(x)*10)/10 + (i===anomalyIdx?1:0), found:false, anomaly:i===anomalyIdx}));
                ds.interpX = 5; ds.interpQ = "Current at 5V?"; ds.extrapX = 15; ds.extrapQ = "Current at 15V?"; ds.contextQ = "Does resistance 'increase' or 'decrease'?"; ds.contextAns = "increase";
            } else if(currentDatasetKey==='enzyme') {
                ds.idealFn = x => 100 * Math.exp(-0.1 * Math.pow(x-7, 2));
                [4,6,7,10,12].forEach((x,i) => activeData.push({x:x, y: Math.round(ds.idealFn(x)) + (i===anomalyIdx?-20:0), found:false, anomaly:i===anomalyIdx}));
                ds.interpX = 5; ds.interpQ = "Rate at pH 5?"; ds.extrapX = 13; ds.extrapQ = "Rate at pH 13?"; ds.contextQ = "What is the optimum pH?"; ds.contextAns = 7;
            }
            ds.interpY = ds.idealFn(ds.interpX); ds.extrapY = ds.idealFn(ds.extrapX);
            
            // Reset UI
            variablesConfirmed = false; anomalyIdentified = false; userLine = {start:null, end:null}; showIdealLine = false; missedClicks = []; setPlotTool('plot');
            document.getElementById('step-2-container').classList.add('opacity-50', 'pointer-events-none');
            document.getElementById('var-x-select').innerHTML = '<option value="">-- Select --</option>' + [...ds.vars].sort(()=>Math.random()-0.5).map(v=>`<option value="${v}">${v}</option>`).join('');
            document.getElementById('var-y-select').innerHTML = '<option value="">-- Select --</option>' + [...ds.vars].sort(()=>Math.random()-0.5).map(v=>`<option value="${v}">${v}</option>`).join('');
            document.getElementById('scenario-desc').innerText = ds.desc;
            document.getElementById('th-x').innerText = ds.xLabel; document.getElementById('th-y').innerText = ds.yLabel;
            ['var-feedback', 'plotting-feedback', 'anomaly-step', 'lobf-step', 'interp-step', 'extrap-step', 'context-step'].forEach(id => document.getElementById(id).classList.add('hidden'));
            
            plottingGrid = new GraphGrid(plottingCanvas, ds.xMin, ds.xMax, ds.yMin, ds.yMax, ds.xLabel, ds.yLabel);
            updatePlotTable(); drawPlottingModule();
        }

        function checkVariables() {
            const ds = datasets[currentDatasetKey];
            if(document.getElementById('var-x-select').value === ds.xLabel && document.getElementById('var-y-select').value === ds.yLabel) {
                variablesConfirmed = true;
                document.getElementById('step-2-container').classList.remove('opacity-50', 'pointer-events-none');
                showMessage("Correct Variables!");
            } else showMessage("Incorrect. X is Independent (you change), Y is Dependent.", false);
        }

        function updatePlotTable() {
            document.getElementById('plot-table-body').innerHTML = activeData.map(pt => `<tr class="${pt.found?'bg-green-50':'bg-white'}"><td class="p-2 border text-center">${pt.x}</td><td class="p-2 border text-center">${pt.y}</td><td class="p-2 border text-center text-xl">${pt.found?'✅':'⚪'}</td></tr>`).join('');
        }

        function setPlotTool(t) { currentPlotTool = t; userLine={start:null,end:null}; drawPlottingModule(); }
        
        function handlePlotClick(e) {
            if(e.cancelable) e.preventDefault();
            if(!variablesConfirmed) return showMessage("Confirm variables first!", false);
            const pos = getPointerPos(e, plottingCanvas);
            const dataX = plottingGrid.unmapX(pos.x), dataY = plottingGrid.unmapY(pos.y);
            
            if(currentPlotTool === 'anomaly') {
                let hit = activeData.find(pt => pt.anomaly && Math.hypot(plottingGrid.mapX(pt.x)-pos.x, plottingGrid.mapY(pt.y)-pos.y) < 30);
                if(hit) { anomalyIdentified = true; setPlotTool('line'); document.getElementById('tool-line').disabled = false; document.getElementById('lobf-step').classList.remove('hidden'); showMessage("Anomaly found! Now draw the line."); }
                else showMessage("Incorrect anomaly.", false);
            } else if(currentPlotTool === 'line') {
                if(!userLine.start) userLine.start = {x:dataX, y:dataY};
                else if(!userLine.end) {
                    userLine.end = {x:dataX, y:dataY};
                    showIdealLine = true;
                    document.getElementById('interp-step').classList.remove('hidden'); document.getElementById('interp-question').innerText = datasets[currentDatasetKey].interpQ;
                    document.getElementById('extrap-question').innerText = datasets[currentDatasetKey].extrapQ;
                } else userLine = {start:{x:dataX,y:dataY}, end:null};
            } else {
                let hit = activeData.find(pt => !pt.found && Math.hypot(plottingGrid.mapX(pt.x)-pos.x, plottingGrid.mapY(pt.y)-pos.y) < 30);
                if(hit) {
                    hit.found = true; updatePlotTable();
                    if(activeData.every(p=>p.found)) {
                        document.getElementById('tool-anomaly').classList.remove('hidden'); document.getElementById('anomaly-step').classList.remove('hidden'); showMessage("All points plotted. Now find the anomaly.");
                    }
                } else if (dataX >= plottingGrid.xMin && dataX <= plottingGrid.xMax && dataY >= plottingGrid.yMin && dataY <= plottingGrid.yMax) {
                    missedClicks.push({x: dataX, y: dataY});
                    showMessage("Incorrect coordinate. Look closely at the table!", false);
                }
            }
            drawPlottingModule();
        }

        function drawPlottingModule() {
            if(!plottingGrid) return;
            plottingGrid.draw(); const ctx = plottingCanvas.getContext('2d');
            
            missedClicks.forEach(pt => plottingGrid.drawCross(pt.x, pt.y, '#ef4444'));

            activeData.filter(p=>p.found).forEach(pt => {
                let color = (pt.anomaly && anomalyIdentified) ? '#f59e0b' : '#16a34a';
                plottingGrid.drawCross(pt.x, pt.y, color);
                if(pt.anomaly && anomalyIdentified) { ctx.strokeStyle=color; ctx.beginPath(); ctx.arc(plottingGrid.mapX(pt.x), plottingGrid.mapY(pt.y), 15, 0, Math.PI*2); ctx.stroke(); }
            });
            if(userLine.start && userLine.end) { ctx.strokeStyle='#9333ea'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(plottingGrid.mapX(userLine.start.x), plottingGrid.mapY(userLine.start.y)); ctx.lineTo(plottingGrid.mapX(userLine.end.x), plottingGrid.mapY(userLine.end.y)); ctx.stroke(); }
            else if(userLine.start) plottingGrid.drawCross(userLine.start.x, userLine.start.y, '#9333ea', 4);
            
            if(showIdealLine) {
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'; ctx.setLineDash([5,5]); ctx.lineWidth=4; ctx.beginPath();
                for(let x=plottingGrid.xMin; x<=plottingGrid.xMax; x+=(plottingGrid.xMax-plottingGrid.xMin)/50) {
                    let y=datasets[currentDatasetKey].idealFn(x);
                    if(x===plottingGrid.xMin) ctx.moveTo(plottingGrid.mapX(x), plottingGrid.mapY(y)); else ctx.lineTo(plottingGrid.mapX(x), plottingGrid.mapY(y));
                }
                ctx.stroke(); ctx.setLineDash([]);
            }
        }
        
        function checkInterpolation() {
            let ds = datasets[currentDatasetKey], val = parseFloat(document.getElementById('interp-input').value);
            if(Math.abs(val - ds.interpY) < 4) { showMessage("Correct Interpolation!"); document.getElementById('extrap-step').classList.remove('hidden'); }
            else showMessage(`Incorrect. Look closely at X=${ds.interpX}`, false);
        }
        
        function checkExtrapolation() {
            let ds = datasets[currentDatasetKey], val = parseFloat(document.getElementById('extrap-input').value);
            if(Math.abs(val - ds.extrapY) < 4) { showMessage("Correct Extrapolation!"); document.getElementById('context-step').classList.remove('hidden'); document.getElementById('context-question').innerText = ds.contextQ; }
            else showMessage(`Incorrect. Extend the line to X=${ds.extrapX}`, false);
        }

        function checkContext() {
            let ds = datasets[currentDatasetKey], val = document.getElementById('context-input').value.toLowerCase();
            if(val.includes(ds.contextAns.toString().toLowerCase())) showMessage("Brilliant! Module Complete.");
            else showMessage("Incorrect context answer.", false);
        }

        // ... [Interpreting Data Logic] ...
        const interpretingCanvas = document.getElementById('canvas-interpreting'); let interpretingGrid, isQuizMode = false, currentQuizAnswer = '';
        const relationships = {
            proportional: { fn: x => 2*x }, linear: { fn: x => 1.5*x+20 }, inverse: { fn: x => x===0?100:200/x },
            quadratic: { fn: x => 0.02*x*x }, inverse_square: { fn: x => x===0?200:1000/(x*x) }, exponential: { fn: x => 180*Math.exp(-0.05*x) }, plateau: { fn: x => 150*(1-Math.exp(-0.06*x)) }
        };
        function setInterpretingMode(m) {
            isQuizMode = m==='quiz';
            document.querySelectorAll('.relation-desc').forEach(el => isQuizMode?el.classList.add('hidden'):el.classList.remove('hidden'));
            document.getElementById('interpreting-title').innerText = isQuizMode ? "What relationship is shown?" : "Select a Relationship:";
            if(isQuizMode) nextQuizQuestion(); else updateInterpreting();
        }
        function nextQuizQuestion() {
            let keys = Object.keys(relationships); currentQuizAnswer = keys[Math.floor(Math.random()*keys.length)];
            document.querySelectorAll('input[name="relationship"]').forEach(r => r.checked=false); drawInterpretingModule(relationships[currentQuizAnswer].fn);
        }
        function updateInterpreting() {
            let sel = document.querySelector('input[name="relationship"]:checked'); if(!sel) return;
            if(isQuizMode) {
                if(sel.value === currentQuizAnswer) { showMessage("Correct!"); setTimeout(nextQuizQuestion, 1500); }
                else showMessage("Incorrect shape.", false);
            } else drawInterpretingModule(relationships[sel.value].fn);
        }
        function drawInterpretingModule(fn) {
            if(!interpretingGrid) interpretingGrid = new GraphGrid(interpretingCanvas, 0, 100, 0, 200, 'X', 'Y');
            interpretingGrid.draw(); const ctx = interpretingCanvas.getContext('2d'); ctx.strokeStyle='#8b5cf6'; ctx.lineWidth=3; ctx.beginPath();
            if(!fn) fn = relationships.proportional.fn;
            for(let x=0; x<=100; x++) { let y=fn(x); if(y<=200) { if(x===0) ctx.moveTo(interpretingGrid.mapX(x), interpretingGrid.mapY(y)); else ctx.lineTo(interpretingGrid.mapX(x), interpretingGrid.mapY(y)); } }
            ctx.stroke();
        }

        // ... [Gradients Logic] ...
        const gradCanvas = document.getElementById('canvas-gradient'); let gradGrid, mLine=2, cLine=10, isCurveMode=false, pt1=null, pt2=null, tanPt=null, hoverPt=null;
        function setGradMode(m) { isCurveMode = m==='curve'; generateRandomGradientLine(); }
        function generateRandomGradientLine() { mLine = Math.round((Math.random()*2+0.5)*10)/10; cLine = Math.round(Math.random()*30); resetGradient(); }
        function resetGradient() { pt1=null; pt2=null; tanPt=null; document.getElementById('grad-step-2').classList.add('opacity-50'); document.getElementById('grad-step-3').classList.add('opacity-50'); document.getElementById('grad-feedback').classList.add('hidden'); drawGradientModule(); }
        
        function handleGradInteraction(e) {
            if(e.cancelable) e.preventDefault();
            const pos = getPointerPos(e, gradCanvas);
            if(!gradGrid) return;
            let dx = Math.max(0, Math.min(50, Math.round(gradGrid.unmapX(pos.x)/2)*2)), dy;
            if(isCurveMode) {
                if(!tanPt) dy = 0.04*dx*dx;
                else dy = (0.08*tanPt.x)*dx + (tanPt.y - (0.08*tanPt.x)*tanPt.x);
            } else dy = mLine*dx+cLine;
            hoverPt = {x:dx, y:dy}; drawGradientModule();
        }
        function handleGradClick(e) {
            if(pt1 && pt2) return;
            if(isCurveMode && !tanPt) { tanPt = {...hoverPt}; showMessage("Tangent drawn. Now pick 2 points on it."); drawGradientModule(); return; }
            if(!pt1) { pt1 = {...hoverPt}; document.getElementById('grad-step-2').classList.remove('opacity-50'); }
            else if(hoverPt.x !== pt1.x) { 
                pt2 = {...hoverPt}; document.getElementById('grad-step-3').classList.remove('opacity-50');
                document.getElementById('calc-dy').innerText = `${Math.round(pt2.y*10)/10} - ${Math.round(pt1.y*10)/10}`;
                document.getElementById('calc-dx').innerText = `${pt2.x} - ${pt1.x}`;
            }
            drawGradientModule();
        }
        function drawGradientModule() {
            if(!gradGrid) gradGrid = new GraphGrid(gradCanvas, 0, 50, 0, 120, 'Time (s)', 'Velocity (m/s)');
            gradGrid.draw(); const ctx = gradCanvas.getContext('2d');
            ctx.strokeStyle='#0f172a'; ctx.lineWidth=3; ctx.beginPath();
            if(isCurveMode) {
                for(let x=0; x<=50; x++) { if(x===0) ctx.moveTo(gradGrid.mapX(0), gradGrid.mapY(0)); else ctx.lineTo(gradGrid.mapX(x), gradGrid.mapY(0.04*x*x)); }
                ctx.stroke();
                if(tanPt) {
                    let m=0.08*tanPt.x, c=tanPt.y-m*tanPt.x; ctx.strokeStyle='#f43f5e'; ctx.beginPath(); ctx.moveTo(gradGrid.mapX(0), gradGrid.mapY(c)); ctx.lineTo(gradGrid.mapX(50), gradGrid.mapY(m*50+c)); ctx.stroke();
                }
            } else {
                ctx.moveTo(gradGrid.mapX(0), gradGrid.mapY(cLine)); ctx.lineTo(gradGrid.mapX(50), gradGrid.mapY(mLine*50+cLine)); ctx.stroke();
            }
            if(hoverPt && !pt2) { ctx.fillStyle='rgba(59,130,246,0.5)'; ctx.beginPath(); ctx.arc(gradGrid.mapX(hoverPt.x), gradGrid.mapY(hoverPt.y), 6, 0, Math.PI*2); ctx.fill(); }
            if(pt1) gradGrid.drawCross(pt1.x, pt1.y, '#2563eb');
            if(pt2) {
                gradGrid.drawCross(pt2.x, pt2.y, '#9333ea');
                ctx.strokeStyle='#ef4444'; ctx.setLineDash([5,5]); ctx.beginPath();
                let px1 = pt1.x<pt2.x?pt1:pt2, px2 = pt1.x<pt2.x?pt2:pt1;
                ctx.moveTo(gradGrid.mapX(px1.x), gradGrid.mapY(px1.y)); ctx.lineTo(gradGrid.mapX(px2.x), gradGrid.mapY(px1.y)); ctx.lineTo(gradGrid.mapX(px2.x), gradGrid.mapY(px2.y)); ctx.stroke(); ctx.setLineDash([]);
            }
        }
        function checkGradient() {
            let uM = parseFloat(document.getElementById('grad-input').value), unit = document.getElementById('grad-unit').value;
            let aM = (pt2.y-pt1.y)/(pt2.x-pt1.x);
            let dy = pt2.y - pt1.y, dx = pt2.x - pt1.x;
            let feedbackEl = document.getElementById('grad-feedback');

            if(Math.abs(uM-aM)<0.15 && unit==='m/s²') { 
                showMessage("Correct Gradient & Unit!"); 
                feedbackEl.classList.add('hidden');
                if(!isCurveMode) document.getElementById('grad-step-4').classList.remove('hidden'); 
            } else { 
                showMessage("Incorrect. Review the steps below.", false); 
                feedbackEl.innerHTML = `
                    <div class="text-left font-normal bg-red-50 p-3 rounded-lg border border-red-200 mt-2 text-slate-800 text-xs shadow-inner">
                        <span class="font-bold text-red-800 block mb-1">Step-by-Step Solution:</span>
                        <div class="space-y-1">
                            <div>1. <strong>Δy (Rise)</strong> = y₂ - y₁ = ${Math.round(pt2.y*10)/10} - ${Math.round(pt1.y*10)/10} = <strong>${Math.round(dy*10)/10}</strong></div>
                            <div>2. <strong>Δx (Run)</strong> = x₂ - x₁ = ${pt2.x} - ${pt1.x} = <strong>${dx}</strong></div>
                            <div>3. <strong>Gradient</strong> = Δy ÷ Δx = ${Math.round(dy*10)/10} ÷ ${dx} = <strong>${(Math.round((dy/dx)*10)/10).toFixed(1)}</strong></div>
                            <div>4. <strong>Units</strong>: Velocity (m/s) ÷ Time (s) = <strong>m/s²</strong></div>
                        </div>
                    </div>
                `;
                feedbackEl.classList.remove('hidden');
            }
        }
        function checkIntercept() {
            if(Math.abs(parseFloat(document.getElementById('intercept-input').value)-cLine)<0.5) showMessage("Correct Y-Intercept!"); else showMessage("Incorrect Intercept", false);
        }

        // ... [Area Under Curve Logic] ...
        const areaCanvas = document.getElementById('canvas-area'); let areaGrid, aX=10, aY1=20, aY2=50;
        function generateRandomAreaProblem() { 
            aX=Math.floor(Math.random()*10)+5; aY1=Math.floor(Math.random()*20)+10; aY2=aY1+Math.floor(Math.random()*25)+10; 
            document.getElementById('area-feedback').classList.add('hidden');
            document.getElementById('area-rect-input').value = '';
            document.getElementById('area-tri-input').value = '';
            drawAreaModule(); 
        }
        function drawAreaModule() {
            if(!areaGrid) areaGrid = new GraphGrid(areaCanvas, 0, 15, 0, 60, 'Time (s)', 'Speed (m/s)');
            areaGrid.draw(); const ctx = areaCanvas.getContext('2d');
            ctx.fillStyle='rgba(59,130,246,0.2)'; ctx.fillRect(areaGrid.mapX(0), areaGrid.mapY(aY1), areaGrid.mapX(aX)-areaGrid.mapX(0), areaGrid.mapY(0)-areaGrid.mapY(aY1));
            ctx.fillStyle='rgba(147,51,234,0.2)'; ctx.beginPath(); ctx.moveTo(areaGrid.mapX(0), areaGrid.mapY(aY1)); ctx.lineTo(areaGrid.mapX(aX), areaGrid.mapY(aY1)); ctx.lineTo(areaGrid.mapX(aX), areaGrid.mapY(aY2)); ctx.fill();
            ctx.strokeStyle='#0f172a'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(areaGrid.mapX(0), areaGrid.mapY(aY1)); ctx.lineTo(areaGrid.mapX(aX), areaGrid.mapY(aY2)); ctx.stroke();
            ctx.fillStyle='#1e293b'; ctx.font='bold 12px Inter'; ctx.fillText(`(0, ${aY1})`, areaGrid.mapX(0)+15, areaGrid.mapY(aY1)-10); ctx.fillText(`(${aX}, ${aY2})`, areaGrid.mapX(aX)-15, areaGrid.mapY(aY2)-10);
        }
        function checkAreaAnswer() {
            let r=parseInt(document.getElementById('area-rect-input').value), t=parseInt(document.getElementById('area-tri-input').value);
            let actualR = aX * aY1;
            let actualT = 0.5 * aX * (aY2 - aY1);
            let feedbackEl = document.getElementById('area-feedback');

            if(r===actualR && t===actualT) { 
                showMessage(`Correct! Total = ${actualR+actualT}`); 
                feedbackEl.classList.add('hidden');
                document.getElementById('area-context-step').classList.remove('hidden'); 
            } else { 
                showMessage("Incorrect areas. Review the steps below.", false); 
                feedbackEl.innerHTML = `
                    <div class="text-left font-normal bg-red-50 p-3 rounded-lg border border-red-200 mt-2 text-sm text-slate-800 shadow-inner">
                        <span class="font-bold text-red-800 block mb-2">Step-by-Step Solution:</span>
                        <div class="mb-2">
                            <strong>1. Rectangle Area (Base × Height):</strong><br>
                            Base = ${aX}, Height = ${aY1}<br>
                            Area = ${aX} × ${aY1} = <strong class="text-blue-700">${actualR}</strong>
                        </div>
                        <div class="mb-2">
                            <strong>2. Triangle Area (½ × Base × Height):</strong><br>
                            Base = ${aX}, Height = (${aY2} - ${aY1}) = ${aY2 - aY1}<br>
                            Area = ½ × ${aX} × ${aY2 - aY1} = <strong class="text-purple-700">${actualT}</strong>
                        </div>
                        <div class="pt-2 border-t border-red-200">
                            <strong>Total Area</strong> = ${actualR} + ${actualT} = <strong>${actualR + actualT}</strong>
                        </div>
                    </div>
                `;
                feedbackEl.classList.remove('hidden');
            }
        }
        function checkAreaContext() {
            if(document.getElementById('area-context-select').value==='distance') showMessage("Correct! Area of Speed-Time = Distance"); else showMessage("Incorrect Quantity", false);
        }

        // ... [Bar Chart Logic] ...
        const barCanvas = document.getElementById('canvas-barchart'); let barVals=[0,0,0,0,0], barTargs=[10,25,15,20,30], barDrag=-1;
        function handleBarInteraction(e) {
            if(e.cancelable) e.preventDefault();
            const pos = getPointerPos(e, barCanvas);
            const cw=barCanvas.width, ch=barCanvas.height, p=60, sw=(cw-2*p)/11;
            if(e.type.includes('down')||e.type.includes('start')) {
                for(let i=0;i<5;i++) if(pos.x > p+sw+i*2*sw && pos.x < p+2*sw+i*2*sw) barDrag = i;
            }
            if(barDrag !== -1) {
                let val = ((ch-p-pos.y)/(ch-2*p))*40; barVals[barDrag] = Math.max(0, Math.min(40, Math.round(val))); drawBarChartModule();
            }
            if(e.type.includes('up')||e.type.includes('end')) barDrag = -1;
        }
        function drawBarChartModule() {
            const ctx = barCanvas.getContext('2d'), cw=barCanvas.width, ch=barCanvas.height, p=60, sw=(cw-2*p)/11;
            ctx.clearRect(0,0,cw,ch); ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,cw,ch);
            ctx.strokeStyle='#cbd5e1'; ctx.beginPath(); for(let v=0;v<=40;v+=10) { let y=ch-p-(v/40)*(ch-2*p); ctx.moveTo(p,y); ctx.lineTo(cw-p,y); } ctx.stroke();
            
            // NEW: Draw Axis Labels
            ctx.fillStyle = '#0f172a'; ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'center'; ctx.fillText('Energy Source', cw / 2, ch - 15);
            ctx.save(); ctx.translate(20, ch / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Percentage (%)', 0, 0); ctx.restore();

            ctx.strokeStyle='#334155'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(p,p); ctx.lineTo(p,ch-p); ctx.lineTo(cw-p,ch-p); ctx.stroke();
            const colors=['#b45309','#0284c7','#eab308','#059669','#475569'], cats=['Coal','Wind','Solar','Nuclear','Gas'];
            ctx.textAlign='center'; ctx.font='bold 12px Inter';
            for(let i=0;i<5;i++) {
                let x = p+sw+i*2*sw, h = (barVals[i]/40)*(ch-2*p), y = ch-p-h;
                ctx.fillStyle=colors[i]; ctx.fillRect(x,y,sw,h); ctx.strokeRect(x,y,sw,h);
                ctx.fillText(cats[i], x+sw/2, ch-p+15);
            }
        }
        function checkBarChart() {
            if(barVals.every((v,i)=>Math.abs(v-barTargs[i])<=1)) {
                showMessage("Perfect Bar Chart!");
                document.getElementById('barchart-context-step').classList.remove('hidden');
            } else {
                showMessage("Incorrect heights. Check the table values.", false);
            }
        }

        // NEW: Check context logic
        function checkBarContext() {
            if(document.getElementById('barchart-context-select').value === 'gas') {
                showMessage("Correct! Gas is the modal category as it has the highest percentage.", true);
            } else {
                showMessage("Incorrect. The mode is the category with the highest bar.", false);
            }
        }

        // --- NEW MODULE 6: FINAL TEST LOGIC ---
        let testState = { currentQ: 0, score: 0, questions: [] };
        const testCanvas = document.getElementById('canvas-test');
        let testGrid;

        function initTestModule() {
            document.getElementById('test-completion-screen').classList.add('hidden');
            testState.score = 0;
            testState.currentQ = 0;
            updateTestScore();
            
            // Generate 5 dynamic questions
            testState.questions = [
                generateTestQ1(), // Variable
                generateTestQ2(), // Relationship
                generateTestQ3(), // Gradient
                generateTestQ4(), // Interpolation
                generateTestQ5()  // Area
            ];
            
            renderTestQuestion();
        }

        function updateTestScore() {
            document.getElementById('test-score-display').innerText = `Score: ${testState.score}/5`;
        }

        function renderTestQuestion() {
            const q = testState.questions[testState.currentQ];
            document.getElementById('test-q-number').innerText = `Question ${testState.currentQ + 1} of 5`;
            document.getElementById('test-q-text').innerText = q.text;
            
            const inputContainer = document.getElementById('test-input-container');
            inputContainer.innerHTML = '';
            
            // Build UI based on question type
            if(q.type === 'mcq') {
                q.options.forEach((opt, idx) => {
                    const label = document.createElement('label');
                    label.className = "flex items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors bg-white";
                    label.innerHTML = `<input type="radio" name="test-mcq" value="${opt}" class="mr-3 text-blue-600 focus:ring-blue-500"><span class="font-medium text-slate-700">${opt}</span>`;
                    inputContainer.appendChild(label);
                });
            } else if (q.type === 'input') {
                inputContainer.innerHTML = `
                    <div class="flex items-center space-x-3 bg-white p-4 border rounded-lg">
                        <span class="font-bold text-slate-700">Answer:</span>
                        <input type="number" id="test-num-input" class="w-24 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        ${q.unit ? `<span class="text-slate-500">${q.unit}</span>` : ''}
                    </div>
                `;
            }

            // Handle Visuals
            const visualText = document.getElementById('test-visual-text');
            if (q.needsGraph) {
                visualText.classList.add('hidden');
                testCanvas.classList.remove('hidden');
                drawTestGraph(q);
            } else {
                testCanvas.classList.add('hidden');
                visualText.classList.remove('hidden');
                visualText.innerText = q.visualTextFallback || "?";
            }
        }

        function submitTestAnswer() {
            const q = testState.questions[testState.currentQ];
            let isCorrect = false;

            if (q.type === 'mcq') {
                const selected = document.querySelector('input[name="test-mcq"]:checked');
                if (!selected) return showMessage("Please select an answer.", false);
                isCorrect = (selected.value === q.correctAnswer);
            } else if (q.type === 'input') {
                const val = parseFloat(document.getElementById('test-num-input').value);
                if (isNaN(val)) return showMessage("Please enter a number.", false);
                isCorrect = Math.abs(val - q.correctAnswer) <= (q.tolerance || 0);
            }

            if (isCorrect) {
                testState.score++;
                showMessage("Correct!", true);
            } else {
                showMessage(`Incorrect. The answer was: ${q.correctAnswer}`, false);
            }
            
            updateTestScore();

            setTimeout(() => {
                testState.currentQ++;
                if (testState.currentQ < 5) {
                    renderTestQuestion();
                } else {
                    finishTest();
                }
            }, 1500);
        }

        function finishTest() {
            document.getElementById('test-completion-screen').classList.remove('hidden');
            document.getElementById('final-score-text').innerText = `${testState.score} / 5`;
        }

        // Test Question Generators
        function generateTestQ1() {
            const variables = [
                {q: "A student measures how the rate of photosynthesis changes with light intensity. Which variable belongs on the X-Axis?", a: "Light Intensity", opts: ["Light Intensity", "Rate of Photosynthesis", "Temperature", "Time"]},
                {q: "When investigating Hooke's Law (Force vs Extension), which variable is the Dependent variable (Y-Axis)?", a: "Extension", opts: ["Force", "Extension", "Spring Constant", "Mass"]}
            ];
            const choice = variables[Math.floor(Math.random()*variables.length)];
            return { type: 'mcq', text: choice.q, options: choice.opts.sort(()=>Math.random()-0.5), correctAnswer: choice.a, needsGraph: false, visualTextFallback: "Variables" };
        }

        function generateTestQ2() {
            const keys = Object.keys(relationships);
            const ansKey = keys[Math.floor(Math.random() * keys.length)];
            let formattedName = ansKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            if(ansKey === 'proportional') formattedName = "Directly Proportional";
            
            let opts = [formattedName];
            while(opts.length < 4) {
                let rKey = keys[Math.floor(Math.random() * keys.length)];
                let rName = rKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                if(rKey === 'proportional') rName = "Directly Proportional";
                if(!opts.includes(rName)) opts.push(rName);
            }
            
            return { type: 'mcq', text: "What type of mathematical relationship is shown in the graph?", options: opts.sort(()=>Math.random()-0.5), correctAnswer: formattedName, needsGraph: true, graphType: 'relationship', fn: relationships[ansKey].fn };
        }

        function generateTestQ3() {
            let m = Math.round((Math.random()*2+1)*10)/10;
            let c = Math.round(Math.random()*20);
            return { type: 'input', text: "Calculate the exact gradient of the line shown on the graph.", correctAnswer: m, tolerance: 0.1, needsGraph: true, graphType: 'gradient', m: m, c: c };
        }

        function generateTestQ4() {
            let start = 80 + Math.random()*10;
            let fn = x => start * Math.exp(-0.06 * x);
            let targetX = Math.round(Math.random()*10)*2 + 10; // 10 to 30
            let ans = Math.round(fn(targetX));
            return { type: 'input', text: `Using interpolation, what is the expected value on the Y-axis when X = ${targetX}?`, correctAnswer: ans, tolerance: 2, needsGraph: true, graphType: 'interp', fn: fn, targetX: targetX };
        }

        function generateTestQ5() {
            let x = Math.floor(Math.random()*6)+4; // 4 to 9
            let y1 = Math.floor(Math.random()*10)+10; // 10 to 19
            let y2 = y1 + Math.floor(Math.random()*15)+10; 
            let area = (x * y1) + (0.5 * x * (y2 - y1));
            return { type: 'input', text: "Calculate the total distance travelled (Area under the velocity-time graph).", correctAnswer: area, unit: "m", tolerance: 0, needsGraph: true, graphType: 'area', x: x, y1: y1, y2: y2 };
        }

        function drawTestGraph(q) {
            if(!testGrid) testGrid = new GraphGrid(testCanvas, 0, 100, 0, 100, 'X', 'Y');
            const ctx = testCanvas.getContext('2d');
            
            if(q.graphType === 'relationship') {
                testGrid.xMax = 100; testGrid.yMax = 200; testGrid.xLabel = 'Variable X'; testGrid.yLabel = 'Variable Y'; testGrid.draw();
                ctx.strokeStyle='#3b82f6'; ctx.lineWidth=4; ctx.beginPath();
                for(let x=0; x<=100; x++) { let y=q.fn(x); if(y<=200) { if(x===0) ctx.moveTo(testGrid.mapX(x), testGrid.mapY(y)); else ctx.lineTo(testGrid.mapX(x), testGrid.mapY(y)); } }
                ctx.stroke();
            } 
            else if (q.graphType === 'gradient') {
                testGrid.xMax = 50; testGrid.yMax = 120; testGrid.xLabel = 'Time (s)'; testGrid.yLabel = 'Velocity (m/s)'; testGrid.draw();
                ctx.strokeStyle='#10b981'; ctx.lineWidth=3; ctx.beginPath();
                ctx.moveTo(testGrid.mapX(0), testGrid.mapY(q.c)); ctx.lineTo(testGrid.mapX(50), testGrid.mapY(q.m*50+q.c)); ctx.stroke();
                // Add visible points
                testGrid.drawCross(10, q.m*10+q.c, '#0f172a', 6);
                testGrid.drawCross(40, q.m*40+q.c, '#0f172a', 6);
            }
            else if (q.graphType === 'interp') {
                testGrid.xMax = 60; testGrid.yMax = 100; testGrid.xLabel = 'Time (mins)'; testGrid.yLabel = 'Temperature (°C)'; testGrid.draw();
                // Draw curve points
                ctx.strokeStyle='#f59e0b'; ctx.lineWidth=3; ctx.beginPath();
                for(let x=0; x<=60; x+=10) { 
                    let y=q.fn(x); 
                    testGrid.drawCross(x, y, '#b45309', 5);
                    if(x===0) ctx.moveTo(testGrid.mapX(x), testGrid.mapY(y)); else ctx.lineTo(testGrid.mapX(x), testGrid.mapY(y)); 
                }
                ctx.stroke();
                // Highlight target X
                ctx.strokeStyle='#94a3b8'; ctx.setLineDash([5,5]); ctx.beginPath();
                ctx.moveTo(testGrid.mapX(q.targetX), testGrid.mapY(0)); ctx.lineTo(testGrid.mapX(q.targetX), testGrid.mapY(100)); ctx.stroke(); ctx.setLineDash([]);
                ctx.fillStyle = '#0f172a'; ctx.fillText(`X = ${q.targetX}`, testGrid.mapX(q.targetX), testGrid.mapY(10));
            }
            else if (q.graphType === 'area') {
                testGrid.xMax = 15; testGrid.yMax = 50; testGrid.xLabel = 'Time (s)'; testGrid.yLabel = 'Speed (m/s)'; testGrid.draw();
                ctx.fillStyle='rgba(59,130,246,0.3)'; ctx.beginPath();
                ctx.moveTo(testGrid.mapX(0), testGrid.mapY(0)); ctx.lineTo(testGrid.mapX(q.x), testGrid.mapY(0));
                ctx.lineTo(testGrid.mapX(q.x), testGrid.mapY(q.y2)); ctx.lineTo(testGrid.mapX(0), testGrid.mapY(q.y1)); ctx.fill();
                
                ctx.strokeStyle='#0f172a'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(testGrid.mapX(0), testGrid.mapY(q.y1)); ctx.lineTo(testGrid.mapX(q.x), testGrid.mapY(q.y2)); ctx.stroke();
                
                ctx.strokeStyle='#64748b'; ctx.setLineDash([5,5]); ctx.lineWidth=1; ctx.beginPath();
                ctx.moveTo(testGrid.mapX(q.x), testGrid.mapY(q.y2)); ctx.lineTo(testGrid.mapX(q.x), testGrid.mapY(0)); ctx.stroke(); ctx.setLineDash([]);
                
                ctx.fillStyle='#1e293b'; ctx.font='bold 12px Inter'; ctx.fillText(`(0, ${q.y1})`, testGrid.mapX(0)+15, testGrid.mapY(q.y1)-10);
                ctx.fillText(`(${q.x}, ${q.y2})`, testGrid.mapX(q.x)-15, testGrid.mapY(q.y2)-10);
            }
        }


        // --- App Initialization ---
        function resizeCanvases() {
            document.querySelectorAll('.canvas-container').forEach(container => {
                const canvas = container.querySelector('canvas');
                if(!canvas) return;
                if(canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
                    canvas.width = container.clientWidth; canvas.height = container.clientHeight;
                }
            });
            if(!document.getElementById('module-plotting').classList.contains('hidden')) drawPlottingModule();
            if(!document.getElementById('module-interpreting').classList.contains('hidden')) drawInterpretingModule();
            if(!document.getElementById('module-gradient').classList.contains('hidden')) drawGradientModule();
            if(!document.getElementById('module-area').classList.contains('hidden')) drawAreaModule();
            if(!document.getElementById('module-barchart').classList.contains('hidden')) drawBarChartModule();
            if(!document.getElementById('module-test').classList.contains('hidden') && testState.questions.length > 0) renderTestQuestion();
        }

        window.onload = function() {
            // Event Listeners
            plottingCanvas.addEventListener('mousedown', handlePlotClick); plottingCanvas.addEventListener('touchstart', handlePlotClick);
            plottingCanvas.addEventListener('mousemove', e => {
                if(!variablesConfirmed) return;
                let pos = getPointerPos(e, plottingCanvas), dataX = plottingGrid.unmapX(pos.x), dataY = plottingGrid.unmapY(pos.y);
                const coords = document.getElementById('hover-coords');
                if(dataX>=plottingGrid.xMin && dataX<=plottingGrid.xMax && dataY>=plottingGrid.yMin && dataY<=plottingGrid.yMax) {
                    coords.classList.remove('hidden'); coords.innerText = `X: ${dataX.toFixed(1)} | Y: ${dataY.toFixed(1)}`;
                } else coords.classList.add('hidden');
            });
            
            gradCanvas.addEventListener('mousedown', handleGradClick); gradCanvas.addEventListener('touchstart', handleGradClick);
            gradCanvas.addEventListener('mousemove', handleGradInteraction); gradCanvas.addEventListener('touchmove', handleGradInteraction);
            
            barCanvas.addEventListener('mousedown', handleBarInteraction); window.addEventListener('mouseup', handleBarInteraction);
            barCanvas.addEventListener('mousemove', handleBarInteraction);
            barCanvas.addEventListener('touchstart', handleBarInteraction); window.addEventListener('touchend', handleBarInteraction);
            barCanvas.addEventListener('touchmove', handleBarInteraction);

            window.addEventListener('resize', resizeCanvases);

            changeDataset();
            generateRandomGradientLine();
            generateRandomAreaProblem();
            drawBarChartModule();
            initTestModule(); // Prep test data
            
            resizeCanvases();
            switchTab('module-plotting');
        }

        function exportActiveGraph() {
            let active = ['plotting','interpreting','gradient','area','barchart','test'].find(id => !document.getElementById('module-'+id).classList.contains('hidden'));
            if(active) {
                let a = document.createElement('a'); a.download = `graph-${active}.png`; 
                a.href = document.getElementById('canvas-'+active).toDataURL(); a.click();
            }
        }
    
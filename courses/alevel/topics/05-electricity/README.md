# AQA A-level Electricity Learning Lab

Interactive teaching, simulation, practical and revision app for **AQA A-level Physics 7408 Section 3.5 Electricity**.

## Built from the Further Mechanics app layout

This version deliberately reuses the visual structure and classroom workflow of the existing `furthermechanics` app:
- sticky dark top bar and progress panel
- guided lesson list + main lesson workspace
- interactive simulation laboratory
- formula coach
- required-practical workspace
- mastery quiz
- AQA specification map
- responsive mobile/tablet layout
- local browser progress saving

## AQA 3.5 coverage

### 3.5.1.1 Basics of electricity
- current as rate of flow of charge
- `I = ΔQ/Δt`
- potential difference as work done per unit charge
- `V = W/Q`
- resistance `R = V/I`

### 3.5.1.2 Current–voltage characteristics
- ohmic conductor
- filament lamp
- semiconductor diode
- Ohm's law under constant physical conditions
- ideal ammeter and voltmeter assumptions
- graph interpretation with either I or V on the horizontal axis

### 3.5.1.3 Resistivity
- `ρ = RA/L`
- wire geometry and cross-sectional area
- temperature dependence of metals
- NTC thermistors and temperature sensing
- superconductivity and applications
- **Required Practical 5**: resistivity of a wire

### 3.5.1.4 Circuits
- series and parallel resistance
- cells in series and identical cells in parallel
- conservation of charge and energy
- `E = IVt`
- `P = IV = I²R = V²/R`

### 3.5.1.5 Potential divider
- fixed and variable resistor dividers
- thermistor and LDR sensor arrangements
- output-voltage calculations

### 3.5.1.6 EMF and internal resistance
- emf and terminal p.d.
- lost volts
- `V = ε − Ir`
- `ε = I(R+r)`
- **Required Practical 6**: determine emf and internal resistance from V–I data

## Current feature set

- 11 sequenced teaching lessons
- retrieval starters, objectives and key vocabulary
- mini-textbook explanations
- worked calculations
- student activity spaces
- linked simulation missions
- exam-language guidance and misconception checks
- 6 interactive electricity models
- 14 formula-coach calculations
- RP5 and RP6 virtual data collection
- live practical graphs and linear fitting
- 16 original AQA-style mastery questions
- localStorage progress tracking
- specification coverage map
- installable static-app manifest

## Run locally

Open `index.html` directly, or run:

```bash
npm start
```

The app is static and can be deployed to Vercel, Netlify or another static host.

## Educational note

The simulations are schematic learning models and should be used to support, not replace, real practical work and the equations/experimental conditions required by the AQA specification.

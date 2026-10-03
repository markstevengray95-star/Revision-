import test from 'node:test';
import assert from 'node:assert/strict';
import { offlineMark } from './offlineMarker.ts';
const calculation = {
  subject: 'Physics', commandWord: 'Calculate', maxMarks: 2,
  markScheme: ['[C1] Uses I=Q/t.', '[A1] I=8.0 A.'],
  modelAnswer: 'I=Q/t=4.8/0.60=8.0 A',
};
for (const [answer, marks] of [
  ['I=Q/t=4.8/0.60=8.0 A',2],
  ['Q=It; I=8.0 A',2],
  ['I=Q/t=4.8/0.60=8.0',1],
  ['I=Q/t=7.5 A',1],
  ['',0],
  ['7.5 A',0],
]) test(`GCSE calculation: ${answer || 'blank'}`, () => {
  const result=offlineMark({...calculation,studentAnswer:answer});
  assert.equal(result.marksAwarded,marks);
  assert.equal(result.markingLedger.length,2);
});
test('GCSE conceptual answers retain subject feedback', () => {
  const result=offlineMark({subject:'Biology',commandWord:'State',maxMarks:1,
    markScheme:['The nucleus contains genetic material.'],
    studentAnswer:'The nucleus contains genetic material.'});
  assert.equal(result.marksAwarded,1);
  assert.match(result.inDepthAnalysis.physicsPrinciples,/Biology/);
});

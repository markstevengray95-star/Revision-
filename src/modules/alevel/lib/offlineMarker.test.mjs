import test from 'node:test';
import assert from 'node:assert/strict';
import { offlineMark } from './offlineMarker.ts';

function mark(overrides) {
  return offlineMark({
    questionPrompt: '',
    commandWord: 'Calculate',
    maxMarks: 2,
    markScheme: [],
    modelAnswer: '',
    studentAnswer: '',
    ...overrides,
  });
}

test('awards equation and accurate numerical result with unit', () => {
  const result = mark({
    markScheme: ['[C1] E=hf.', '[A1] 3.98×10⁻¹⁹ J.'],
    studentAnswer: 'E = hf = 6.63e-34 × 6.0e14 = 3.98e-19 J',
  });
  assert.equal(result.marksAwarded, 2);
  assert.equal(result.markingLedger.length, 2);
});

test('recognises equivalent equation rearrangements but rejects wrong final value', () => {
  const result = mark({
    markScheme: ['[C1] Uses I=Q/t.', '[A1] I=8.0 A.'],
    studentAnswer: 'Q = It, therefore I = 7.5 A',
  });
  assert.equal(result.marksAwarded, 1);
  assert.equal(result.markingLedger[0].awarded, true);
  assert.equal(result.markingLedger[1].awarded, false);
});

test('does not award accuracy mark when required unit is missing', () => {
  const result = mark({
    markScheme: ['[C1] Uses I=Q/t.', '[A1] I=8.0 A.'],
    studentAnswer: 'I = Q/t = 4.8/0.60 = 8.0',
  });
  assert.equal(result.marksAwarded, 1);
});

test('correct final numerical result can imply preceding method on ordinary calculation', () => {
  const result = mark({
    markScheme: ['[C1] E=hf.', '[A1] 3.98×10⁻¹⁹ J.'],
    studentAnswer: '3.98e-19 J',
  });
  assert.equal(result.marksAwarded, 2);
  assert.match(result.markingLedger[0].reason, /implicit evidence/i);
});

test('accepts equivalent Kirchhoff wording rather than exact phrase matching', () => {
  const result = mark({
    commandWord: 'State',
    maxMarks: 1,
    markScheme: ['[B1] Current entering equals current leaving.'],
    studentAnswer: 'The total current flowing into a junction equals the total current flowing out.',
  });
  assert.equal(result.marksAwarded, 1);
});

test('rejects an incomplete or opposite conceptual statement', () => {
  const result = mark({
    commandWord: 'State',
    maxMarks: 1,
    markScheme: ['[B1] Frequency remains the same.'],
    studentAnswer: 'The frequency decreases.',
  });
  assert.equal(result.marksAwarded, 0);
});

test('handles unicode scientific notation and plain e notation equivalently', () => {
  const result = mark({
    markScheme: ['[C1] Uses N=Q/e.', '[A1] N=1.56×10¹⁹ electrons.'],
    studentAnswer: 'N = Q/e = 1.56e19 electrons',
  });
  assert.equal(result.marksAwarded, 2);
});

test('level-of-response marking stays conservative offline and requests review', () => {
  const result = mark({
    commandWord: 'Explain',
    questionType: 'Extended 6-mark level-of-response',
    maxMarks: 6,
    requiredKeywords: ['binding energy per nucleon', 'mass defect', 'E=mc²', 'stability'],
    markScheme: [
      '[L3 5-6] Clear binding-energy and mass-defect chain.',
      '[L2 3-4] Partially explained.',
      '[L1 1-2] Relevant fragments.',
    ],
    modelAnswer: 'Products have greater binding energy per nucleon and are more stable. The increase in total binding energy corresponds to a mass defect and energy is released according to E=mc².',
    studentAnswer: 'The products are more stable because they have greater binding energy per nucleon. This means the total binding energy is greater, so there is a mass defect. The lost mass is released as energy using E=mc², therefore energy is released in fission.',
  });
  assert.equal(result.reviewRecommended, true);
  assert.ok(result.examinerConfidence <= 62);
  assert.ok(result.marksAwarded >= 3);
});


test('requires a causal link when the marking point explicitly requires one', () => {
  const result = mark({
    commandWord: 'Explain',
    maxMarks: 1,
    markScheme: ['[B1] Current decreases because resistance increases.'],
    studentAnswer: 'Current decreases. Resistance increases.',
  });
  assert.equal(result.marksAwarded, 0);
  assert.match(result.markingLedger[0].reason, /causal link/i);
});

test('enforces explicitly required significant figures on accuracy marks', () => {
  const result = mark({
    maxMarks: 2,
    markScheme: ['[C1] Uses I=Q/t.', '[A1] I=8.00 A to 3 significant figures.'],
    studentAnswer: 'I = Q/t = 8.0 A',
  });
  assert.equal(result.marksAwarded, 1);
  assert.match(result.markingLedger[1].reason, /significant figures/i);
});

test('does not award an explicitly dependent accuracy mark without the prerequisite method', () => {
  const result = mark({
    maxMarks: 2,
    markScheme: ['[C1] Uses V=IR.', '[A1] 8.0 V dependent on previous method.'],
    studentAnswer: '8.0 V',
  });
  assert.equal(result.marksAwarded, 0);
  assert.equal(result.markingLedger[1].awarded, false);
});

test('supports explicit error-carried-forward when method is valid', () => {
  const result = mark({
    maxMarks: 2,
    markScheme: ['[C1] Uses I=Q/t.', '[A1] 7.5 A; allow ECF using their value.'],
    studentAnswer: 'I = Q/t = 4.2/0.60 = 7.0 A',
  });
  assert.equal(result.marksAwarded, 2);
  assert.match(result.markingLedger[1].reason, /follow-through|error-carried-forward/i);
});


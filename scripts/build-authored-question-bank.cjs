const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..');
const partsDir = path.join(root, 'src', 'modules', 'gcse', 'data', 'authoredBankData');
const outFile = path.join(root, 'src', 'modules', 'gcse', 'data', 'sourceQuestionBank.generated.ts');

const partFiles = fs.readdirSync(partsDir)
  .filter(name => /^bank\.part\d+\.txt$/.test(name))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

if (!partFiles.length) throw new Error('Authored question-bank payload is missing.');

const payload = partFiles.map(name => fs.readFileSync(path.join(partsDir, name), 'utf8').trim()).join('');
const json = zlib.gunzipSync(Buffer.from(payload, 'base64')).toString('utf8');
const questions = JSON.parse(json);

if (!Array.isArray(questions) || questions.length < 100) {
  throw new Error(`Authored question-bank payload looks incomplete (${Array.isArray(questions) ? questions.length : 'invalid'} records).`);
}

for (const question of questions) {
  if (!question.id || !question.prompt || !question.markScheme?.length || !question.modelAnswer) {
    throw new Error(`Incomplete authored question: ${question.id || 'unknown'}`);
  }
}

const counts = Object.fromEntries(['Biology', 'Chemistry', 'Physics'].map(subject => [subject, questions.filter(q => q.subject === subject).length]));
const partialCount = questions.filter(q => q.sourcePartialAnswer && q.sourcePartialMark).length;
const output = `import type { Question } from './questionTypes';\n\nexport const sourceQuestionBank: Question[] = ${JSON.stringify(questions)};\n\nexport const sourceQuestionBankAudit = ${JSON.stringify({ total: questions.length, ...counts, withSourcePartialAnswer: partialCount })};\n`;
fs.writeFileSync(outFile, output, 'utf8');
console.log(`Built authored GCSE question bank: ${questions.length} questions (${counts.Biology} Biology, ${counts.Chemistry} Chemistry, ${counts.Physics} Physics; ${partialCount} source partial answers).`);

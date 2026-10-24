import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

test('all topicMap entries point to existing question files', () => {
  const topicMapFile = path.join(projectRoot, 'src', 'utils', 'topicMap.js');
  const content = fs.readFileSync(topicMapFile, 'utf8');
  const match = content.match(/var topicMap = \{([\s\S]*?)\};/);
  assert.ok(match, 'topicMap object must be defined');

  // Evaluate the topicMap object cleanly
  const entries = new Function('return {' + match[1] + '};')();

  for (const [displayName, target] of Object.entries(entries)) {
    const jsonPath = path.join(
      projectRoot,
      'src',
      'data',
      'questions',
      target.c,
      target.t,
      target.s,
      `${target.s}.json`
    );
    assert.ok(
      fs.existsSync(jsonPath),
      `Missing question file for "${displayName}": expected at ${jsonPath}`
    );
  }
});

test('option shuffle preserves correct answer even with duplicate option texts', () => {
  // Shuffling logic mirror
  function shuffle(question) {
    const options = question.options;
    const correctIndex = question.correctIndex;
    if (!options || options.length <= 1) return question;

    const indexed = options.map((opt, idx) => ({ opt, idx }));
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = indexed[i];
      indexed[i] = indexed[j];
      indexed[j] = temp;
    }
    const newCorrectIndex = indexed.findIndex((item) => item.idx === correctIndex);
    const shuffled = indexed.map((item) => item.opt);
    return { options: shuffled, correctIndex: newCorrectIndex };
  }

  // Question with duplicate texts where the second occurrence is correct
  const question = {
    options: ['Option A', 'Duplicate', 'Duplicate', 'Option D'],
    correctIndex: 2,
  };

  for (let trial = 0; trial < 50; trial++) {
    const res = shuffle(question);
    assert.equal(
      res.options[res.correctIndex],
      'Duplicate',
      'Selected answer must match original option text'
    );
    assert.ok(res.correctIndex >= 0 && res.correctIndex < 4);
  }
});

test('dataLoader image glob pattern includes jpg without typos', () => {
  const dataLoaderFile = path.join(projectRoot, 'src', 'utils', 'dataLoader.js');
  const content = fs.readFileSync(dataLoaderFile, 'utf8');
  assert.ok(!content.includes('j.eg'), 'Must not contain j.eg typo');
  assert.ok(content.includes('jpg'), 'Must include jpg in image glob');
});

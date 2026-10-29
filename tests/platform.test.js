import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('mettlQuestions.json contains valid questions across Aptitude, Logical, and Verbal without screenshots', () => {
  const filePath = path.resolve('src/data/mettlQuestions.json');
  assert.ok(fs.existsSync(filePath), 'mettlQuestions.json should exist');

  const raw = fs.readFileSync(filePath, 'utf-8');
  const questions = JSON.parse(raw);

  assert.ok(questions.length >= 500, `Should contain at least 500 questions, got ${questions.length}`);

  const sectionsFound = new Set();
  const topicsFound = new Set();

  questions.forEach((q, idx) => {
    assert.ok(q.question && q.question.trim().length > 0, `Q${idx + 1} must have a question`);
    assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Q${idx + 1} must have at least 2 options`);
    assert.ok(
      typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length,
      `Q${idx + 1} correctIndex ${q.correctIndex} must be within options range (len: ${q.options.length})`
    );
    assert.ok(q.explanation && q.explanation.trim().length > 0, `Q${idx + 1} should have explanation`);

    if (q.explanationImage) {
      assert.ok(
        typeof q.explanationImage === 'string' && q.explanationImage.startsWith('/images/platform/'),
        `Q${idx + 1} explanationImage must be a local /images/platform/ path, got ${q.explanationImage}`
      );
      const localExpPath = path.resolve('public' + q.explanationImage);
      assert.ok(fs.existsSync(localExpPath), `Explanation image file must physically exist at ${localExpPath}`);
    }

    if (Array.isArray(q.explanationImages)) {
      q.explanationImages.forEach((img) => {
        assert.ok(img.startsWith('/images/platform/'), `explanationImages item must start with /images/platform/, got ${img}`);
        const p = path.resolve('public' + img);
        assert.ok(fs.existsSync(p), `Explanation image file must physically exist at ${p}`);
      });
    }

    if (q.questionImage) {
      assert.ok(
        typeof q.questionImage === 'string' && (q.questionImage.startsWith('/images/platform/') || q.questionImage.startsWith('http')),
        `Q${idx + 1} diagram URL must be valid local path or URL`
      );
      if (q.questionImage.startsWith('/images/platform/')) {
        const localImgPath = path.resolve('public' + q.questionImage);
        assert.ok(fs.existsSync(localImgPath), `Image file must physically exist at ${localImgPath}`);
      }
    }

    if (q.section) sectionsFound.add(q.section);
    if (q.topic) topicsFound.add(q.topic);
  });

  assert.ok(sectionsFound.has('Aptitude'), 'Must include Aptitude section');
  assert.ok(sectionsFound.has('Logical'), 'Must include Logical section');
  assert.ok(sectionsFound.has('Verbal'), 'Must include Verbal section');
  assert.ok(topicsFound.size >= 25, `Should have at least 25 topics, got ${topicsFound.size}`);
});

test('Platform Mercer | Mettl card does not show coding section and uses Aptitude, Logical, Verbal', () => {
  const platformJsx = fs.readFileSync(path.resolve('src/pages/Platform.jsx'), 'utf-8');
  assert.ok(!platformJsx.includes("id: 'mercer-mettl',\n    name: 'Mercer | Mettl',\n    monogram: 'MM',\n    category: 'Assessment Suite',\n    sections: 'Aptitude · Coding · Psychometric'"), 'Mercer Mettl should not list Coding');
  assert.ok(platformJsx.includes("sections: 'Aptitude · Logical · Verbal'"), 'Mercer Mettl sections should be Aptitude · Logical · Verbal');
});

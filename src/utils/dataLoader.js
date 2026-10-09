/*
============================================================
AptiPrep Data Loader
============================================================

Automatically discovers all question JSON files under
src/data/questions/.

Vite import.meta.glob is used so you do NOT have to
manually import every subtopic file.

Image files (png, jpg, svg, etc.) are also discovered
via import.meta.glob so Vite resolves their URLs through
the asset pipeline — works in both dev and production.
============================================================
*/

const questionModules = import.meta.glob(
  '../data/questions/**/*.json',
  {
    eager: true,
    import: 'default'
  }
);

/* Discover all image files in the questions directory.
   import: 'default' gives us the resolved URL string
   for each image (e.g. "/src/data/.../img.png" in dev,
   "/assets/img-xxxx.png" in production build). */
const imageModules = import.meta.glob(
  '../data/questions/**/*.{png,j.eg,jpeg,gif,svg,webp}',
  {
    eager: true,
    import: 'default'
  }
);

/**
 * Resolve a relative image path to a browser-loadable URL.
 *
 * 1. null / undefined → null
 * 2. Already absolute (/  or http/https) → pass through
 * 3. Relative path → look up in imageModules (Vite asset pipeline)
 * 4. Not found in glob → fall back to /images/questions/... public path
 */
function resolveImagePath(imagePath, moduleDir) {
  if (!imagePath) return null;

  /* Already absolute or external — use as-is */
  if (
    imagePath.startsWith('/') ||
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://')
  ) {
    return imagePath;
  }

  /* Try Vite asset pipeline first (images bundled in src/) */
  var fullModulePath = moduleDir + imagePath;
  if (imageModules[fullModulePath]) {
    return imageModules[fullModulePath];
  }

  /* Fallback: construct public path (if images were placed in public/) */
  /* moduleDir: ../data/questions/categoryId/topicId/subtopicId/ */
  /* → /images/questions/categoryId/topicId/subtopicId/            */
  var pathMatch = moduleDir.match(/\.\.\/data\/questions\/(.+)/);
  if (pathMatch) {
    return '/images/questions/' + pathMatch[1] + imagePath;
  }

  /* Could not resolve */
  return null;
}

/**
 * Given a Vite module path like:
 *   ../data/questions/logical_reasoning/deductive_reasoning/venn_diagrams/venn_diagrams.json
 * Extract the directory:
 *   ../data/questions/logical_reasoning/deductive_reasoning/venn_diagrams/
 */
function getModuleDir(modulePath) {
  var match = modulePath.match(/^(.+\/)[^/]+\.json$/);
  return match ? match[1] : null;
}

/**
 * Resolve questionImage and explanationImage for every
 * question in a set.
 */
function resolveQuestionImages(questions, modulePath) {
  var moduleDir = getModuleDir(modulePath);
  if (!moduleDir) return questions;

  return questions.map(function (q) {
    return {
      ...q,
      questionImage: resolveImagePath(q.questionImage, moduleDir),
      explanationImage: resolveImagePath(q.explanationImage, moduleDir),
    };
  });
}

export function getAllQuestionSets() {
  return Object.entries(questionModules).map(function (entry) {
    var path = entry[0];
    var mod = entry[1];
    if (mod && mod.questions) {
      return {
        ...mod,
        questions: resolveQuestionImages(mod.questions, path),
      };
    }
    return mod;
  });
}

export function getQuestionsFromAllSets() {
  return getAllQuestionSets().flatMap(
    (set) => set.questions || []
  );
}

export function getQuestionSet(
  categoryId,
  topicId,
  subtopicId
) {
  var path =
    `../data/questions/${categoryId}/${topicId}/${subtopicId}/${subtopicId}.json`;

  var data = questionModules[path] || null;

  if (data && data.questions) {
    return {
      ...data,
      questions: resolveQuestionImages(data.questions, path),
    };
  }

  return data;
}
# AptiPrep Data

## Structure

Each subtopic has its own JSON file.

Example:

questions/
└── logical_reasoning/
    └── alphanumeric_logic/
        └── coding_decoding/
            ├── coding_decoding.json
            ├── question/
            └── explanation/

Each JSON file contains all questions for that subtopic.

The `question` and `explanation` folders are used for
image-based questions and handwritten solutions.

Images are optional.

Example:

question/1.jpg
explanation/1.jpg

The number corresponds to the question number inside
that subtopic JSON file.

## Important

Do not put company/exam information inside question JSON files.

Company and exam relationships are maintained separately
using:

- companies.json
- exams.json
- companyQuestions.json

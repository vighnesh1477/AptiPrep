# AptiPrep

AptiPrep is an open-source aptitude practice platform for students preparing for campus placements and recruitment tests.

It brings together aptitude questions, step-by-step solutions, topic-wise practice, and company-specific test preparation in one place.

---

## Features

- **Topic-wise practice**: Questions covering Quantitative Aptitude, Logical Reasoning, Data Interpretation, and Verbal Ability.
- **Step-by-step solutions**: Explanations that show how to solve a question instead of just giving the answer.
- **Timed tests**: Practice with a countdown timer, question navigation, and answer review.
- **Company-specific practice**: Question sets organized around different recruitment patterns.
- **Test results**: Review your answers, accuracy, time taken, and overall performance.
- **Randomized options**: Answer choices are shuffled between attempts so you cannot rely on remembering option positions.
- **Keyboard shortcuts**: Press `Ctrl + K` or `⌘ + K` to find topics quickly.
- **Dark and light themes**: Switch themes according to your preference.

---

## Topics

AptiPrep covers four main areas.

| Category | Topics include |
| :--- | :--- |
| **Quantitative Aptitude** | Percentages, Profit and Loss, Ratios, Averages, Time and Work, Probability, Permutations and Combinations, and Number System |
| **Logical Reasoning** | Number Series, Coding and Decoding, Blood Relations, Seating Arrangements, Syllogisms, and Puzzles |
| **Data Interpretation** | Tables, Bar Charts, Pie Charts, Line Graphs, and Caselets |
| **Verbal Ability** | Reading Comprehension, Spotting Errors, Sentence Correction, Para Jumbles, and Vocabulary |

The topic list is organized into smaller subtopics so you can practise specific question types.

---

## Company-specific practice

The company section groups practice material by recruitment type.

- **IT Services**: Cogitate, Arctic Wolf, MPHASIS, ITC Infotech, Sasken, and others.
- **Analytics and Fintech**: Mu Sigma, Finzly, ABSYZ, Info Edge, Accorian, and others.
- **Core Engineering**: Toyota Industries, Delphi TVS, CoreEL, HL Mando Anand, Larsen & Toubro, and others.
- **Other recruitment tracks**: Innodata India, TVS Credit, Dr. Reddy's, Codeyoung, and others.

The available questions and topics may vary between companies.

---

## Tech stack

AptiPrep uses the following technologies:

- **React 19** for the frontend.
- **Vite 8** for development and builds.
- **Tailwind CSS v4** and custom CSS for styling.
- **Motion** for animations.
- **Lucide React** for icons.
- **Oxlint** for linting.

---

## Run locally

You will need Node.js 18 or later and npm.

### 1. Clone the repository

```bash
git clone https://github.com/vighnesh1477/AptiPrep.git
cd AptiPrep
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal. By default, Vite commonly uses `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

---

## Project structure

Here are the main folders and files in the project.

```text
AptiPrep/
├── public/                 # Logo and static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── data/
│   │   ├── questions/      # Question sets organized by topic
│   │   ├── companies.json  # Company information
│   │   ├── exams.json      # Exam categories
│   │   ├── topics.json     # Topic and subtopic data
│   │   └── quotes.json     # Quotes used in the app
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Topics.jsx
│   │   ├── Practice.jsx
│   │   ├── Test-Quiz.jsx
│   │   ├── Results.jsx
│   │   ├── About.jsx
│   │   └── Contributors.jsx
│   ├── styles/             # CSS files
│   ├── utils/              # Helper functions
│   ├── App.jsx             # Routing and app context
│   └── main.jsx            # Application entry point
├── package.json
└── vite.config.js
```

---

## Adding questions

Question files are stored under:

```text
src/data/questions/<category>/<topic>/<subtopic>/
```

Each question contains its question text, answer choices, correct answer index, difficulty, and explanation.

### Example:

```json
[
  {
    "id": "1",
    "question": "What is 10 + 5?",
    "options": [
      "10",
      "15",
      "20",
      "25"
    ],
    "correctIndex": 1,
    "difficulty": "Easy",
    "explanation": "10 + 5 = 15. Therefore, the answer is 15."
  }
]
```

This is a simplified example of the question format. Follow the existing files and data structure when adding questions to the project.

> **A note about explanations**: Always write the final answer in the explanation itself. Do not refer only to an option letter, because the answer choices can be shuffled during a test.

---

## Contributing

Contributions are welcome, especially new questions, corrections to existing solutions, and improvements to the application.

To contribute:

1. Fork the [AptiPrep repository](https://github.com/vighnesh1477/AptiPrep).
2. Create a branch for your changes.
3. Make your changes and test them locally.
4. Commit and push your changes.
5. Open a pull request describing what you changed.

You can also report bugs or suggest improvements through [GitHub Issues](https://github.com/vighnesh1477/AptiPrep/issues).

---

## Team

AptiPrep is maintained and developed by:

- **Deepak Poojary** — Content Maintainer and Admin; Aptitude Trainer at MITE, Moodabidre.
- **Vighnesh Poojary** — Developer; ISE, MITE.
- **Abhishek S Poojary** — Developer; ISE, MITE.

Thanks to everyone who has helped add, format, and verify questions for the platform. Visit the Contributors page in the application to learn more about the community.

---

## License

AptiPrep is available under the [MIT License](LICENSE).

You are welcome to use, modify, and contribute to the project under the terms of the license.

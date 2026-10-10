# 🚀 AptiPrep

<p align="center">
  <img src="public/logo.png" alt="AptiPrep Logo" width="100" />
</p>

<h3 align="center">Understanding. Not Memorization.</h3>

<p align="center">
  A modern, open-source aptitude preparation platform engineered to help students and job seekers master competitive exams, campus placements, and technical interviews through deep conceptual understanding.
</p>

<p align="center">
  <a href="https://github.com/vighnesh1477/AptiPrep/stargazers"><img src="https://img.shields.io/github/stars/vighnesh1477/AptiPrep?style=for-the-badge&color=blue" alt="Stars" /></a>
  <a href="https://github.com/vighnesh1477/AptiPrep/network/members"><img src="https://img.shields.io/github/forks/vighnesh1477/AptiPrep?style=for-the-badge&color=blueviolet" alt="Forks" /></a>
  <a href="https://github.com/vighnesh1477/AptiPrep/issues"><img src="https://img.shields.io/github/issues/vighnesh1477/AptiPrep?style=for-the-badge&color=success" alt="Issues" /></a>
  <a href="https://github.com/vighnesh1477/AptiPrep/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License" /></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

---

## 📌 Table of Contents

- [Vision & Philosophy](#-vision--philosophy)
- [Key Features](#-key-features)
- [Comprehensive Syllabus](#-comprehensive-syllabus)
- [Company-Specific Practice Tracks](#-company-specific-practice-tracks)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Data Structure & Adding Questions](#-data-structure--adding-questions)
- [Core Team & Contributors](#-core-team--contributors)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Vision & Philosophy

Most commercial aptitude platforms focus on rote memorization of formula shortcuts and surface-level trickery. When test patterns change slightly, candidates struggle.

**AptiPrep** was created to change that:
- **First-Principles Thinking**: Learn *why* a solution works through clean mathematical derivations and logical frameworks.
- **Dynamic Option Randomization**: Shuffles multiple-choice options on every attempt to ensure genuine problem-solving rather than remembering letter positions (A, B, C, D).
- **Free & Open Source**: Democratizing access to high-quality placement material for all engineering and college graduates.

---

## ✨ Key Features

- 📚 **Extensive Topic Catalog**: Thousands of carefully curated questions across Quantitative Aptitude, Logical Reasoning, Data Interpretation, and Verbal Ability.
- ⏱️ **Timed Mock Assessments**: Real-time quiz runner featuring active countdown timers, question navigation palette, instant answer submission, and flagging.
- 🏢 **Company-Specific Test Tracks**: Tailored practice tests simulating actual recruitment patterns for top IT services, product analytics, and core engineering firms.
- 🔍 **Detailed Step-by-Step Solutions**: Clear, clutter-free explanations with explicit formulas, substitution steps, and final deductions.
- 📈 **Performance Analytics & Tier Badges**: Post-test review with accuracy calculations, time analytics, question-by-question review, and performance achievement tiers (*Outstanding*, *Excellent*, *Good Job*, etc.).
- ⌨️ **Keyboard-First Shortcuts**: Press <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>⌘</kbd> + <kbd>K</kbd> anywhere on the site for instant topic discovery and navigation.
- 🌗 **Adaptive Dark & Light Mode**: Built-in sleek theme toggle with system preference detection and persistent user preferences.
- 🎨 **Fluid Modern Interface**: Crafted with responsive glassmorphic cards, rolling digit animations, and micro-interactions.

---

## 📖 Comprehensive Syllabus

AptiPrep is organized into 4 primary modules covering all placement and competitive exam domains:

| Module | Core Topics Covered |
| :--- | :--- |
| **Quantitative Aptitude** | Number System (Divisibility, HCF/LCM, Remainder Theorems), Percentages, Profit & Loss, Simple & Compound Interest, Averages, Ratios & Proportions, Mixtures & Alligations, Time & Work, Pipes & Cisterns, Time-Speed-Distance, Trains, Boats & Streams, Permutations & Combinations, Probability, Geometry & Mensuration, Progressions (AP/GP/HP), Clocks & Calendars |
| **Logical Reasoning** | Number & Letter Series, Coding-Decoding, Odd One Out, Blood Relations, Direction Sense, Linear & Circular Seating Arrangements, Matrix Puzzles, Syllogisms, Venn Diagrams, Cubes & Dice, Critical Reasoning, Cause & Effect, Data Sufficiency |
| **Data Interpretation** | Tables & Matrices, Bar Charts & Histograms, Pie Charts, Line Graphs, Radar & Web Charts, Mixed/Combo Charts, Caselets (Paragraph-based data) |
| **Verbal Ability** | Spotting Errors, Sentence Correction, Active/Passive Voice, Direct/Indirect Speech, Synonyms & Antonyms, Fill in the Blanks, Cloze Tests, Idioms & Phrases, Reading Comprehension, Para Jumbles, Theme Detection |

---

## 🏢 Company-Specific Practice Tracks

Prepare with curated question sets grouped by corporate testing profiles:

- **Group A — IT Service Platforms**: Tech & MCA hiring patterns (*Cogitate, Arctic Wolf, MPHASIS, ITC Infotech, Dextris, Sasken, etc.*).
- **Group B — Analytics & Fintech**: High-end analytical and problem-solving focus (*Mu-Sigma, Finzly, ABSYZ, Info Edge, Accorian, etc.*).
- **Group C — Core Engineering**: Heavy emphasis on spatial logic, ratio-proportions, and technical aptitude (*Toyota Industries, Delphi TVS, CoreEL, HL Mando Anand, Larsen & Toubro, etc.*).
- **Group D — Non-Tech Allied**: General business aptitude and comprehensive reasoning (*Innodata India, TVS Credit, Dr. Reddy's, Codeyoung, etc.*).

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Custom CSS Design System
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 📂 Project Architecture

```text
AptiPrep/
├── public/                 # Static assets, branding, contributor portraits
├── src/
│   ├── components/         # Reusable UI elements (Navbar, Footer, Splash, ThemeToggle)
│   ├── data/               # Structured questions database & topic registries
│   │   ├── questions/      # Modular JSON question sets split by topic & subtopic
│   │   ├── companies.json  # Company master list
│   │   ├── exams.json      # Exam taxonomy
│   │   ├── topics.json     # Hierarchical taxonomy (Categories -> Topics -> Subtopics)
│   │   └── quotes.json     # Motivational quote dataset
│   ├── pages/              # Application views
│   │   ├── Home.jsx        # Landing hero, feature overview, statistics
│   │   ├── Topics.jsx      # Topic selector & question browser
│   │   ├── Practice.jsx    # Company category tracks & recruitment groups
│   │   ├── Test-Quiz.jsx   # Interactive test runner & timer engine
│   │   ├── Results.jsx     # Post-quiz analytics & answer breakdown
│   │   ├── About.jsx       # Mission statement & team information
│   │   └── Contributors.jsx# Hall of contributors & verified question stats
│   ├── styles/             # Modular CSS stylesheets
│   ├── utils/              # Data querying, local storage, shuffling algorithms
│   ├── App.jsx             # Hash routing, global context & theme provider
│   └── main.jsx            # Application entrypoint
├── package.json
└── vite.config.js
```

---

## ⚡ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (version 18 or later) installed on your system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vighnesh1477/AptiPrep.git
   cd AptiPrep
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to explore AptiPrep.

### Production Build

To compile and bundle the application for production:
```bash
npm run build
```
You can preview the production bundle locally with:
```bash
npm run preview
```

---

## 📝 Data Structure & Adding Questions

Each subtopic is self-contained in its own JSON file under `src/data/questions/<category>/<topic>/<subtopic>/`.

### Question Schema Example:

```json
[
  {
    "id": "1",
    "question": "A train passes a station platform in 36 seconds and a man standing on the platform in 20 seconds. If the speed of the train is 54 km/hr, what is the length of the platform?",
    "options": [
      "120 m",
      "240 m",
      "300 m",
      "200 m"
    ],
    "correctIndex": 1,
    "difficulty": "Medium",
    "explanation": "Speed = 54 × (5/18) = 15 m/sec.\nLength of the train = Speed × Time to pass man = 15 × 20 = 300 m.\nLet length of platform be P.\nTotal distance = 300 + P = 15 × 36 = 540 m.\nP = 540 - 300 = 240 m.\nTherefore, the correct answer is 240 m."
  }
]
```

> **Note on explanations**: Always state the exact final answer value in the explanation rather than option letters (like "Option B"), as options are dynamically shuffled during quizzes.

---

## 👥 Core Team & Leadership

| Role | Name | Organization / Background |
| :--- | :--- | :--- |
| **Content Maintainer & Admin** | **Mr. Deepak Poojary** | Aptitude Trainer (Quantitative & Logical Reasoning), MITE Moodabidre |
| **Developer** | **Vighnesh Poojary** | ISE, MITE — AI, Security & Open Source |
| **Developer** | **Abhishek S Poojary** | MITE — Full Stack Web Development & Data Collection |

### 🌟 Community Contributors
Special thanks to all student contributors who have verified, formatted, and contributed thousands of problems to make AptiPrep comprehensive and accurate. Visit the **[Community Page](https://github.com/vighnesh1477/AptiPrep)** inside the application to see full contributor stats!

---

## 🤝 Contributing

Contributions of all kinds are welcome! You can help by:
1. Adding new questions and step-by-step solutions to existing subtopics.
2. Expanding company question banks and topic mappings.
3. Reporting bugs or submitting UI/UX improvements.

### Contribution Steps:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AddTopicQuestions`).
3. Commit your changes (`git commit -m "Add: 50 new Probability questions with step-by-step explanations"`).
4. Push to the branch (`git push origin feature/AddTopicQuestions`).
5. Open a **Pull Request**.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with ❤️ for students everywhere. If you found AptiPrep helpful, please consider giving it a ⭐ on GitHub!
</p>

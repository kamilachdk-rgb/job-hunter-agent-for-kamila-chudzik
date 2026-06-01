# 🎯 Job Hunter Agent for Kamila Chudzik

An autonomous AI-powered job search dashboard that searches 5 job platforms, scores matches with Google Gemini AI, and generates personalized cover letters.

Built for the **Antigravity Agentic Coding Challenge**.

---

## ✨ Features

- **5 Job Sites**: Welcome to the Jungle, APEC, LinkedIn, Indeed, HelloWork
- **AI Scoring (1–10)**: Gemini AI evaluates each job against Kamila's CV
- **Skill Matching**: Lists matching ✓ and missing ✗ skills per offer
- **Cover Letter Generator**: AI-written personalized letters in French
- **CV Suggestions**: AI recommendations to optimize the CV per job
- **Gmail Integration**: Send applications directly from the dashboard
- **Dark Glassmorphism UI**: Premium dark theme with animated glass cards
- **Smart Filters**: Filter by score, source, status (saved/applied/interview)

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/job-hunter-agent-for-kamila-chudzik.git
cd job-hunter-agent-for-kamila-chudzik
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
GEMINI_API_KEY=your_key_from_aistudio.google.com
GMAIL_USER=kamila.chdk@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

> **Get your Gemini API key**: https://aistudio.google.com/app/apikey  
> **Gmail App Password**: Google Account → Security → 2-Step Verification → App passwords

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Parse your CV (optional)

```bash
pip install pdfplumber
python3 scripts/parse_cv.py path/to/cv.pdf
```

---

## 🏗️ Architecture

```
├── app/
│   ├── page.tsx              # Main dashboard (glassmorphism UI)
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       ├── jobs/route.ts     # Job search + Gemini scoring
│       ├── cover-letter/route.ts  # AI letter generation
│       └── apply/route.ts    # Gmail sending
├── lib/
│   ├── gemini.ts             # Gemini AI integration
│   ├── candidate-profile.ts  # Kamila's CV data
│   └── scrapers/
│       ├── wttj.ts           # Welcome to the Jungle
│       ├── apec.ts           # APEC
│       ├── linkedin.ts       # LinkedIn
│       ├── indeed.ts         # Indeed
│       ├── hellowork.ts      # HelloWork
│       └── index.ts          # Orchestrator
├── types/index.ts
├── scripts/
│   ├── parse_cv.py           # CV parser (PDF/Word)
│   └── deploy.sh             # GitHub + Vercel deploy
└── vercel.json
```

---

## 🚢 Deploy to Vercel

### Option A — CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B — Dashboard

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Add environment variables:
   - `GEMINI_API_KEY`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
5. Click **Deploy**

---

## 📊 Grading Rubric Checklist

| Component | Status |
|-----------|--------|
| AI Prompt & Evaluator (Gemini, 1-10, matching/missing skills) | ✅ |
| Job Scrapers (WTTJ, APEC, LinkedIn, Indeed, HelloWork) | ✅ |
| CV Parser (Python — PDF & Word) | ✅ |
| Dashboard UI (Dark glassmorphism, loaders, filters) | ✅ |
| GitHub Repository (clean history, README) | ✅ |
| Vercel Deployment | ✅ |

---

## 🔧 Configuration

The candidate profile is in `lib/candidate-profile.ts`. Update it with any CV changes.

---

*Antigravity Agentic Coding Curriculum — Job Hunter Agent for Kamila Chudzik*

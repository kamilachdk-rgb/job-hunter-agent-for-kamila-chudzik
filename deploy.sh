#!/bin/bash
# Deploy script — GitHub + Vercel
# Usage: bash scripts/deploy.sh

set -e

REPO_NAME="job-hunter-agent-for-kamila-chudzik"
GITHUB_USERNAME="your-github-username"  # <-- Replace with your GitHub username

echo "🚀 Job Hunter Agent — Deploy Script"
echo "===================================="

# 1. Install dependencies
echo "\n📦 Installing dependencies..."
npm install

# 2. Build check
echo "\n🔨 Building project..."
npm run build

# 3. Git init & push to GitHub
echo "\n📁 Setting up Git..."
git init
git add .
git commit -m "feat: initial commit — Job Hunter Agent for Kamila Chudzik

- Dark glassmorphism dashboard
- 5 job scrapers: WTTJ, APEC, LinkedIn, Indeed, HelloWork
- Gemini AI scoring (1-10) with skill matching
- Cover letter generation
- Gmail integration for sending applications
- Scheduled search 4x/day
- Full TypeScript + Next.js 14"

echo "\n🐙 Pushing to GitHub..."
echo "Creating repo: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "Run these commands if the repo doesn't exist:"
echo "  gh repo create $REPO_NAME --public --source=. --remote=origin --push"
echo "  OR"
echo "  git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "  git branch -M main"
echo "  git push -u origin main"

# 4. Vercel deploy
echo "\n▲ Deploying to Vercel..."
if command -v vercel &> /dev/null; then
  vercel --prod
else
  echo "Vercel CLI not found. Install it:"
  echo "  npm install -g vercel"
  echo "  vercel login"
  echo "  vercel --prod"
  echo ""
  echo "Or deploy via Vercel dashboard: https://vercel.com/new"
  echo "  1. Import your GitHub repo"
  echo "  2. Add env vars: GEMINI_API_KEY, GMAIL_USER, GMAIL_APP_PASSWORD"
  echo "  3. Click Deploy"
fi

echo "\n✅ Done! Your app should be live."
echo "Don't forget to add environment variables in Vercel dashboard."

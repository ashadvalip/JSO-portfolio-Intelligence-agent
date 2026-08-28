# GitHub Portfolio Intelligence Agent

[![CI](https://github.com/ashadvalip/JSO-portfolio-Intelligence-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/ashadvalip/JSO-portfolio-Intelligence-agent/actions)

An AI-assisted web application that analyzes a developer's GitHub portfolio and produces a structured technical evaluation.

## What it evaluates

The application can analyze repository structure, documentation, commits, and project composition to produce portfolio-level insights such as:

- Overall portfolio score.
- Technical strengths.
- Improvement areas.
- Skill recommendations.
- Suggested career directions.
- Repository-level complexity estimates.

## Architecture

```text
GitHub profile / repositories
          │
          ▼
      Backend API
          │
     ┌────┴────┐
     ▼         ▼
 GitHub API  Gemini API
     │         │
     └────┬────┘
          ▼
   Structured analysis
          │
          ▼
        Frontend
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| AI | Google Gemini (`@google/genai`) |
| Data source | GitHub API |
| CI | GitHub Actions |

## Repository structure

```text
.
├── backend/          # API server and portfolio analysis logic
├── frontend/         # React user interface
├── next-frontend/    # Alternate frontend implementation
├── .github/          # CI configuration
└── README.md
```

## Local setup

### Prerequisites

- Node.js 18+
- Google Gemini API key
- Optional GitHub personal access token for higher API limits

### Backend

```bash
cd backend
npm install
```

Create the backend environment file with values appropriate to your local setup:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token
```

Start the backend using the scripts defined in `backend/package.json`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite development server normally runs on port 5173.

## Security

Never commit API keys or access tokens. Store them in local environment files or deployment secrets and keep those files excluded by `.gitignore`.

## Development roadmap

A mature version should add stronger repository sampling, deterministic scoring criteria, evaluation datasets, caching/rate-limit handling, structured provenance for AI findings, and regression tests for scoring consistency.

## Status

Active application project.

## License

No license is currently specified.

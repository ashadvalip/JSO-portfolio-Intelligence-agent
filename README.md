# GitHub Portfolio Intelligence Agent

![CI](https://github.com/ashadvalip/JSO-portfolio-Intelligence-agent/actions/workflows/ci.yml/badge.svg)

An AI agent web application that analyzes a developer's GitHub portfolio and generates a comprehensive technical evaluation report.

## Features
- **Frontend**: Built with React & Vite using modern Glassmorphism aesthetics and rich UI.
- **Backend**: NodeJS & Express server handling API requests.
- **AI Analysis**: Uses Google Gemini AI (`@google/genai`) to parse repository structure, READMEs, commits, and returns a structured AI evaluation.
- **Results**: Generates an overall Portfolio Score (0-100), key strengths, areas for improvement, skill recommendations, career paths, and an in-depth repository table with AI-estimated complexity scores.

## Setup Instructions

### Prerequisites
1. Node.js (v18+ recommended)
2. Obtain a **Google Gemini API Key** (from Google AI Studio)
3. *(Optional but recommended)* Obtain a **GitHub Personal Access Token** to avoid GitHub rate limits.

### 1. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory with your details (template provided):
\`\`\`env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_TOKEN=your_github_token_here
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 2. Frontend Setup
Open a new terminal and run:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The application will be running at `http://localhost:5173`.

Enjoy the beautiful AI evaluation experience!

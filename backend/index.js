import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Fetch GitHub API helper
const fetchGitHub = async (url) => {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Intelligence-Agent'
    };
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    const response = await fetch(url, { headers });
    if (!response.ok) {
        if (response.status === 404) return null;
        if (response.status === 403) throw new Error('GitHub API rate limit exceeded. Please configure a GitHub Token.');
        throw new Error(`GitHub API error: ${response.statusText}`);
    }
    return response.json();
};

const extractUsername = (url) => {
    try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/').filter(Boolean);
        return parts[0];
    } catch {
        return url; // fallback, if user submits just username
    }
};

app.post('/analyze-portfolio', async (req, res) => {
    try {
        const { githubUrl } = req.body;
        if (!githubUrl) return res.status(400).json({ error: 'GitHub URL is required' });

        const username = extractUsername(githubUrl);
        if (!username) return res.status(400).json({ error: 'Invalid GitHub URL' });

        console.log(`Analyzing GitHub profile for: ${username}`);

        const user = await fetchGitHub(`https://api.github.com/users/${username}`);
        if (!user) return res.status(404).json({ error: 'GitHub user not found' });

        const repos = await fetchGitHub(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if (!repos) return res.status(404).json({ error: 'Repositories not found' });

        console.log(`Fetched ${repos.length} repositories for ${username}`);

        // Aggregate Data
        let totalStars = 0;
        let totalForks = 0;
        let mainLanguages = new Set();
        
        const topRepos = repos.slice(0, 15).map(repo => {
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;
            if (repo.language) mainLanguages.add(repo.language);

            return {
                name: repo.name,
                description: repo.description,
                stars: repo.stargazers_count,
                language: repo.language || 'Unknown',
                size: repo.size,
                created_at: repo.created_at,
                updated_at: repo.updated_at
            };
        });

        // Try to fetch README for the top 3 most starred repos
        const reposForPrompt = [...topRepos].sort((a,b) => b.stars - a.stars);
        for (let i = 0; i < Math.min(3, reposForPrompt.length); i++) {
            const readmeRes = await fetch(`https://raw.githubusercontent.com/${username}/${reposForPrompt[i].name}/main/README.md`);
            if (readmeRes.ok) {
                const readme = await readmeRes.text();
                reposForPrompt[i].readmeSnippet = readme.substring(0, 500); // Send just a snippet to not blow up context
            }
        }

        const devSummaryStr = `
            GitHub Profile: ${username}
            Public Repositories Fetched: ${repos.length}
            Total Stars: ${totalStars}
            Total Forks: ${totalForks}
            Languages Used: ${Array.from(mainLanguages).join(', ')}

            Top Repositories Info:
            ${JSON.stringify(reposForPrompt, null, 2)}
        `;

        const prompt = `
            You are an AI Technical Portfolio Evaluator working for the JSO Career Intelligence Platform.

            Your job is to evaluate a developer's GitHub portfolio.

            Based on the repository summary provided, evaluate:

            1. Code quality
            2. Project complexity
            3. Technology stack
            4. Documentation quality
            5. Engineering maturity

            Generate the following structured output in strictly valid JSON format without markdown blocks:

            {
                "portfolioScore": 85, // Portfolio Score (0-100)
                "strengths": ["string", "string"], // Strengths
                "weaknesses": ["string", "string"], // Weaknesses
                "detectedSkills": ["string", "string"], // Detected Skills
                "recommendedSkills": ["string", "string"], // Recommended Skills to Learn
                "careerSuggestions": ["string", "string"], // Career Path Suggestions
                "repositorySummaries": [ // For top repositories
                    {
                        "repoName": "repo name",
                        "language": "used language",
                        "stars": 1,
                        "complexityScore": "evaluation"
                    }
                ],
                "outreachEmail": "A ready-to-copy recruiter cold outreach email tailored to the developer's strengths and repository projects." // Cold Outreach Email Template
            }

            Developer Summary:
            ${devSummaryStr}

            Your output must be clear and structured so recruiters can quickly understand the candidate's ability.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                 responseMimeType: 'application/json'
            }
        });
        
        const rawJsonText = response.text;
        const resultJSON = JSON.parse(rawJsonText);
        
        // Add raw github user info to be used by the frontend
        resultJSON.githubProfile = {
            login: user.login,
            avatar_url: user.avatar_url,
            name: user.name,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            public_repos: user.public_repos
        };

        res.json(resultJSON);

    } catch (error) {
        console.error("Error analyzing portfolio:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

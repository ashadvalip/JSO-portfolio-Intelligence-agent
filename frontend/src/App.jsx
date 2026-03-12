import { useState } from 'react';
import './index.css';

function App() {
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze portfolio');
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header>
        <h1 className="logo-text">Portfolio Intelligence</h1>
        <p className="subtitle">AI-Powered Developer Assessment Agent</p>
      </header>

      <div className="glass-panel">
        <form className="search-form" onSubmit={handleAnalyze}>
          <input
            type="text"
            className="github-input"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="Enter GitHub URL or username..."
            disabled={loading}
          />
          <button type="submit" className="analyze-btn" disabled={loading || !githubUrl.trim()}>
            {loading ? <div className="spinner"></div> : 'Analyze'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {data && (
          <div className="results-container glass-panel" style={{ animationDelay: '0.1s' }}>
            <div className="dashboard-grid">
              <div className="score-container">
                <div 
                  className="score-circle" 
                  style={{ '--score-deg': `${(data.portfolioScore / 100) * 360}deg` }}
                >
                  <span className="score-value">{data.portfolioScore}</span>
                </div>
                <h3>Overall Portfolio Score</h3>
                <p className="subtitle" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Based on repo complexity, consistency, and structure.
                </p>
              </div>

              <div className="details-container">
                <h3 className="section-title">✨ Key Strengths</h3>
                <ul className="list-items strengths-list">
                  {data.strengths?.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>

                <h3 className="section-title">⚠️ Areas for Improvement</h3>
                <ul className="list-items weaknesses-list">
                  {data.weaknesses?.map((weak, i) => (
                    <li key={i}>{weak}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h3 className="section-title">💡 Recommended Skills</h3>
              <div className="badges">
                {data.recommendedSkills?.map((skill, i) => (
                  <span className="badge" key={i}>{skill}</span>
                ))}
              </div>

              <h3 className="section-title">🚀 Career Suggestions</h3>
              <ul className="list-items" style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                {data.careerSuggestions?.map((sug, i) => (
                  <li key={i} style={{ paddingLeft: '0.5rem' }}>{sug}</li>
                ))}
              </ul>
            </div>

            {data.repositorySummaries && data.repositorySummaries.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 className="section-title">📊 Top Repositories Analysis</h3>
                <div className="table-container">
                  <table className="repo-table">
                    <thead>
                      <tr>
                        <th>Repository</th>
                        <th>Stars</th>
                        <th>Language</th>
                        <th>Complexity Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.repositorySummaries.map((repo, i) => (
                        <tr key={i}>
                          <td className="repo-name">{repo.repoName || repo.name}</td>
                          <td>⭐ {repo.stars}</td>
                          <td>{repo.language || 'Unknown'}</td>
                          <td>
                            <span className="badge" style={{ margin: 0, background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}>
                              {repo.complexityScore}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

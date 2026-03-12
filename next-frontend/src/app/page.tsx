/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Star, GitBranch, Github, Code, TrendingUp, CheckCircle, AlertTriangle, Briefcase, ChevronRight, Users, BookOpen, Mail } from "lucide-react";
import Image from "next/image";
import axios from "axios";

export default function Home() {
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";
      const response = await axios.post(`${API_BASE_URL}/analyze-portfolio`, {
        githubUrl,
      });
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to analyze portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pattern text-gray-100 flex flex-col items-center py-16 px-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        <header className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6"
          >
            <Github className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            <span className="gradient-text">JSO Portfolio Intelligence</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            AI-powered evaluation of your technical skills, code quality, and engineering maturity directly from your GitHub repositories.
          </p>
        </header>

        <div className="glass-panel p-6 md:p-8 rounded-2xl mb-12">
          <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="https://github.com/username or just username"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !githubUrl.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Portfolio
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* GitHub Profile Card */}
              {data.githubProfile && (
                <div className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                    <img
                      src={data.githubProfile.avatar_url}
                      alt={data.githubProfile.name || "GitHub Avatar"}
                      className="rounded-full border-4 border-white/10 shadow-xl object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {data.githubProfile.name || data.githubProfile.login}
                    </h2>
                    <a
                      href={`https://github.com/${data.githubProfile.login}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:text-purple-300 font-medium text-lg inline-flex items-center gap-2 mb-4 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      @{data.githubProfile.login}
                    </a>
                    {data.githubProfile.bio && (
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                        {data.githubProfile.bio}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span className="font-semibold text-white">{data.githubProfile.followers}</span> Followers
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="font-semibold text-white">{data.githubProfile.following}</span> Following
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-semibold text-white">{data.githubProfile.public_repos}</span> Public Repos
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Score & Skills Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-6">Portfolio Score</h3>
                  <div className="relative">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-gray-800"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#score-gradient)"
                        strokeWidth="12"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * (data.portfolioScore || 0)) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        initial={{ strokeDashoffset: 440 }}
                        animate={{ strokeDashoffset: 440 - (440 * (data.portfolioScore || 0)) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a78bfa" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        {data.portfolioScore}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">out of 100</p>
                </div>

                <div className="md:col-span-2 glass-panel p-8 rounded-2xl flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold">Detected Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {data.detectedSkills?.map((skill: string, idx: number) => (
                      <span key={idx} className="px-4 py-2 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mb-4 mt-8">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-semibold">Recommended to Learn</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {data.recommendedSkills?.map((skill: string, idx: number) => (
                      <span key={idx} className="px-4 py-2 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold">Key Strengths</h3>
                  </div>
                  <ul className="space-y-4">
                    {data.strengths?.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0 opacity-70" />
                        <span className="text-gray-300 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-8 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold">Areas for Improvement</h3>
                  </div>
                  <ul className="space-y-4">
                    {data.weaknesses?.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0 opacity-70" />
                        <span className="text-gray-300 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Career Path */}
              <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-blue-500">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold">Suggested Career Paths</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.careerSuggestions?.map((path: string, idx: number) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3">
                      <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="font-medium text-gray-200">{path}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outreach Email Template */}
              {data.outreachEmail && (
                <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-purple-500">
                  <div className="flex items-center gap-3 mb-6">
                    <Mail className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-semibold">AI Auto-Generated Outreach Email</h3>
                  </div>
                  <div className="relative">
                    <pre className="bg-black/30 border border-white/5 p-6 rounded-xl text-gray-300 font-sans whitespace-pre-wrap leading-relaxed text-sm">
                      {data.outreachEmail}
                    </pre>
                    <button 
                      onClick={() => navigator.clipboard.writeText(data.outreachEmail)}
                      className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-white/10"
                    >
                      Copy Draft
                    </button>
                  </div>
                </div>
              )}

              {/* Repositories */}
              {data.repositorySummaries && data.repositorySummaries.length > 0 && (
                <div className="glass-panel p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                    <GitBranch className="w-6 h-6 text-indigo-400" />
                    Top Repository Insights
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                          <th className="pb-4 font-medium">Repository</th>
                          <th className="pb-4 font-medium">Language</th>
                          <th className="pb-4 font-medium">Stars</th>
                          <th className="pb-4 font-medium">Complexity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {data.repositorySummaries.map((repo: any, idx: number) => (
                          <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 font-medium text-purple-300">{repo.repoName}</td>
                            <td className="py-4 text-gray-300">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/10 bg-white/5">
                                {repo.language}
                              </span>
                            </td>
                            <td className="py-4 text-gray-300 flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              {repo.stars}
                            </td>
                            <td className="py-4">
                              <span className="text-gray-300 bg-white/5 px-3 py-1 rounded-md text-sm border border-white/5">
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
              
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

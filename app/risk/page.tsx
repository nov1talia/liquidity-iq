'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RiskResult {
  overallScore: number;
  factors: { name: string; score: number; status: string; detail: string }[];
  summary: string;
  recommendation: string;
}

export default function RiskPage() {
  const [poolAddress, setPoolAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);

  const analyze = async () => {
    if (!poolAddress) return;
    setLoading(true);
    try {
      const res = await fetch('/api/risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poolAddress }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Risk error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#00c853';
    if (score >= 40) return '#ff9100';
    return '#ff1744';
  };

  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="text-3xl font-bold gradient-text" style={{ fontSize: '36px' }}>Risk Assessment</h1>
        <p style={{ color: '#959597', marginTop: '4px' }}>Evaluate safety scores for Meteora DLMM pools</p>
      </div>

      {/* Input */}
      <div className="card p-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={poolAddress}
            onChange={(e) => setPoolAddress(e.target.value)}
            className="flex-1 input"
            placeholder="Enter pool address (e.g., ...)"
          />
          <button
            onClick={analyze}
            disabled={loading || !poolAddress}
            className="btn-primary"
          >
            {loading ? 'Analyzing...' : 'Assess Risk'}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="card p-8 text-center">
            <h2 style={{ fontSize: '22px', color: '#e4020d', marginBottom: '16px' }}>Overall Safety Score</h2>
            <div className="relative inline-block">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#28282c" strokeWidth="12" />
                <circle
                  cx="80" cy="80" r="70" fill="none"
                  stroke={getScoreColor(result.overallScore)}
                  strokeWidth="12"
                  strokeDasharray={`${(result.overallScore / 100) * 440} 440`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold" style={{ color: getScoreColor(result.overallScore) }}>
                  {result.overallScore}
                </span>
              </div>
            </div>
            <p style={{ color: '#959597', marginTop: '16px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>{result.summary}</p>
          </div>

          {/* Factor Chart */}
          <div className="card p-6">
            <h2 style={{ fontSize: '22px', color: '#e4020d', marginBottom: '16px' }}>Risk Factors</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={result.factors} layout="vertical">
                <XAxis type="number" domain={[0, 100]} stroke="#959597" />
                <YAxis type="category" dataKey="name" stroke="#959597" width={120} style={{ fontSize: '16px' }} />
                <Tooltip
                  contentStyle={{
                    background: '#141416',
                    border: '1px solid #28282c',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {result.factors.map((entry, idx) => (
                    <Cell key={idx} fill={getScoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Factor Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.factors.map((factor, i) => (
              <div key={i} className="card p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 style={{ color: '#ffffff', fontSize: '20px' }}>{factor.name}</h3>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getScoreColor(factor.score) + '15',
                      color: getScoreColor(factor.score),
                      borderColor: getScoreColor(factor.score) + '44',
                    }}
                  >
                    {factor.status}
                  </span>
                </div>
                <p style={{ color: '#959597' }}>{factor.detail}</p>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div
            className="card p-6"
            style={{ borderColor: 'rgba(228, 2, 13, 0.3)', background: 'rgba(228, 2, 13, 0.04)' }}
          >
            <h2 style={{ fontSize: '22px', color: '#e4020d', marginBottom: '8px' }}>💡 AI Recommendation</h2>
            <p style={{ color: '#ffffff' }}>{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

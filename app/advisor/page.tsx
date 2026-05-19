'use client';

import { useState } from 'react';

interface PoolRecommendation {
  name: string;
  score: number;
  apy: string;
  tvl: string;
  risk: string;
  reason: string;
}

export default function AdvisorPage() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PoolRecommendation[]>([]);
  const [budget, setBudget] = useState('1000');
  const [riskLevel, setRiskLevel] = useState('moderate');
  const [error, setError] = useState('');

  const analyzePools = async () => {
    setLoading(true);
    setError('');
    setRecommendations([]);
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: parseFloat(budget), riskLevel }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      const recs = data.recommendations;
      if (!Array.isArray(recs)) {
        setError('Unexpected response format from AI. Please try again.');
        return;
      }

      const safeRecs: PoolRecommendation[] = recs.map((r: any) => ({
        name: r.name || 'Unknown Pool',
        score: typeof r.score === 'number' ? r.score : 0,
        apy: r.apy || '—',
        tvl: r.tvl || '—',
        risk: r.risk || 'Unknown',
        reason: r.reason || 'No analysis available.',
      }));

      setRecommendations(safeRecs);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    }
    setLoading(false);
  };

  const getRiskColor = (risk: string) => {
    const r = (risk || '').toLowerCase();
    if (r === 'low') return '#00c853';
    if (r === 'medium') return '#ff9100';
    return '#ff1744';
  };

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text" style={{ fontSize: '36px' }}>AI Pool Advisor</h1>
        <p style={{ color: '#959597', marginTop: '4px' }}>Get AI-powered recommendations for optimal DLMM pool selection</p>
      </div>

      {/* Config */}
      <div className="card p-6">
        <h2 style={{ fontSize: '22px', color: '#e4020d', marginBottom: '16px' }}>Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label style={{ display: 'block', color: '#959597', marginBottom: '8px' }}>Budget (USD)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full input"
              placeholder="1000"
              step="100"
              min="10"
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#959597', marginBottom: '8px' }}>Risk Tolerance</label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="w-full select"
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={analyzePools}
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Analyzing...' : 'Analyze Pools'}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: 'rgba(255, 23, 68, 0.1)',
            border: '1px solid rgba(255, 23, 68, 0.4)',
            borderRadius: '8px',
            padding: '16px',
            color: '#ff1744',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 style={{ fontSize: '24px', color: '#e4020d' }}>Top Recommendations</h2>
          {recommendations.map((pool, i) => (
            <div
              key={`${pool.name}-${i}`}
              className="card p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center text-lg font-bold"
                    style={{
                      background: 'rgba(228,2,13,0.1)',
                      border: '1px solid #28282c',
                      borderRadius: '8px',
                      color: '#e4020d',
                    }}
                  >
                    #{i + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '22px', color: '#ffffff' }}>{pool.name}</h3>
                    <p style={{ fontSize: '15px', color: '#959597' }}>Meteora DLMM Pool</p>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: '30px', color: '#e4020d' }}>{pool.score}</p>
                  <p style={{ color: '#959597', fontSize: '15px' }}>AI Score</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div style={{ background: '#0a0a0c', border: '1px solid #28282c', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ color: '#959597', fontSize: '15px' }}>TVL</p>
                  <p style={{ fontSize: '22px', color: '#ff4444' }}>{pool.tvl}</p>
                </div>
                <div style={{ background: '#0a0a0c', border: '1px solid #28282c', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ color: '#959597', fontSize: '15px' }}>APY</p>
                  <p style={{ fontSize: '22px', color: '#00c853' }}>{pool.apy}</p>
                </div>
                <div style={{ background: '#0a0a0c', border: '1px solid #28282c', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ color: '#959597', fontSize: '15px' }}>Risk</p>
                  <p style={{ fontSize: '22px', color: getRiskColor(pool.risk) }}>{pool.risk}</p>
                </div>
              </div>

              <div
                className="mt-4 p-4"
                style={{
                  background: 'rgba(228, 2, 13, 0.04)',
                  border: '1px solid #28282c',
                  borderRadius: '8px',
                }}
              >
                <p style={{ color: '#ffffff' }}>{pool.reason}</p>
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href={`/risk?pool=${encodeURIComponent(pool.name)}`}
                  className="flex-1 text-center py-2 px-4 transition-all"
                  style={{
                    background: 'rgba(255,145,0,0.1)',
                    border: '1px solid rgba(255,145,0,0.4)',
                    borderRadius: '8px',
                    color: '#ff9100',
                  }}
                >
                  Risk Check
                </a>
                <a
                  href="/pools"
                  className="flex-1 text-center py-2 px-4 transition-all"
                  style={{
                    background: 'rgba(228,2,13,0.1)',
                    border: '1px solid rgba(228,2,13,0.4)',
                    borderRadius: '8px',
                    color: '#e4020d',
                  }}
                >
                  View in Pools
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {recommendations.length === 0 && !loading && !error && (
        <div className="card p-12 text-center">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
          <h3 style={{ fontSize: '24px', color: '#e4020d', marginBottom: '8px' }}>Ready to Analyze</h3>
          <p style={{ color: '#959597' }}>Set your budget and risk tolerance, then click "Analyze Pools" to get AI-powered recommendations.</p>
        </div>
      )}
    </div>
  );
}

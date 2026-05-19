'use client';

import { useState } from 'react';

interface Strategy {
  name: string;
  description: string;
  steps: string[];
  expectedApy: string;
  riskLevel: string;
  capitalRequired: string;
}

export default function StrategyPage() {
  const [goal, setGoal] = useState('');
  const [capital, setCapital] = useState('5000');
  const [experience, setExperience] = useState('intermediate');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<Strategy | null>(null);

  const buildStrategy = async () => {
    if (!goal) return;
    setLoading(true);
    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, capital: Number(capital), experience }),
      });
      const data = await res.json();
      setStrategy(data);
    } catch (err) {
      console.error('Strategy error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="text-3xl font-bold gradient-text" style={{ fontSize: '36px' }}>Strategy Builder</h1>
        <p style={{ color: '#959597', marginTop: '4px' }}>Create custom LP strategies powered by AI</p>
      </div>

      {/* Input Form */}
      <div className="card p-6">
        <h2 style={{ fontSize: '22px', color: '#e4020d', marginBottom: '16px' }}>Define Your Goals</h2>
        <div className="space-y-4">
          <div>
            <label style={{ display: 'block', color: '#959597', marginBottom: '8px' }}>Investment Goal</label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              className="w-full textarea"
              placeholder="e.g., Maximize yield on SOL-USDC with moderate risk, target 50%+ APY..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label style={{ display: 'block', color: '#959597', marginBottom: '8px' }}>Capital (USD)</label>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="w-full input"
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#959597', marginBottom: '8px' }}>Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full select"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={buildStrategy}
                disabled={loading || !goal}
                className="w-full btn-primary"
              >
                {loading ? 'Building...' : 'Build Strategy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      {strategy && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 style={{ fontSize: '24px', color: '#e4020d', marginBottom: '8px' }}>{strategy.name}</h2>
            <p style={{ color: '#959597' }}>{strategy.description}</p>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-4" style={{ borderTop: '1px solid #28282c' }}>
              <div className="text-center p-4" style={{ background: '#0a0a0c', border: '1px solid #28282c', borderRadius: '8px' }}>
                <p style={{ color: '#959597', fontSize: '15px' }}>Expected APY</p>
                <p style={{ fontSize: '24px', color: '#00c853' }}>{strategy.expectedApy}</p>
              </div>
              <div className="text-center p-4" style={{ background: '#0a0a0c', border: '1px solid #28282c', borderRadius: '8px' }}>
                <p style={{ color: '#959597', fontSize: '15px' }}>Risk Level</p>
                <p style={{ fontSize: '24px', color: '#ff9100' }}>{strategy.riskLevel}</p>
              </div>
              <div className="text-center p-4" style={{ background: '#0a0a0c', border: '1px solid #28282c', borderRadius: '8px' }}>
                <p style={{ color: '#959597', fontSize: '15px' }}>Min Capital</p>
                <p style={{ fontSize: '24px', color: '#ff4444' }}>{strategy.capitalRequired}</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="card p-6">
            <h2 style={{ fontSize: '22px', color: '#e4020d', marginBottom: '16px' }}>Execution Steps</h2>
            <div className="space-y-3">
              {strategy.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4"
                  style={{
                    background: '#0a0a0c',
                    border: '1px solid #28282c',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(228, 2, 13, 0.15)',
                      border: '1px solid rgba(228, 2, 13, 0.3)',
                      borderRadius: '8px',
                      color: '#e4020d',
                    }}
                  >
                    {i + 1}
                  </div>
                  <p style={{ color: '#ffffff', paddingTop: '2px' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

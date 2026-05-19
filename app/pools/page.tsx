'use client';

import { useState, useEffect } from 'react';

interface Pool {
  name: string;
  address: string;
  baseSymbol: string;
  quoteSymbol: string;
  binStep: number;
  feePct: number;
  tvl: number;
  volume24h: number;
  feeTvlRatio: number;
  volatility: number;
  holders: number;
  mcap: number;
  organic: number;
  activePct: number;
  price: number;
  priceChange: number;
  volumeChange: number;
  holdersChange: number;
  score: number;
}

function fmtUsd(n: number | null) {
  if (n == null) return '—';
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
}

function fmtPct(n: number | null) {
  if (n == null) return '—';
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
}

export default function PoolsPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'tvl' | 'volume24h' | 'apy' | 'organic'>('score');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [selected, setSelected] = useState<Pool | null>(null);

  const fetchPools = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pools');
      const data = await res.json();
      setPools(data.pools || []);
    } catch (err) {
      console.error('Failed to fetch pools:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPools();
  }, []);

  const filteredPools = pools
    .filter((p) => {
      if (filterRisk === 'low') return p.organic >= 60;
      if (filterRisk === 'medium') return p.organic >= 40 && p.organic < 60;
      if (filterRisk === 'high') return p.organic < 40;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'tvl') return b.tvl - a.tvl;
      if (sortBy === 'volume24h') return b.volume24h - a.volume24h;
      if (sortBy === 'organic') return b.organic - a.organic;
      return b.score - a.score;
    });

  const getRiskBadge = (organic: number) => {
    if (organic >= 60) return { label: 'Low', color: '#00c853', bg: 'rgba(0,200,83,0.1)', border: 'rgba(0,200,83,0.3)' };
    if (organic >= 40) return { label: 'Medium', color: '#ff9100', bg: 'rgba(255,145,0,0.1)', border: 'rgba(255,145,0,0.3)' };
    return { label: 'High', color: '#ff1744', bg: 'rgba(255,23,68,0.1)', border: 'rgba(255,23,68,0.3)' };
  };

  const getChangeColor = (val: number | null) => {
    if (val == null) return '#959597';
    return val > 0 ? '#00c853' : val < 0 ? '#ff1744' : '#959597';
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text" style={{ fontSize: '36px' }}>Pool Explorer</h1>
          <p style={{ color: '#959597', marginTop: '4px' }}>Discover trending DLMM pools on Meteora</p>
        </div>
        <button onClick={fetchPools} disabled={loading} className="btn-primary">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pools', value: pools.length.toString(), icon: '🏊', color: '#e4020d' },
          { label: 'Avg TVL', value: fmtUsd(pools.length > 0 ? pools.reduce((s, p) => s + p.tvl, 0) / pools.length : 0), icon: '💰', color: '#ff9100' },
          { label: 'High Organic', value: pools.filter((p) => p.organic >= 60).length.toString(), icon: '🌿', color: '#00c853' },
          { label: 'Trending', value: pools.filter((p) => (p.volumeChange ?? 0) > 20).length.toString(), icon: '🔥', color: '#ff4444' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: '20px' }}>{stat.icon}</span>
              <span style={{ color: '#959597' }}>{stat.label}</span>
            </div>
            <p style={{ fontSize: '24px', color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span style={{ color: '#959597' }}>Sort by:</span>
        {[
          { key: 'score', label: 'AI Score' },
          { key: 'tvl', label: 'TVL' },
          { key: 'volume24h', label: 'Volume' },
          { key: 'organic', label: 'Organic' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key as any)}
            className="px-3 py-1.5 transition-all"
            style={{
              border: sortBy === s.key ? '1px solid #e4020d' : '1px solid #28282c',
              borderRadius: '8px',
              background: sortBy === s.key ? 'rgba(228,2,13,0.1)' : '#141416',
              color: sortBy === s.key ? '#e4020d' : '#959597',
            }}
          >
            {s.label}
          </button>
        ))}

        <div className="ml-4 flex items-center gap-2">
          <span style={{ color: '#959597' }}>Risk:</span>
          {[
            { key: 'all', label: 'All' },
            { key: 'low', label: '🟢 Low' },
            { key: 'medium', label: '🟡 Medium' },
            { key: 'high', label: '🔴 High' },
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => setFilterRisk(r.key as any)}
              className="px-3 py-1.5 transition-all"
              style={{
                border: filterRisk === r.key ? '1px solid #e4020d' : '1px solid #28282c',
                borderRadius: '8px',
                background: filterRisk === r.key ? 'rgba(228,2,13,0.1)' : '#141416',
                color: filterRisk === r.key ? '#e4020d' : '#959597',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pool List */}
      {filteredPools.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #28282c' }}>
                  <th className="text-left py-3 px-4">#</th>
                  <th className="text-left py-3 px-4">Pool</th>
                  <th className="text-right py-3 px-4">Mkt Cap</th>
                  <th className="text-right py-3 px-4">TVL</th>
                  <th className="text-right py-3 px-4">Vol 24h</th>
                  <th className="text-right py-3 px-4">Fee</th>
                  <th className="text-right py-3 px-4">Organic</th>
                  <th className="text-right py-3 px-4">Holders</th>
                  <th className="text-right py-3 px-4">Vol Δ</th>
                  <th className="text-right py-3 px-4">Price Δ</th>
                  <th className="text-right py-3 px-4">Score</th>
                  <th className="text-center py-3 px-4">Risk</th>
                  <th className="text-center py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPools.map((pool, i) => {
                  const risk = getRiskBadge(pool.organic);
                  return (
                    <tr
                      key={pool.address}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid #28282c44' }}
                      onClick={() => setSelected(pool)}
                    >
                      <td className="py-3 px-4" style={{ color: '#959597' }}>{i + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 flex items-center justify-center text-xs font-bold"
                            style={{
                              background: 'rgba(228,2,13,0.1)',
                              border: '1px solid #28282c',
                              borderRadius: '6px',
                              color: '#e4020d',
                            }}
                          >
                            {pool.baseSymbol?.slice(0, 2) || '??'}
                          </div>
                          <div>
                            <p>{pool.name}</p>
                            <p style={{ fontSize: '15px', color: '#959597' }}>Bin: {pool.binStep}</p>
                          </div>
                          {i === 0 && (
                            <span
                              className="ml-2 px-2 py-0.5"
                              style={{
                                background: 'rgba(228,2,13,0.15)',
                                border: '1px solid rgba(228,2,13,0.4)',
                                borderRadius: '6px',
                                color: '#e4020d',
                                fontSize: '14px',
                              }}
                            >
                              BEST
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">{fmtUsd(pool.mcap)}</td>
                      <td className="py-3 px-4 text-right" style={{ color: '#ff4444' }}>{fmtUsd(pool.tvl)}</td>
                      <td className="py-3 px-4 text-right">{fmtUsd(pool.volume24h)}</td>
                      <td className="py-3 px-4 text-right">{pool.feePct ? `${pool.feePct}%` : '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <span style={{ color: pool.organic >= 60 ? '#00c853' : pool.organic >= 40 ? '#ff9100' : '#ff1744' }}>
                          {pool.organic}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">{pool.holders?.toLocaleString() || '—'}</td>
                      <td className="py-3 px-4 text-right" style={{ color: getChangeColor(pool.volumeChange) }}>
                        {fmtPct(pool.volumeChange)}
                      </td>
                      <td className="py-3 px-4 text-right" style={{ color: getChangeColor(pool.priceChange) }}>
                        {fmtPct(pool.priceChange)}
                      </td>
                      <td className="py-3 px-4 text-right" style={{ color: '#e4020d' }}>{pool.score}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className="badge"
                          style={{
                            color: risk.color,
                            background: risk.bg,
                            borderColor: risk.border,
                          }}
                        >
                          {risk.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(pool);
                          }}
                          className="px-3 py-1.5 transition-all"
                          style={{
                            background: 'rgba(228,2,13,0.1)',
                            border: '1px solid rgba(228,2,13,0.4)',
                            borderRadius: '8px',
                            color: '#e4020d',
                          }}
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center">
          {loading ? (
            <div>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
              <p style={{ color: '#959597' }}>Fetching pools from Meteora...</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏊</div>
              <h3 style={{ fontSize: '22px', color: '#e4020d', marginBottom: '8px' }}>No Pools Found</h3>
              <p style={{ color: '#959597', marginBottom: '16px' }}>Click "Refresh" to load DLMM pools from Meteora</p>
              <button onClick={fetchPools} className="btn-primary">
                Load Pools
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pool Detail Modal */}
      {selected && (
        <div className="card p-6" style={{ borderColor: 'rgba(228, 2, 13, 0.4)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '24px', color: '#e4020d' }}>{selected.name}</h3>
            <button onClick={() => setSelected(null)} style={{ color: '#959597', fontSize: '22px' }}>✕</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Pool Address', value: selected.address, color: '#ffffff', small: true },
              { label: 'TVL', value: fmtUsd(selected.tvl), color: '#ff4444' },
              { label: 'Volume 24h', value: fmtUsd(selected.volume24h), color: '#ffffff' },
              { label: 'Market Cap', value: fmtUsd(selected.mcap), color: '#ffffff' },
              { label: 'Fee', value: `${selected.feePct}%`, color: '#ff9100' },
              { label: 'Organic Score', value: `${selected.organic}/100`, color: selected.organic >= 60 ? '#00c853' : selected.organic >= 40 ? '#ff9100' : '#ff1744' },
              { label: 'Volatility', value: String(selected.volatility), color: '#ffffff' },
              { label: 'Holders', value: selected.holders?.toLocaleString() || '—', color: '#ffffff' },
            ].map((item) => (
              <div key={item.label} style={{ background: '#0a0a0c', border: '1px solid #28282c', borderRadius: '8px', padding: '12px' }}>
                <p style={{ color: '#959597', fontSize: '15px' }}>{item.label}</p>
                <p style={{ fontSize: item.small ? '14px' : '22px', color: item.color, wordBreak: item.small ? 'break-all' : 'normal' }}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Volume Change', value: fmtPct(selected.volumeChange), color: getChangeColor(selected.volumeChange) },
              { label: 'Price Change', value: fmtPct(selected.priceChange), color: getChangeColor(selected.priceChange) },
              { label: 'Holders Change', value: fmtPct(selected.holdersChange), color: getChangeColor(selected.holdersChange) },
            ].map((item) => (
              <div key={item.label} style={{ background: '#0a0a0c', border: '1px solid #28282c', borderRadius: '8px', padding: '12px' }}>
                <p style={{ color: '#959597', fontSize: '15px' }}>{item.label}</p>
                <p style={{ fontSize: '22px', color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <a
              href={`/advisor?pool=${selected.address}`}
              className="flex-1 text-center py-2.5 px-4 transition-all"
              style={{
                background: 'rgba(228,2,13,0.1)',
                border: '1px solid rgba(228,2,13,0.4)',
                borderRadius: '8px',
                color: '#e4020d',
              }}
            >
              AI Advisor
            </a>
            <a
              href={`/risk?pool=${selected.address}`}
              className="flex-1 text-center py-2.5 px-4 transition-all"
              style={{
                background: 'rgba(255,145,0,0.1)',
                border: '1px solid rgba(255,145,0,0.4)',
                borderRadius: '8px',
                color: '#ff9100',
              }}
            >
              Risk Check
            </a>
            <button className="flex-1 py-2.5 px-4 btn-primary">
              Deploy Liquidity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

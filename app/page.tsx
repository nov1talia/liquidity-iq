'use client';

import { useState, useEffect } from 'react';

interface WalletInfo {
  address: string;
  solBalance: number;
  tokens: { mint: string; amount: number; decimals: number }[];
  tokenCount: number;
}

export default function Dashboard() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [walletInput, setWalletInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [positions, setPositions] = useState<any[]>([]);

  const connectWallet = async () => {
    if (!walletInput.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletInput.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setWallet(data);
        localStorage.setItem('wallet_address', walletInput.trim());
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
    }
    setLoading(false);
  };

  const disconnectWallet = () => {
    setWallet(null);
    setWalletInput('');
    localStorage.removeItem('wallet_address');
  };

  useEffect(() => {
    const saved = localStorage.getItem('wallet_address');
    if (saved) {
      setWalletInput(saved);
      fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: saved }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) setWallet(data);
        })
        .catch(() => {});
    }
  }, []);

  const fmtAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text" style={{ fontSize: '36px' }}>Dashboard</h1>
          <p style={{ color: '#959597', marginTop: '4px' }}>Monitor your DLMM positions and portfolio performance</p>
        </div>
        {wallet && (
          <button onClick={disconnectWallet} className="btn-danger">
            Disconnect
          </button>
        )}
      </div>

      {/* Wallet Connection */}
      {!wallet ? (
        <div className="card p-8">
          <div className="text-center mb-6">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔗</div>
            <h2 style={{ fontSize: '24px', color: '#e4020d', marginBottom: '8px' }}>Connect Your Wallet</h2>
            <p style={{ color: '#959597' }}>Enter your Solana wallet address to view your portfolio</p>
          </div>
          <div className="flex gap-3 max-w-lg mx-auto">
            <input
              type="text"
              value={walletInput}
              onChange={(e) => setWalletInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && connectWallet()}
              className="flex-1 input"
              placeholder="Enter Solana wallet address..."
            />
            <button
              onClick={connectWallet}
              disabled={loading || !walletInput.trim()}
              className="btn-primary"
            >
              {loading ? 'Loading...' : 'Connect'}
            </button>
          </div>
          {error && (
            <p style={{ color: '#ff1744', fontSize: '18px', textAlign: 'center', marginTop: '16px' }}>⚠️ {error}</p>
          )}
        </div>
      ) : (
        <>
          {/* Wallet Info */}
          <div className="card p-6" style={{ borderColor: 'rgba(228, 2, 13, 0.4)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center text-lg"
                  style={{
                    background: 'rgba(228, 2, 13, 0.15)',
                    border: '1px solid rgba(228, 2, 13, 0.3)',
                    borderRadius: '8px',
                  }}
                >
                  👛
                </div>
                <div>
                  <p style={{ color: '#959597', fontSize: '16px' }}>Connected Wallet</p>
                  <p style={{ fontFamily: 'VT323, monospace', fontSize: '19px' }}>{fmtAddr(wallet.address)}</p>
                </div>
              </div>
              <div className="text-right">
                <p style={{ color: '#959597', fontSize: '16px' }}>SOL Balance</p>
                <p style={{ fontSize: '28px', color: '#e4020d' }}>
                  {wallet.solBalance.toFixed(4)} SOL
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'SOL Balance', value: `${wallet.solBalance.toFixed(4)} SOL`, change: 'Mainnet', color: '#e4020d' },
              { label: 'Token Accounts', value: wallet.tokenCount.toString(), change: 'SPL Tokens', color: '#ff4444' },
              { label: 'Active Positions', value: positions.length.toString(), change: 'DLMM Pools', color: '#ff9100' },
              { label: 'Network', value: 'Solana', change: 'Mainnet Beta', color: '#00c853' },
            ].map((stat) => (
              <div key={stat.label} className="card p-5">
                <p style={{ color: '#959597', fontSize: '16px' }}>{stat.label}</p>
                <p style={{ fontSize: '26px', marginTop: '4px', color: stat.color }}>{stat.value}</p>
                <p style={{ fontSize: '16px', marginTop: '8px', color: '#00c853' }}>{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Token List */}
          {wallet.tokens.length > 0 && (
            <div className="card p-6">
              <h2 style={{ fontSize: '22px', color: '#e4020d', marginBottom: '16px' }}>Token Holdings</h2>
              <div className="space-y-2">
                {wallet.tokens
                  .filter((t) => t.amount > 0)
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 20)
                  .map((token, i) => (
                    <div
                      key={token.mint}
                      className="flex items-center justify-between p-3"
                      style={{
                        background: '#0a0a0c',
                        border: '1px solid #28282c',
                        borderRadius: '8px',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 flex items-center justify-center text-xs font-bold"
                          style={{
                            background: 'rgba(228, 2, 13, 0.1)',
                            border: '1px solid #28282c',
                            borderRadius: '6px',
                            color: '#e4020d',
                          }}
                        >
                          {i + 1}
                        </div>
                        <p style={{ fontFamily: 'VT323, monospace', fontSize: '16px', color: '#959597' }}>{fmtAddr(token.mint)}</p>
                      </div>
                      <p>{token.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Empty Positions */}
          <div className="card p-6">
            <h2 style={{ fontSize: '22px', color: '#e4020d', marginBottom: '16px' }}>Active Positions</h2>
            {positions.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: '#959597', marginBottom: '16px', fontSize: '20px' }}>📭 No active DLMM positions</p>
                <a
                  href="/pools"
                  className="btn-primary inline-block"
                >
                  Explore Pools
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {positions.map((pos: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4"
                    style={{
                      background: '#0a0a0c',
                      border: '1px solid #28282c',
                      borderRadius: '8px',
                    }}
                  >
                    <p>{pos.name}</p>
                    <p style={{ color: '#00c853' }}>{pos.apy}% APY</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Pool Explorer', desc: 'Discover trending DLMM pools', href: '/pools', color: '#e4020d' },
              { title: 'AI Advisor', desc: 'Get AI-powered recommendations', href: '/advisor', color: '#ff4444' },
              { title: 'Risk Analysis', desc: 'Evaluate pool safety scores', href: '/risk', color: '#ff9100' },
            ].map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="card p-5 cursor-pointer group block"
              >
                <div
                  className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform"
                  style={{
                    background: action.color,
                    borderRadius: '8px',
                    opacity: 0.8,
                  }}
                />
                <h3 style={{ color: action.color, fontSize: '20px' }}>{action.title}</h3>
                <p style={{ color: '#959597', marginTop: '4px' }}>{action.desc}</p>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

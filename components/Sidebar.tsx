'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/pools', label: 'Pool Explorer', icon: '🏊' },
  { href: '/advisor', label: 'AI Advisor', icon: '🤖' },
  { href: '/risk', label: 'Risk Analysis', icon: '🛡️' },
  { href: '/strategy', label: 'Strategy Builder', icon: '⚙️' },
  { href: '/chat', label: 'AI Chat', icon: '💬' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50"
      style={{
        background: '#111113',
        borderRight: '1px solid #28282c',
      }}
    >
      {/* Logo */}
      <div className="p-6" style={{ borderBottom: '1px solid #28282c' }}>
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center text-lg font-bold"
            style={{
              background: '#e4020d',
              borderRadius: '8px',
              color: '#ffffff',
            }}
          >
            IQ
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">LiquidityIQ</h1>
            <p style={{ color: '#959597', fontSize: '15px' }}>AI DLMM Manager</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className="flex items-center gap-3 px-4 py-3 transition-all cursor-pointer"
                style={{
                  borderRadius: '8px',
                  background: isActive ? 'rgba(228, 2, 13, 0.1)' : 'transparent',
                  color: isActive ? '#ffffff' : '#959597',
                  fontSize: '19px',
                  position: 'relative',
                }}
              >
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '24px',
                      background: '#e4020d',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-3" style={{ borderTop: '1px solid #28282c' }}>
        {/* Powered by Meteora */}
        <a
          href="https://www.meteora.ag/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 transition-all"
          style={{
            background: '#0a0a0c',
            border: '1px solid #28282c',
            borderRadius: '8px',
            color: '#959597',
            fontSize: '15px',
            textDecoration: 'none',
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#e4020d'; e.currentTarget.style.color = '#ffffff'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#28282c'; e.currentTarget.style.color = '#959597'; }}
        >
          <span>⚡</span>
          <span>Powered by <strong style={{ color: '#e4020d' }}>Meteora</strong></span>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/nov1talia/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 transition-all"
          style={{
            background: '#0a0a0c',
            border: '1px solid #28282c',
            borderRadius: '8px',
            color: '#959597',
            fontSize: '15px',
            textDecoration: 'none',
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#e4020d'; e.currentTarget.style.color = '#ffffff'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#28282c'; e.currentTarget.style.color = '#959597'; }}
        >
          <span>📦</span>
          <span>GitHub</span>
        </a>

        {/* Network */}
        <div
          className="px-4 py-2"
          style={{
            background: '#0a0a0c',
            border: '1px solid #28282c',
            borderRadius: '8px',
          }}
        >
          <p style={{ color: '#959597', fontSize: '15px' }}>Network</p>
          <p style={{ color: '#00c853', fontSize: '17px' }}>
            ● Solana Mainnet
          </p>
        </div>
      </div>
    </aside>
  );
}

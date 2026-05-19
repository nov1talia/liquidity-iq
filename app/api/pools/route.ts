import { NextRequest, NextResponse } from 'next/server';

const POOL_API = 'https://pool-discovery-api.datapi.meteora.ag';

interface MeteoraPool {
  pool_address: string;
  name: string;
  token_x: {
    symbol: string;
    address: string;
    market_cap: number;
    organic_score: number;
    holders: number;
    holders_change_pct: number;
  };
  token_y: { symbol: string; address: string };
  dlmm_params: { bin_step: number };
  fee_pct: number;
  active_tvl: number;
  volume: number;
  fee: number;
  fee_active_tvl_ratio: number;
  volatility: number;
  active_positions_pct: number;
  pool_price: number;
  pool_price_change_pct: number;
  volume_change_pct: number;
}

function fix(n: number | null, d: number) {
  return n != null ? Number(n.toFixed(d)) : null;
}

function condensePool(p: MeteoraPool) {
  return {
    pool: p.pool_address,
    name: p.name,
    baseSymbol: p.token_x?.symbol,
    baseMint: p.token_x?.address,
    quoteSymbol: p.token_y?.symbol,
    binStep: p.dlmm_params?.bin_step || null,
    feePct: p.fee_pct,
    tvl: Math.round(p.active_tvl || 0),
    volume24h: Math.round(p.volume || 0),
    feeTvlRatio: fix(p.fee_active_tvl_ratio, 4) ?? fix(p.active_tvl > 0 ? (p.fee / p.active_tvl) * 100 : 0, 4),
    volatility: fix(p.volatility, 2),
    holders: p.token_x?.holders,
    mcap: Math.round(p.token_x?.market_cap || 0),
    organic: Math.round(p.token_x?.organic_score || 0),
    activePct: fix(p.active_positions_pct, 1),
    price: p.pool_price,
    priceChange: fix(p.pool_price_change_pct, 1),
    volumeChange: fix(p.volume_change_pct, 1),
    holdersChange: fix(p.token_x?.holders_change_pct, 1),
    score: parseFloat(
      ((p.token_x?.organic_score || 0) * (fix(p.fee_active_tvl_ratio, 4) || 0) * 0.01).toFixed(2)
    ),
    address: p.pool_address,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const minMcap = parseInt(searchParams.get('minMcap') || '10000');
    const maxMcap = parseInt(searchParams.get('maxMcap') || '100000000');
    const minHolders = parseInt(searchParams.get('minHolders') || '50');
    const minVolume = parseInt(searchParams.get('minVolume') || '1000');
    const minTvl = parseInt(searchParams.get('minTvl') || '1000');
    const minOrganic = parseInt(searchParams.get('minOrganic') || '20');

    const filters = [
      'pool_type=dlmm',
      'base_token_has_critical_warnings=false',
      `base_token_market_cap>=${minMcap}`,
      `base_token_market_cap<=${maxMcap}`,
      `base_token_holders>=${minHolders}`,
      `volume>=${minVolume}`,
      `tvl>=${minTvl}`,
      `base_token_organic_score>=${minOrganic}`,
    ];

    const queryFilters = filters.join('&&');
    const url = `${POOL_API}/pools?page_size=${limit}&filter_by=${encodeURIComponent(queryFilters)}&timeframe=24h`;

    console.log('[pools] Fetching:', url);

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Meteora API error: ${response.status}`);
    }

    const data = await response.json();
    const pools = (data.data || []).map(condensePool);

    return NextResponse.json({
      total: data.total || pools.length,
      pools,
      filters: { minMcap, maxMcap, minHolders, minVolume, minTvl, minOrganic },
    });
  } catch (error: any) {
    console.error('[pools] Error:', error.message);
    return NextResponse.json({ error: error.message, pools: [] }, { status: 500 });
  }
}

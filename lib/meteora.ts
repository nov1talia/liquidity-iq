const METEORA_API = process.env.METEORA_API_URL || 'https://dlmm-api.meteora.ag';

export interface DLMMPool {
  address: string;
  name: string;
  mint_x: string;
  mint_y: string;
  reserve_x: string;
  reserve_y: string;
  reserve_x_amount: number;
  reserve_y_amount: number;
  bin_step: number;
  base_fee_percentage: number;
  max_fee_percentage: number;
  protocol_fee_percentage: number;
  liquidity: string;
  reward_mint_x: string;
  reward_mint_y: string;
  apy: number;
  tvl: number;
  volume_24h: number;
  fees_24h: number;
  apr: number;
}

export interface DLMMPosition {
  poolAddress: string;
  positionAddress: string;
  lowerBinId: number;
  upperBinId: number;
  liquidityShares: string;
  totalClaimedFeeX: string;
  totalClaimedFeeY: string;
}

export async function getAllPools(): Promise<DLMMPool[]> {
  const response = await fetch(`${METEORA_API}/pair/all`);
  if (!response.ok) throw new Error('Failed to fetch Meteora pools');
  return response.json();
}

export async function getPoolByAddress(address: string): Promise<DLMMPool> {
  const response = await fetch(`${METEORA_API}/pair/${address}`);
  if (!response.ok) throw new Error('Failed to fetch pool');
  return response.json();
}

export async function getTopPools(limit = 20): Promise<DLMMPool[]> {
  const pools = await getAllPools();
  return pools
    .sort((a, b) => b.tvl - a.tvl)
    .slice(0, limit);
}

export async function getPoolStats(address: string) {
  const response = await fetch(`${METEORA_API}/pair/${address}/statistics`);
  if (!response.ok) throw new Error('Failed to fetch pool stats');
  return response.json();
}

export async function searchPools(query: string): Promise<DLMMPool[]> {
  const pools = await getAllPools();
  const q = query.toLowerCase();
  return pools.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.mint_x.toLowerCase().includes(q) ||
      p.mint_y.toLowerCase().includes(q)
  );
}

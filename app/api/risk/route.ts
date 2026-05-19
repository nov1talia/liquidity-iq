import { NextRequest, NextResponse } from 'next/server';
import { callAIWithJSON } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { poolAddress } = await req.json();

    const result = await callAIWithJSON<any>([
      {
        role: 'system',
        content: `You are a DeFi risk analyst for Meteora DLMM pools on Solana.
Return JSON: {
  "overallScore": 75,
  "factors": [
    { "name": "Liquidity Depth", "score": 80, "status": "Good", "detail": "..." },
    { "name": "Smart Contract Risk", "score": 70, "status": "Moderate", "detail": "..." },
    { "name": "Impermanent Loss Risk", "score": 65, "status": "Moderate", "detail": "..." },
    { "name": "Counterparty Risk", "score": 85, "status": "Good", "detail": "..." },
    { "name": "Market Volatility", "score": 60, "status": "Elevated", "detail": "..." }
  ],
  "summary": "...",
  "recommendation": "..."
}
Score each factor 0-100. Overall score is weighted average.`,
      },
      {
        role: 'user',
        content: `Analyze the risk of Meteora DLMM pool: ${poolAddress}`,
      },
    ]);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

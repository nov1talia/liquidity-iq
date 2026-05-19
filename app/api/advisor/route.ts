import { NextRequest, NextResponse } from 'next/server';
import { callAIWithJSON } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { budget, riskLevel } = await req.json();

    const result = await callAIWithJSON<{ recommendations: any[] }>([
      {
        role: 'system',
        content: `You are a DeFi expert specializing in Meteora DLMM pools on Solana. 
Return JSON with this structure: { "recommendations": [{ "name": "TOKEN-TOKEN", "score": 85, "apy": "45.2%", "tvl": "$2.5M", "risk": "Low|Medium|High", "reason": "..." }] }
Provide 3-5 recommendations based on the user's budget and risk tolerance.`,
      },
      {
        role: 'user',
        content: `Budget: $${budget}, Risk tolerance: ${riskLevel}. Recommend the best Meteora DLMM pools.`,
      },
    ]);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

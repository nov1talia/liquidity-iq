import { NextRequest, NextResponse } from 'next/server';
import { callAIWithJSON } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { goal, capital, experience } = await req.json();

    const result = await callAIWithJSON<any>([
      {
        role: 'system',
        content: `You are a DeFi strategy expert for Meteora DLMM pools on Solana.
Return JSON: {
  "name": "Strategy Name",
  "description": "...",
  "steps": ["Step 1", "Step 2", ...],
  "expectedApy": "45-65%",
  "riskLevel": "Low|Medium|High",
  "capitalRequired": "$1,000"
}
Tailor the strategy to the user's experience level and capital.`,
      },
      {
        role: 'user',
        content: `Goal: ${goal}\nCapital: $${capital}\nExperience: ${experience}`,
      },
    ]);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

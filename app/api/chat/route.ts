import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const result = await callAI([
      {
        role: 'system',
        content: `You are LiquidityIQ AI, an expert assistant for Meteora DLMM liquidity management on Solana. 
Help users understand pools, assess risks, build strategies, and navigate DeFi.
Be concise, accurate, and actionable. Use plain language.`,
      },
      ...messages,
    ]);

    return NextResponse.json({ reply: result.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

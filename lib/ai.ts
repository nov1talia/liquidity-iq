const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

export async function callAI(messages: AIMessage[], options?: {
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: string };
}): Promise<AIResponse> {
  const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 2048,
      response_format: options?.response_format,
      stream: false,  // Force non-streaming
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI API error: ${response.status} - ${error}`);
  }

  const text = await response.text();
  
  // Handle SSE streaming response (data: {...}\n\n)
  if (text.startsWith('data: ')) {
    const lines = text.split('\n').filter(line => line.startsWith('data: '));
    let content = '';
    for (const line of lines) {
      const jsonStr = line.replace('data: ', '').trim();
      if (jsonStr === '[DONE]') continue;
      try {
        const chunk = JSON.parse(jsonStr);
        if (chunk.choices?.[0]?.delta?.content) {
          content += chunk.choices[0].delta.content;
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
    return { content, usage: undefined };
  }
  
  // Regular JSON response
  const data = JSON.parse(text);
  return {
    content: data.choices[0].message.content,
    usage: data.usage,
  };
}

export async function callAIWithJSON<T>(messages: AIMessage[], options?: {
  temperature?: number;
  max_tokens?: number;
}): Promise<T> {
  const result = await callAI(messages, {
    ...options,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(result.content) as T;
}

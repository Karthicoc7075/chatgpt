// lib/usememo.ts
export async function getUserMemory({ userId, prompt }) {
  const res = await fetch('https://api.usememo.ai/v1/memory/query', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.USEMEMO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      prompt,
      max_tokens: 300,
    }),
  });

  if (!res.ok) throw new Error('useMemo.ai memory fetch failed');

  const data = await res.json();
  return data.memory || ''; // returns memory string
}

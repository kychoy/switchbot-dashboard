export const runtime = 'nodejs'; // ✅ Force access to process.env in this route

import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  const TOKEN = process.env.SWITCHBOT_TOKEN;
  const SECRET = process.env.SWITCHBOT_SECRET;

  if (!TOKEN || !SECRET) {
    console.error("❌ Missing env vars:", { TOKEN, SECRET });
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
  }

  const nonce = crypto.randomUUID();
  const t = Date.now();
  const data = TOKEN + t + nonce;
  const sign = crypto
    .createHmac('sha256', SECRET)
    .update(data)
    .digest('base64');

  const res = await fetch('https://api.switch-bot.com/v1.1/devices', {
    headers: {
      Authorization: TOKEN,
      sign,
      t: t.toString(),
      nonce,
      'Content-Type': 'application/json',
    },
  });

  const json = await res.json();
  return NextResponse.json(json);
}

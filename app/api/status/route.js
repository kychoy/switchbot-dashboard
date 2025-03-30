import { NextResponse } from 'next/server';
import crypto from 'crypto';

const TOKEN = 'b7789a3db5007fe082e2eb2447a44a17b867525e5390fe081f10aec10e46ae4bad6667b1d079869723af2b6aa9277065';
const SECRET = 'ab85ede58a0c95aa6b3a1da450d3c26e';

function generateHeaders() {
  const nonce = crypto.randomUUID();
  const t = Date.now();
  const data = TOKEN + t + nonce;
  const sign = crypto
    .createHmac('sha256', SECRET)
    .update(data)
    .digest('base64');

  return {
    Authorization: TOKEN,
    sign: sign,
    t: t.toString(),
    nonce: nonce,
    'Content-Type': 'application/json',
  };
}

// Dynamic route (API accepts ?id=deviceId)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('id');

  if (!deviceId) {
    return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 });
  }

  const res = await fetch(`https://api.switch-bot.com/v1.1/devices/${deviceId}/status`, {
    headers: generateHeaders(),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

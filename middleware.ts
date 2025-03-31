import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const basicAuth = authHeader?.split(' ')[1];
  const [user, pass] = basicAuth
    ? Buffer.from(basicAuth, 'base64').toString().split(':')
    : [];

  const validUser = user === process.env.AUTH_USERNAME;
  const validPass = pass === process.env.AUTH_PASSWORD;

  if (!validUser || !validPass) {
    return new NextResponse('Auth Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="SwitchBot Dashboard"',
      },
    });
  }

  return NextResponse.next();
}

// Apply to all routes — or customize with a matcher
export const config = {
  matcher: ['/', '/api/:path*'],
};


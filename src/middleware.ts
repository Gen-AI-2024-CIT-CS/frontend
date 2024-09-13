import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

interface CustomJWTPayload extends JWTPayload {
  email: string;
  role: string;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('jwt_token')?.value;
  const loginUrl = new URL('/login', req.url);
  const dashboardUrl = new URL('/dashboard', req.url);

  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret) as { payload: CustomJWTPayload };
    const path = req.nextUrl.pathname;

    console.log('User role:', payload.role);
    console.log('Token', token);

    // Chatbox access: Only admin should access
    if (path.startsWith('/chatbox')) {
      if (payload.role !== 'admin') {
        console.log('Unauthorized access attempt to /chatbox. Redirecting to dashboard');
        return NextResponse.redirect(dashboardUrl);
      }
    }

    // Dashboard access: Both admin and user can access
    if (path.startsWith('/dashboard')) {
      if (payload.role !== 'admin' && payload.role !== 'user') {
        console.log('Unauthorized access attempt to /dashboard. Redirecting to login');
        return NextResponse.redirect(loginUrl);
      }
    }

    // Token is valid, proceed with the request
    return NextResponse.next();
  } catch (err) {
    console.error('Token verification failed, redirecting to login', err);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/chatbox/:path*'],
};

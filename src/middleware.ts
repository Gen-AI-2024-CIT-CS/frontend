import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('Middleware executed'); // Log to ensure middleware is running

  const token = req.cookies.get('jwt_token')?.value;
  const loginUrl = new URL('/login', req.url);

  console.log('Token:', token); // Log the token for debugging

  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Optionally verify the token if you want to add extra security.
    // jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token is valid, proceeding...');
    return NextResponse.next();
  } catch (err) {
    console.log('Token verification failed, redirecting to login', err);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/dashboard/:path*','/chatbox/:path*'], // Match all routes under /dashboard
};
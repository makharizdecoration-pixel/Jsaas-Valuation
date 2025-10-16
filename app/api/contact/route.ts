// app/api/contact/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  if (!WORDPRESS_API_URL) {
    return NextResponse.json({ success: false, error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    
    // This is our new, reliable endpoint created by Code Snippets
    const endpoint = `${WORDPRESS_API_URL}/wp-json/jassas/v1/submit`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json(
        { success: false, error: result.message || 'An error occurred in WordPress.' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
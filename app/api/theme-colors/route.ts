import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // ✅ الرابط النهائي والصحيح لموقعك
  const WORDPRESS_API_URL = 'https://mahkhariz-backend.com/wp-json/custom/v1/theme-colors';

  try {
    const response = await fetch(WORDPRESS_API_URL, {
      cache: 'no-store' 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from WordPress: ${response.statusText}`);
    }

    const colors = await response.json();
    return NextResponse.json(colors);

  } catch (error: any) {
    console.error('Error in theme-colors API route:', error);
    return new Response(JSON.stringify({ message: 'Error fetching theme colors', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
// المسار: app/api/theme-colors/route.ts

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. يقرأ الرابط الأساسي الجديد من متغيرات البيئة
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  // تحقق للتأكد من وجود الرابط
  if (!baseUrl) {
    const errorMessage = 'Error: NEXT_PUBLIC_WORDPRESS_URL is not defined in .env.local file.';
    console.error(`🔴 ${errorMessage}`);
    return new Response(JSON.stringify({ message: 'Server configuration error', error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. يضيف الجزء الخاص بـ REST API للحصول على رابط الألوان الصحيح
  const THEME_COLORS_ENDPOINT = `${baseUrl}/wp-json/custom/v1/theme-colors`;

  try {
    const response = await fetch(THEME_COLORS_ENDPOINT, {
      cache: 'no-store' 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch from WordPress: ${response.status} ${response.statusText} - Response: ${errorText}`);
    }

    const colors = await response.json();
    return NextResponse.json(colors);

  } catch (error: any) {
    console.error('🔴 Error in theme-colors API route:', error);
    return new Response(JSON.stringify({ message: 'Error fetching theme colors', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
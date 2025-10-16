// app/api/contact/route.ts --- DEBUGGING VERSION ---

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  if (!WORDPRESS_API_URL) {
    return NextResponse.json({ success: false, error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const endpoint = `${WORDPRESS_API_URL}/wp-json/jassas/v1/submit`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    // --- The Important Change is Here ---
    // If the response is NOT okay (like a 500 error)
    if (!response.ok) {
        // Read the response as plain text to see the full PHP error message
        const errorText = await response.text();
        console.error('Fatal Error from WordPress:', errorText); // Log it on the server
        // Send the raw error back to the browser
        return NextResponse.json(
            { success: false, error: 'A fatal error occurred on the server.', details: errorText },
            { status: 500 }
        );
    }
    
    // If everything was okay, proceed as normal
    const result = await response.json();
    return NextResponse.json({ success: true, message: result.message });

  } catch (error: any) {
    console.error('API Route Catch Block Error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred in the catch block.', details: error.message }, { status: 500 });
  }
}
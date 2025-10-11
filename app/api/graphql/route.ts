// app/api/graphql/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { query, variables } = await req.json();
  const wordpressApiUrl = process.env.WORDPRESS_API_URL;

  if (!wordpressApiUrl) {
    console.error("WORDPRESS_API_URL is not defined in .env.local");
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(wordpressApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      // ✨ --- تم تفعيل هذا السطر لحل مشكلة المهلة محليًا --- ✨
      cache: 'no-store' 
    });

    const responseBody = await response.json();

    if (responseBody.errors) {
      console.error("🔴 GraphQL Errors from WordPress:", JSON.stringify(responseBody.errors, null, 2));
    }

    return NextResponse.json(responseBody);

  } catch (error) {
    console.error("🔴 Error fetching from WordPress:", error);
    return NextResponse.json(
      { error: 'Failed to fetch data from WordPress.' },
      { status: 502 } // Bad Gateway
    );
  }
}
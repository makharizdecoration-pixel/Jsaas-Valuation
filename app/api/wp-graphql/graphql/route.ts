import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const upstreamResponse = await fetch(process.env.WORDPRESS_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // Add revalidation to ensure fresh data
      next: { revalidate: 10 },
    });

    // If the upstream server returns an error, we want to see it
    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      console.error("Upstream WordPress Error:", errorText);
      return new NextResponse(errorText, { status: upstreamResponse.status });
    }

    const data = await upstreamResponse.json();
    return NextResponse.json(data);

  } catch (e: any) {
    console.error("API Route Error:", e);
    return NextResponse.json({ errors: [{ message: e?.message || "API route failed" }] }, { status: 500 });
  }
}
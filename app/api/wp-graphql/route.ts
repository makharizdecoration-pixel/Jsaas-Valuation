import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = process.env.WP_GRAPHQL_URL!;
  if (!url) {
    return NextResponse.json({ error: "WP_GRAPHQL_URL missing" }, { status: 500 });
  }

  const body = await req.text();

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
    body,
  });

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}

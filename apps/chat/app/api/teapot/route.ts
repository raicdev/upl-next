import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  return NextResponse.json({ who: "teapot", body }, { status: 418 });
}

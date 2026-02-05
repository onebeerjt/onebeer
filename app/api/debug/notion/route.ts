import { NextResponse } from "next/server";
import { getNotionDebugInfo } from "@/lib/notion/posts";

export async function GET() {
  const debug = await getNotionDebugInfo();

  return NextResponse.json(debug, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

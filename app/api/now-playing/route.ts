import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/lastfm/now-playing";

export async function GET() {
  const track = await getNowPlaying();

  return NextResponse.json(
    {
      ok: true,
      data: track
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

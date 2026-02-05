import { NextResponse } from "next/server";
import { getLatestFilm } from "@/lib/letterboxd/latest-film";

export async function GET() {
  const film = await getLatestFilm();

  return NextResponse.json(
    {
      ok: true,
      data: film
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300"
      }
    }
  );
}

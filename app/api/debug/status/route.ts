import { NextResponse } from "next/server";
import { getStatusNote } from "@/lib/notion/status";

function normalizePageId(input: string | undefined) {
  if (!input) return null;
  const source = input.includes("notion.so") ? decodeURIComponent(input) : input;
  const idMatch = source.match(/[0-9a-fA-F]{32}/) ?? source.match(/[0-9a-fA-F-]{36}/);
  if (!idMatch) return null;
  const compact = idMatch[0].replace(/-/g, "");
  if (compact.length !== 32) return null;
  return `${compact.slice(0, 8)}-${compact.slice(8, 12)}-${compact.slice(12, 16)}-${compact.slice(16, 20)}-${compact.slice(20)}`;
}

export async function GET() {
  const note = await getStatusNote();
  const pageIdRaw = process.env.NOTION_STATUS_PAGE_ID;

  return NextResponse.json(
    {
      hasToken: Boolean(process.env.NOTION_TOKEN),
      hasPageId: Boolean(pageIdRaw),
      normalizedPageId: normalizePageId(pageIdRaw),
      note
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

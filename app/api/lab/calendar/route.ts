import { NextRequest, NextResponse } from "next/server";

function formatIcsDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title") ?? "one beer event";
  const subtitle = request.nextUrl.searchParams.get("subtitle") ?? "";
  const location = request.nextUrl.searchParams.get("location") ?? "";
  const startRaw = request.nextUrl.searchParams.get("start");

  if (!startRaw) {
    return NextResponse.json({ error: "Missing start param" }, { status: 400 });
  }

  const start = formatIcsDate(startRaw);
  if (!start) {
    return NextResponse.json({ error: "Invalid start date" }, { status: 400 });
  }

  const endDate = new Date(startRaw);
  endDate.setHours(endDate.getHours() + 2);
  const end = formatIcsDate(endDate.toISOString()) ?? start;
  const uid = `${Date.now()}@onebeer.io`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//one beer//Lab Marquee//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(subtitle)}`,
    `LOCATION:${escapeIcs(location)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="onebeer-event.ics"',
      "Cache-Control": "no-store"
    }
  });
}

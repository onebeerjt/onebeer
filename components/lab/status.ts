import type { LabStatus, StatusInput } from "@/components/lab/types";

const eventKeywords = /\b(tonight|tomorrow|game|watching|meet|meetup|bar|rsvp)\b/i;
const vibeKeywords = /\b(building|working|thinking|heads down|locked in)\b/i;
const linkKeyword = /\blink:\s*(https?:\/\/\S+)\b/i;

function inferType(text: string): LabStatus["type"] {
  if (linkKeyword.test(text)) return "drop";
  if (eventKeywords.test(text)) return "event";
  if (vibeKeywords.test(text)) return "vibe";
  return "vibe";
}

function titleFromText(text: string) {
  return text.replace(linkKeyword, "").trim() || "Status update";
}

export function normalizeStatus(input: StatusInput): LabStatus {
  if (typeof input === "string") {
    const matchedUrl = input.match(linkKeyword)?.[1];
    const inferredType = inferType(input);
    return {
      type: inferredType,
      title: titleFromText(input),
      ctaLabel: matchedUrl ? "See link" : undefined,
      ctaUrl: matchedUrl,
      emoji: inferredType === "event" ? "📍" : inferredType === "drop" ? "🔗" : "💬"
    };
  }

  const baseText = input.title ?? input.message ?? input.text ?? "Status update";
  const matchedUrl = input.ctaUrl ?? baseText.match(linkKeyword)?.[1];
  const type = input.type ?? inferType(baseText);

  return {
    id: `status-${Math.random().toString(36).slice(2, 9)}`,
    type,
    title: input.title ?? titleFromText(baseText),
    subtitle: input.subtitle,
    time: input.time,
    location: input.location,
    ctaLabel: input.ctaLabel ?? (matchedUrl ? "See link" : undefined),
    ctaUrl: matchedUrl,
    emoji: input.emoji ?? (type === "event" ? "📍" : type === "drop" ? "🔗" : "💬"),
    startsAtIso: input.startsAtIso
  };
}

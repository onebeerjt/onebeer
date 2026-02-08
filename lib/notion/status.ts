type NotionRichText = { plain_text?: string };

type NotionBlock = {
  type: string;
  paragraph?: { rich_text?: NotionRichText[] };
  heading_1?: { rich_text?: NotionRichText[] };
  heading_2?: { rich_text?: NotionRichText[] };
  heading_3?: { rich_text?: NotionRichText[] };
  quote?: { rich_text?: NotionRichText[] };
};

type NotionBlockResponse = {
  results?: NotionBlock[];
};

function normalizePageId(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const source = trimmed.includes("notion.so") ? decodeURIComponent(trimmed) : trimmed;
  const idMatch = source.match(/[0-9a-fA-F]{32}/) ?? source.match(/[0-9a-fA-F-]{36}/);
  if (!idMatch) {
    return null;
  }

  const compact = idMatch[0].replace(/-/g, "");
  if (compact.length !== 32) {
    return null;
  }

  return `${compact.slice(0, 8)}-${compact.slice(8, 12)}-${compact.slice(12, 16)}-${compact.slice(16, 20)}-${compact.slice(20)}`;
}

function notionHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
  };
}

function richTextToPlainText(richText?: NotionRichText[]) {
  if (!richText || richText.length === 0) {
    return "";
  }

  return richText.map((item) => item.plain_text ?? "").join("").trim();
}

function getBlockText(block: NotionBlock): string {
  if (block.paragraph) return richTextToPlainText(block.paragraph.rich_text);
  if (block.heading_1) return richTextToPlainText(block.heading_1.rich_text);
  if (block.heading_2) return richTextToPlainText(block.heading_2.rich_text);
  if (block.heading_3) return richTextToPlainText(block.heading_3.rich_text);
  if (block.quote) return richTextToPlainText(block.quote.rich_text);
  return "";
}

export async function getStatusNote(): Promise<string | null> {
  const token = process.env.NOTION_TOKEN;
  const pageIdRaw = process.env.NOTION_STATUS_PAGE_ID;

  if (!token || !pageIdRaw) {
    return null;
  }

  const pageId = normalizePageId(pageIdRaw);
  if (!pageId) {
    return null;
  }

  const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=10`, {
    headers: notionHeaders(token),
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as NotionBlockResponse;
  const blocks = data.results ?? [];
  for (const block of blocks) {
    const text = getBlockText(block);
    if (text) {
      return text;
    }
  }

  return null;
}

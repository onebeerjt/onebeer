import type { BlogPost, BlogPostSummary } from "@/lib/types/content";

type NotionRichText = { plain_text?: string };

type NotionProperty = {
  type?: string;
  title?: NotionRichText[];
  rich_text?: NotionRichText[];
  date?: { start?: string | null } | null;
  checkbox?: boolean;
  select?: { name?: string } | null;
  status?: { name?: string } | null;
};

type NotionPage = {
  id: string;
  properties?: Record<string, NotionProperty>;
};

type NotionQueryResponse = {
  results?: NotionPage[];
};

type NotionBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  paragraph?: { rich_text?: NotionRichText[] };
  heading_1?: { rich_text?: NotionRichText[] };
  heading_2?: { rich_text?: NotionRichText[] };
  heading_3?: { rich_text?: NotionRichText[] };
  quote?: { rich_text?: NotionRichText[] };
  bulleted_list_item?: { rich_text?: NotionRichText[] };
  numbered_list_item?: { rich_text?: NotionRichText[] };
  code?: { rich_text?: NotionRichText[] };
  image?: {
    type?: "external" | "file";
    external?: { url?: string };
    file?: { url?: string };
    caption?: NotionRichText[];
  };
};

type NotionBlockResponse = {
  results?: NotionBlock[];
  has_more?: boolean;
  next_cursor?: string | null;
};

export type NotionDebugInfo = {
  hasToken: boolean;
  hasDatabaseId: boolean;
  normalizedDatabaseId: string | null;
  queryOk: boolean;
  status?: number;
  code?: string;
  message?: string;
  postCount?: number;
  postTitles?: string[];
};

function getNotionEnv() {
  const token = process.env.NOTION_TOKEN;
  const databaseIdRaw = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseIdRaw) {
    return null;
  }

  const databaseId = normalizeDatabaseId(databaseIdRaw);
  if (!databaseId) {
    return null;
  }

  return { token, databaseId };
}

function normalizeDatabaseId(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  // Accept a full Notion URL or a plain database id (with or without dashes).
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

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function findTitle(page: NotionPage) {
  const properties = page.properties ?? {};

  for (const property of Object.values(properties)) {
    if (property.type === "title") {
      return richTextToPlainText(property.title);
    }
  }

  return "Untitled";
}

function findExcerpt(page: NotionPage) {
  const properties = page.properties ?? {};

  for (const [name, property] of Object.entries(properties)) {
    if (property.type === "rich_text" && /excerpt|summary|description/i.test(name)) {
      const value = richTextToPlainText(property.rich_text);
      if (value) {
        return value;
      }
    }
  }

  return "";
}

function findPublishedAt(page: NotionPage) {
  const properties = page.properties ?? {};

  for (const [name, property] of Object.entries(properties)) {
    if (property.type === "date" && /publish|date|published/i.test(name)) {
      return property.date?.start ?? null;
    }
  }

  return null;
}

function findSlug(page: NotionPage, title: string) {
  const properties = page.properties ?? {};

  for (const [name, property] of Object.entries(properties)) {
    if (/slug/i.test(name)) {
      if (property.type === "rich_text") {
        const value = richTextToPlainText(property.rich_text);
        if (value) {
          return slugify(value);
        }
      }

      if (property.type === "title") {
        const value = richTextToPlainText(property.title);
        if (value) {
          return slugify(value);
        }
      }
    }
  }

  return slugify(title) || page.id.replace(/-/g, "");
}

function isPublished(page: NotionPage) {
  const properties = page.properties ?? {};
  let sawPublishHint = false;

  for (const [name, property] of Object.entries(properties)) {
    const isPublishField = /publish|status|visible|live/i.test(name);
    if (!isPublishField) {
      continue;
    }

    sawPublishHint = true;

    if (property.type === "checkbox") {
      if (property.checkbox === true) {
        return true;
      }
      continue;
    }

    const state = (property.status?.name ?? property.select?.name ?? "").toLowerCase();
    if (["published", "live", "public", "done"].includes(state)) {
      return true;
    }
  }

  return !sawPublishHint;
}

function toSummary(page: NotionPage): BlogPostSummary {
  const title = findTitle(page);

  return {
    id: page.id,
    title,
    slug: findSlug(page, title),
    excerpt: findExcerpt(page),
    publishedAt: findPublishedAt(page)
  };
}

async function queryDatabase(): Promise<BlogPostSummary[]> {
  const env = getNotionEnv();
  if (!env) {
    return [];
  }

  const response = await fetch(`https://api.notion.com/v1/databases/${env.databaseId}/query`, {
    method: "POST",
    headers: notionHeaders(env.token),
    body: JSON.stringify({
      page_size: 50,
      sorts: [
        {
          timestamp: "last_edited_time",
          direction: "descending"
        }
      ]
    }),
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as NotionQueryResponse;

  return (data.results ?? [])
    .filter(isPublished)
    .map(toSummary)
    .filter((item) => item.title.trim().length > 0);
}

export async function getNotionDebugInfo(): Promise<NotionDebugInfo> {
  const token = process.env.NOTION_TOKEN ?? "";
  const databaseIdRaw = process.env.NOTION_DATABASE_ID ?? "";
  const normalized = databaseIdRaw ? normalizeDatabaseId(databaseIdRaw) : null;

  if (!token || !databaseIdRaw || !normalized) {
    return {
      hasToken: Boolean(token),
      hasDatabaseId: Boolean(databaseIdRaw),
      normalizedDatabaseId: normalized,
      queryOk: false,
      code: "missing_env_or_invalid_database_id",
      message: "Set NOTION_TOKEN and NOTION_DATABASE_ID (database URL or ID)."
    };
  }

  const response = await fetch(`https://api.notion.com/v1/databases/${normalized}/query`, {
    method: "POST",
    headers: notionHeaders(token),
    body: JSON.stringify({
      page_size: 10,
      sorts: [
        {
          timestamp: "last_edited_time",
          direction: "descending"
        }
      ]
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { code?: string; message?: string };
    return {
      hasToken: true,
      hasDatabaseId: true,
      normalizedDatabaseId: normalized,
      queryOk: false,
      status: response.status,
      code: body.code ?? "notion_query_failed",
      message: body.message ?? "Notion query failed."
    };
  }

  const data = (await response.json()) as NotionQueryResponse;
  const posts = (data.results ?? []).filter(isPublished).map(toSummary);

  return {
    hasToken: true,
    hasDatabaseId: true,
    normalizedDatabaseId: normalized,
    queryOk: true,
    postCount: posts.length,
    postTitles: posts.map((post) => post.title).slice(0, 10)
  };
}

function extractBlockText(block: NotionBlock) {
  switch (block.type) {
    case "paragraph":
      return richTextToPlainText(block.paragraph?.rich_text);
    case "heading_1":
      return richTextToPlainText(block.heading_1?.rich_text);
    case "heading_2":
      return richTextToPlainText(block.heading_2?.rich_text);
    case "heading_3":
      return richTextToPlainText(block.heading_3?.rich_text);
    case "quote":
      return richTextToPlainText(block.quote?.rich_text);
    case "bulleted_list_item":
      return richTextToPlainText(block.bulleted_list_item?.rich_text);
    case "numbered_list_item":
      return richTextToPlainText(block.numbered_list_item?.rich_text);
    case "code":
      return richTextToPlainText(block.code?.rich_text);
    default:
      return "";
  }
}

function mapBlocksForDisplay(blocks: NotionBlock[]) {
  return blocks
    .map((block) => {
      if (block.type === "image") {
        const url =
          block.image?.type === "external"
            ? block.image?.external?.url
            : block.image?.file?.url;
        const caption = richTextToPlainText(block.image?.caption);

        return {
          id: block.id,
          type: block.type,
          text: caption,
          url: (url ?? "").trim()
        };
      }

      return {
        id: block.id,
        type: block.type,
        text: extractBlockText(block)
      };
    })
    .filter((block) => (block.type === "image" ? (block.url ?? "").length > 0 : block.text.length > 0));
}

async function getPageBlocks(pageId: string): Promise<NotionBlock[]> {
  const env = getNotionEnv();
  if (!env) {
    return [];
  }

  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams();
    if (cursor) {
      params.set("start_cursor", cursor);
    }

    const query = params.toString();
    const url = `https://api.notion.com/v1/blocks/${pageId}/children${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
      headers: notionHeaders(env.token),
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return blocks;
    }

    const data = (await response.json()) as NotionBlockResponse;
    blocks.push(...(data.results ?? []));
    cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  const posts = await queryDatabase();
  return posts;
}

export async function getPublishedPostSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map((post) => post.slug);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPublishedPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return null;
  }

  const blocks = await getPageBlocks(post.id);

  return {
    ...post,
    content: mapBlocksForDisplay(blocks)
  };
}

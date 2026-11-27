export interface ParsedWebinarContent {
  introduction: string;
  whatYouWillExplore: string[];
  keyTakeaways: string[];
}

const EXPLORE_HEADING_RE =
  /^(?:what\s+you(?:'|’)?ll\s+explore|what\s+you\s+will\s+explore|topics?\s+(?:you(?:'|’)?ll|you\s+will)\s+explore)\s*:?\s*$/i;

const TAKEAWAYS_HEADING_RE =
  /^(?:key\s+takeaways?|what\s+you(?:'|’)?ll\s+learn|what\s+you\s+will\s+learn)\s*:?\s*$/i;

function stripListPrefix(line: string): string {
  return line
    .trim()
    .replace(/^(?:[-•*–—]|(?:\d+[.)]))\s+/, '')
    .trim();
}

function normalizeList(items?: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => (typeof item === 'string' ? stripListPrefix(item) : ''))
    .filter(Boolean);
}

/**
 * Parse a webinar's description + optional structured arrays into three clean sections:
 * 1. introduction
 * 2. whatYouWillExplore (ordered sequence of topics)
 * 3. keyTakeaways (bullet points)
 *
 * Works seamlessly with both newly structured records and legacy plain-text descriptions
 * containing inline "What You Will Explore" / "What You Will Learn" / "Key Takeaways" headings.
 */
export function parseWebinarContent(
  rawDescription?: string | null,
  explicitExplore?: unknown,
  explicitTakeaways?: unknown
): ParsedWebinarContent {
  const raw = typeof rawDescription === 'string' ? rawDescription.replace(/\r\n/g, '\n') : '';
  const lines = raw.split('\n');

  const introLines: string[] = [];
  const parsedExplore: string[] = [];
  const parsedTakeaways: string[] = [];

  let currentSection: 'intro' | 'explore' | 'takeaways' = 'intro';

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (EXPLORE_HEADING_RE.test(trimmed)) {
      currentSection = 'explore';
      continue;
    }

    if (TAKEAWAYS_HEADING_RE.test(trimmed)) {
      currentSection = 'takeaways';
      continue;
    }

    if (currentSection === 'intro') {
      introLines.push(rawLine);
    } else if (currentSection === 'explore') {
      const cleaned = stripListPrefix(trimmed);
      if (cleaned) parsedExplore.push(cleaned);
    } else if (currentSection === 'takeaways') {
      const cleaned = stripListPrefix(trimmed);
      if (cleaned) parsedTakeaways.push(cleaned);
    }
  }

  // Collapse excessive blank lines in introduction while preserving intentional paragraphs
  const introduction = introLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const normalizedExplicitExplore = normalizeList(explicitExplore);
  const normalizedExplicitTakeaways = normalizeList(explicitTakeaways);

  return {
    introduction,
    whatYouWillExplore:
      normalizedExplicitExplore.length > 0 ? normalizedExplicitExplore : parsedExplore,
    keyTakeaways:
      normalizedExplicitTakeaways.length > 0 ? normalizedExplicitTakeaways : parsedTakeaways,
  };
}

/**
 * Serialize structured webinar sections into a clean, readable description string
 * so all sections persist reliably in Supabase even when only the `description` column exists.
 */
export function composeStructuredDescription(
  introduction: string,
  whatYouWillExplore: string[],
  keyTakeaways: string[] = [],
  includeTakeawaysInDescription = true
): string {
  const sections: string[] = [];
  const cleanIntro = (introduction || '').trim();
  const cleanExplore = normalizeList(whatYouWillExplore);
  const cleanTakeaways = normalizeList(keyTakeaways);

  if (cleanIntro) {
    sections.push(cleanIntro);
  }

  if (cleanExplore.length > 0) {
    sections.push(
      `What You'll Explore\n${cleanExplore.map((topic) => `- ${topic}`).join('\n')}`
    );
  }

  if (includeTakeawaysInDescription && cleanTakeaways.length > 0) {
    sections.push(
      `Key Takeaways\n${cleanTakeaways.map((point) => `- ${point}`).join('\n')}`
    );
  }

  return sections.join('\n\n');
}

/**
 * Split a "Topic – Detail" or "Topic: Detail" line into a clean title/detail pair for display.
 */
export function splitExploreTopic(item: string): { label: string; detail?: string } {
  const trimmed = item.trim();
  const dashMatch = /^([^–—-]+?)\s+[–—-]\s+(.+)$/.exec(trimmed);
  if (dashMatch) {
    return { label: dashMatch[1].trim(), detail: dashMatch[2].trim() };
  }
  const colonMatch = /^([^:]{2,48}):\s+(.+)$/.exec(trimmed);
  if (colonMatch) {
    return { label: colonMatch[1].trim(), detail: colonMatch[2].trim() };
  }
  return { label: trimmed };
}

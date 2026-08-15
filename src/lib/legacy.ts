/**
 * Keeps the approved legacy page bodies while placing every route inside the
 * same Astro shell.  Header, footer, fonts, scripts and responsive rules must
 * have one owner; legacy documents are retained only as page-content sources.
 */
export function extractLegacyMain(documentHtml: string): string {
  const match = documentHtml.match(/<main(?:\s[^>]*)?>([\s\S]*?)<\/main>/i);
  if (!match) throw new Error('Legacy page is missing its main content region.');
  return match[1];
}

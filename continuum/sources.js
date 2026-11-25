// Source links that do not die. A passage's source is usually a Project Gutenberg book, and Gutenberg is sometimes down.
// Before a "go deeper" link is shown or opened, it is checked (a quick request, four seconds at most), and the answer
// is kept for fifteen minutes. If Gutenberg does not answer, the same book is tried elsewhere, in order: Gutenberg's
// mirrors (same book number), Standard Ebooks (the same public-domain work, by title and author), and the Internet
// Archive (its copy of the Gutenberg edition, or else the same work). If none answers, there is no link: the app
// says the source is unavailable for now and the passage stays readable. Each failure is logged by site and time only.

const CHECK_MS = 4000;
const FRESH_MS = 15 * 60_000;
export const MIRRORS = ['https://gutenberg.pglaf.org', 'https://aleph.gutenberg.org'];
// Gutenberg's mirror layout: every digit of the number but the last is a folder, then the number (45109 → 4/5/1/0/45109/).
export const mirrorPath = (id) => { const s = String(id); return `${s.length === 1 ? '0' : s.slice(0, -1).split('').join('/')}/${s}/`; };
export const gutenbergId = (url) => String(url ?? '').match(/gutenberg\.org\/(?:ebooks|cache\/epub|files)\/(\d+)/)?.[1] ?? null;

export function createSources({ fetchImpl = fetch, books = {}, onFailure = () => {}, now = () => Date.now() } = {}) {
  const checked = new Map(); // url -> { ok, at }
  const found = new Map();   // 'se:<id>' or 'ia:<id>' -> { url, at }

  // Is it up? HEAD first; some sites refuse HEAD, so then a GET (the body is not read).
  async function check(url) {
    const c = checked.get(url);
    if (c && now() - c.at < FRESH_MS) return c.ok;
    let ok = false; let why = '';
    for (const method of ['HEAD', 'GET']) {
      try {
        const res = await fetchImpl(url, { method, redirect: 'follow', signal: AbortSignal.timeout(CHECK_MS), headers: { 'user-agent': 'Continuum source check' } });
        res.body?.cancel?.().catch?.(() => {});
        if (res.status < 400) { ok = true; break; }
        why = `HTTP ${res.status}`;
        if (![403, 405, 501].includes(res.status)) break; // only a refused HEAD is worth a GET
      } catch (e) { why = e.name === 'TimeoutError' || e.name === 'AbortError' ? 'timed out' : 'unreachable'; break; }
    }
    checked.set(url, { ok, at: now() });
    if (!ok) { try { onFailure(new URL(url).hostname, why); } catch { /* a log must never break a link */ } }
    return ok;
  }

  // The same work on Standard Ebooks: their search, the first book it lists.
  async function standardEbooks(id) {
    const key = `se:${id}`; const f = found.get(key);
    if (f && now() - f.at < FRESH_MS) return f.url;
    const b = books[id]; let url = null;
    if (b?.title) {
      try {
        const q = encodeURIComponent(`${b.title} ${b.author ?? ''}`.trim());
        const res = await fetchImpl(`https://standardebooks.org/ebooks?query=${q}`, { signal: AbortSignal.timeout(CHECK_MS) });
        if (res.ok) { const m = (await res.text()).match(/href="(\/ebooks\/[a-z0-9-]+\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)"/); if (m) url = `https://standardebooks.org${m[1]}`; }
      } catch { /* not found */ }
    }
    found.set(key, { url, at: now() });
    return url;
  }
  // The Internet Archive: its copy of this Gutenberg edition (known ahead), else a search by title and author.
  async function archive(id) {
    if (books[id]?.ia) return `https://archive.org/details/${books[id].ia}`;
    const key = `ia:${id}`; const f = found.get(key);
    if (f && now() - f.at < FRESH_MS) return f.url;
    const b = books[id]; let url = null;
    if (b?.title) {
      try {
        const q = encodeURIComponent(`title:(${b.title.replace(/[():"]/g, ' ')})${b.author ? ` AND creator:(${b.author.replace(/[():"]/g, ' ')})` : ''}`);
        const res = await fetchImpl(`https://archive.org/advancedsearch.php?q=${q}&fl[]=identifier&rows=1&output=json`, { signal: AbortSignal.timeout(CHECK_MS) });
        const ident = res.ok ? (await res.json()).response?.docs?.[0]?.identifier : null;
        if (ident) url = `https://archive.org/details/${ident}`;
      } catch { /* not found */ }
    }
    found.set(key, { url, at: now() });
    return url;
  }

  // A working link for a source URL, or { ok: false }. via: where it was found.
  async function resolve(url) {
    if (!url) return { ok: false };
    const id = gutenbergId(url);
    if (await check(url)) return { ok: true, url, via: id ? 'gutenberg' : 'original', book: id ? { id, ...books[id] } : null };
    if (!id) return { ok: false };
    // On a mirror, the book's readable web page where it has one (<id>-h/<id>-h.htm), else its folder of files.
    for (const m of MIRRORS) {
      for (const u of [`${m}/${mirrorPath(id)}${id}-h/${id}-h.htm`, `${m}/${mirrorPath(id)}`]) if (await check(u)) return { ok: true, url: u, via: 'mirror', book: { id, ...books[id] } };
    }
    const se = await standardEbooks(id); if (se && await check(se)) return { ok: true, url: se, via: 'standardebooks', book: { id, ...books[id] } };
    const ia = await archive(id); if (ia && await check(ia)) return { ok: true, url: ia, via: 'archive', book: { id, ...books[id] } };
    return { ok: false, book: { id, ...books[id] } };
  }
  return { check, resolve };
}

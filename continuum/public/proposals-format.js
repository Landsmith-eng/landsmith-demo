// Turns proposals into a Markdown brief for the next verification session. Shared by the propose page's
// "Copy for Claude" button and `npm run proposals`, so both produce the same text.
const yr = (y) => (y == null ? '' : y < 0 ? `${-y} BCE` : String(y));

function end(e, nodes) {
  if (e?.id) {
    const n = nodes.get(e.id);
    return n ? `on the map: ${[n.thinker, n.title].filter(Boolean).join(' · ')} (${yr(n.year)}) \`${n.id}\`` : `on the map: \`${e.id}\``;
  }
  const i = e?.new ?? {};
  return `NEW ${i.type} in ${i.field}: "${i.title}"${i.who ? ` by ${i.who}` : ''}${i.year != null ? ` (${yr(i.year)})` : ''}`
    + `${i.as_of ? `, as of ${i.as_of}` : ''}${i.description ? `\n  - What it says: ${i.description.replace(/\n+/g, ' ')}` : ''}`;
}

export function proposalsMarkdown(proposals, nodeList, themeList, { onlyOpen = true } = {}) {
  const nodes = new Map(nodeList.map((n) => [n.id, n]));
  const themeName = new Map(themeList.map((t) => [t.id, t.name]));
  const shown = proposals.filter((p) => !onlyOpen || p.status === 'open');
  const lines = [
    '# Continuum: proposed connections',
    '',
    `${shown.length} ${onlyOpen ? 'open ' : ''}proposal${shown.length === 1 ? '' : 's'}. For each: verify the source, write the faces`,
    '(quote public-domain text verbatim; summarise anything in copyright, labelled), add the node and edge with a',
    'one-line note, give a new node a gallery room and its themes, run `npm run check`, then mark it added.',
    '',
  ];
  for (const p of shown) {
    const d = p.payload;
    lines.push(`## Proposal ${p.id} · ${p.status} · ${String(p.created_at).slice(0, 10)}`, '',
      `- Earlier idea: ${end(d.from, nodes)}`,
      `- Later idea: ${end(d.to, nodes)}`,
      `- Link: **${d.relation}**`,
      `- Why: ${d.why}`);
    if (d.sources?.length) lines.push(`- Sources: ${d.sources.join(' , ')}`);
    const ts = [...(d.themes ?? []).map((t) => themeName.get(t) ?? t), d.new_theme && `NEW THEME: ${d.new_theme}`].filter(Boolean);
    if (ts.length) lines.push(`- Themes: ${ts.join('; ')}`);
    if (p.reply) lines.push(`- Note: ${p.reply}`);
    lines.push('');
  }
  return lines.join('\n');
}

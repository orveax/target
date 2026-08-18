import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules', 'dist', '.astro']);
const textExtensions = new Set(['.astro', '.vue', '.ts', '.js', '.mjs', '.cjs', '.css', '.json', '.md', '.yml', '.yaml', '.html', '.txt', '.xml']);

function walk(dir = root) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk();
const rel = (file) => path.relative(root, file).replaceAll('\\', '/');
const textFiles = files.filter((file) => textExtensions.has(path.extname(file).toLowerCase()));
const texts = new Map(textFiles.map((file) => [rel(file), fs.readFileSync(file, 'utf8')]));

const section = (title) => console.log(`\n=== ${title} ===`);
const list = (items) => items.length ? items.forEach((item) => console.log(`- ${item}`)) : console.log('- none');

section('Repository inventory');
console.log(`Files: ${files.length}`);
console.log(`Text/code files: ${textFiles.length}`);
console.log(`Source files: ${files.filter((f) => rel(f).startsWith('src/')).length}`);
console.log(`Public assets: ${files.filter((f) => rel(f).startsWith('public/assets/')).length}`);
console.log(`Workflows: ${files.filter((f) => rel(f).startsWith('.github/workflows/')).length}`);

section('Legacy source candidates');
const legacy = files.map(rel).filter((p) => p.startsWith('src/legacy/') || p === 'src/lib/legacy.ts');
list(legacy);

section('Top-level public CSS/JS with no textual reference');
const topAssets = files
  .map(rel)
  .filter((p) => /^public\/assets\/[^/]+\.(?:css|js)$/i.test(p));
const unreferencedAssets = [];
for (const asset of topAssets) {
  const publicPath = `/${asset.replace(/^public\//, '')}`;
  const fileName = path.posix.basename(asset);
  let referenced = false;
  for (const [otherPath, content] of texts) {
    if (otherPath === asset) continue;
    if (content.includes(publicPath) || content.includes(fileName)) {
      referenced = true;
      break;
    }
  }
  if (!referenced) unreferencedAssets.push(asset);
}
list(unreferencedAssets);

section('Public images/media with no textual reference');
const media = files.map(rel).filter((p) => /^public\/(?:images|assets\/brand)\/.*\.(?:png|jpe?g|webp|avif|svg)$/i.test(p));
const unreferencedMedia = [];
for (const asset of media) {
  const publicPath = `/${asset.replace(/^public\//, '')}`;
  const fileName = path.posix.basename(asset);
  let referenced = false;
  for (const [otherPath, content] of texts) {
    if (otherPath === asset) continue;
    if (content.includes(publicPath) || content.includes(fileName)) {
      referenced = true;
      break;
    }
  }
  if (!referenced) unreferencedMedia.push(asset);
}
list(unreferencedMedia);

section('BaseLayout asset chain');
const baseLayout = texts.get('src/layouts/BaseLayout.astro') || '';
const cssRefs = [...baseLayout.matchAll(/href=["']\/assets\/([^"'?]+\.css)(?:\?[^"']*)?["']/g)].map((m) => m[1]);
const jsRefs = [...baseLayout.matchAll(/src=["']\/assets\/([^"'?]+\.js)(?:\?[^"']*)?["']/g)].map((m) => m[1]);
console.log(`CSS layers loaded: ${cssRefs.length}`);
cssRefs.forEach((p, i) => console.log(`${String(i + 1).padStart(2, '0')}. ${p}`));
console.log(`JS layers loaded: ${jsRefs.length}`);
jsRefs.forEach((p, i) => console.log(`${String(i + 1).padStart(2, '0')}. ${p}`));

section('Version-family duplication candidates');
const assetNames = topAssets.map((p) => path.posix.basename(p));
const normalize = (name) => name
  .replace(/-v\d+(?:\.\d+)?(?=\.(?:css|js)$)/i, '')
  .replace(/-(?:owner-review|owner-polish|polish|refinement|hotfix|guard|final|freeze)(?:-v?\d+)?(?=\.(?:css|js)$)/gi, '')
  .replace(/\.(css|js)$/i, '');
const groups = new Map();
for (const name of assetNames) {
  const key = normalize(name);
  const group = groups.get(key) || [];
  group.push(name);
  groups.set(key, group);
}
for (const [key, group] of [...groups].filter(([, g]) => g.length > 1).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`- ${key}: ${group.join(', ')}`);
}

section('Source import targets that do not exist');
const missingImports = [];
const sourceTexts = [...texts].filter(([p]) => p.startsWith('src/'));
for (const [file, content] of sourceTexts) {
  for (const match of content.matchAll(/(?:import|from)\s*(?:\([^)]*\)\s*)?["']([^"']+)["']/g)) {
    const spec = match[1];
    if (!spec.startsWith('.')) continue;
    const base = path.resolve(root, path.dirname(file), spec);
    const candidates = [base, `${base}.ts`, `${base}.js`, `${base}.mjs`, `${base}.astro`, `${base}.vue`, path.join(base, 'index.ts'), path.join(base, 'index.js')];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) missingImports.push(`${file} -> ${spec}`);
  }
}
list(missingImports);

section('Suspicious source markers');
const markers = [];
for (const [file, content] of texts) {
  if (!/^(src|public\/assets|scripts)\//.test(file)) continue;
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (/\b(?:TODO|FIXME|HACK|TEMPORARY|temporary|legacy)\b/.test(line)) markers.push(`${file}:${index + 1}: ${line.trim().slice(0, 180)}`);
  });
}
list(markers);

section('Summary');
console.log(`Legacy candidates: ${legacy.length}`);
console.log(`Unreferenced top-level CSS/JS: ${unreferencedAssets.length}`);
console.log(`Unreferenced media candidates: ${unreferencedMedia.length}`);
console.log(`Missing relative imports: ${missingImports.length}`);
console.log('Scanner completed. Findings are candidates until validated against build/runtime behavior.');

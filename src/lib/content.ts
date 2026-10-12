/*
 * Загрузка контента из src/content/: YAML → локализация → проверка схемой → связи и вычисляемые поля.
 * Работает только во время сборки (и в dev-сервере). Ошибки в данных останавливают сборку
 * с указанием файла и поля — битая страница не уедет на сайт.
 */
import YAML from 'yaml';
import { marked } from 'marked';
import type { z } from 'zod';
import { localePath, t, type Lang } from '@/i18n';
import {
  ProjectSchema, SiteSchema, TaxonomySchema,
  type ArtifactData, type Diagram, type ProjectData, type Site, type Taxonomy,
} from '@/content/schema';
import siteRaw from '@/content/site.yaml?raw';
import taxonomyRaw from '@/content/taxonomy.yaml?raw';

const projectFiles = import.meta.glob<string>('/src/content/projects/*/project.yaml', { query: '?raw', import: 'default', eager: true });
const textFiles = import.meta.glob<string>('/src/content/projects/*/artifacts/*.{md,yaml,yml,json,txt,sql,puml,plantuml,mmd,xml,graphql,proto,ts,js,py,go,java,cs}', { query: '?raw', import: 'default', eager: true });
const assetFiles = import.meta.glob<string>('/src/content/projects/*/artifacts/*.{png,jpg,jpeg,webp,gif,svg,pdf}', { query: '?url', import: 'default', eager: true });

/* ---------- локализация ---------- */
const isLocalized = (v: unknown): v is { ru: unknown; en?: unknown } => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const keys = Object.keys(v);
  return keys.includes('ru') && keys.every((k) => k === 'ru' || k === 'en');
};

/** Заменяет все объекты { ru, en } значением нужного языка (с откатом на ru). */
function localize(v: unknown, lang: Lang, path: string, missing: string[]): unknown {
  if (isLocalized(v)) {
    if (lang !== 'ru' && (v as Record<string, unknown>)[lang] == null && v.ru != null) missing.push(path);
    const picked = (v as Record<string, unknown>)[lang] ?? v.ru;
    return localize(picked, lang, path, missing);
  }
  if (Array.isArray(v)) return v.map((x, i) => localize(x, lang, `${path}[${i}]`, missing));
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) out[k] = localize(x, lang, path ? `${path}.${k}` : k, missing);
    return out;
  }
  return v;
}

function parseYaml(raw: string, file: string): unknown {
  try { return YAML.parse(raw); } catch (e) { throw new Error(`[content] ${file}: ошибка YAML — ${(e as Error).message}`); }
}

function validate<T extends z.ZodType>(schema: T, data: unknown, file: string): z.infer<T> {
  const r = schema.safeParse(data);
  if (r.success) return r.data;
  const msg = r.error.issues.map((i) => `  • ${i.path.join('.') || '(корень)'}: ${i.message}`).join('\n');
  throw new Error(`[content] ${file}: данные не соответствуют схеме\n${msg}`);
}

/* ---------- модели ---------- */
export type Artifact = ArtifactData & {
  projectId: string;
  typeLabel: string;
  typeCode: string;
  icon: string;
  format: string;
  size: string;
  metaLine: string;
  href: string;
  fileName: string | null;
  ext: string | null;
  md: string | null;
  html: string | null;
  source: string | null;
  src: string | null;
  diagramData: Diagram | null;
};

export type Project = Omit<ProjectData, 'artifacts'> & {
  id: string;
  href: string;
  categoryLabel: string;
  statusLabel: string;
  techList: { id: string; label: string }[];
  artifacts: Artifact[];
  diagram: (id?: string) => Diagram | null;
};

export type Content = {
  lang: Lang;
  site: Site;
  taxonomy: Taxonomy;
  projects: Project[];
  project: (id: string) => Project | null;
  hasDemo: boolean;
};

const VIEW_ICON: Record<string, string> = { doc: 'article', code: 'code', erd: 'grid', components: 'layout', flow: 'git-branch', image: 'eye', pdf: 'file', link: 'external-link' };

const kb = (s: string) => Math.max(1, Math.round(new TextEncoder().encode(s).length / 1024)) + ' KB';

function renderMarkdown(md: string): string {
  const html = marked.parse(md, { async: false, gfm: true }) as string;
  // внешние ссылки открываются в новой вкладке
  return html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}

function buildArtifact(a: ArtifactData, p: { id: string; diagrams: Diagram[]; href: string }, lang: Lang, tax: Taxonomy, errors: string[]): Artifact {
  const T = t(lang).artifact;
  const dir = `/src/content/projects/${p.id}/artifacts/`;
  const where = `projects/${p.id}/project.yaml → artifacts.${a.id}`;
  const type = tax.artifactTypes.find((x) => x.id === a.type);
  if (!type) errors.push(`${where}: неизвестный type «${a.type}»`);
  const diagramData = a.diagram ? p.diagrams.find((d) => d.id === a.diagram) || null : null;
  if (a.diagram && !diagramData) errors.push(`${where}: нет диаграммы «${a.diagram}»`);
  if (['erd', 'components', 'flow'].includes(a.view) && (!diagramData || diagramData.kind !== a.view)) errors.push(`${where}: для view «${a.view}» нужна диаграмма того же вида`);

  let md: string | null = null, html: string | null = null, source: string | null = null, src: string | null = null;
  let fileName: string | null = null, ext: string | null = null, format = a.format, size = a.size;

  if (a.view === 'doc') {
    md = textFiles[`${dir}${a.id}.${lang}.md`] ?? textFiles[`${dir}${a.id}.ru.md`] ?? null;
    if (md == null) errors.push(`${where}: нет файла artifacts/${a.id}.ru.md`);
    else { html = renderMarkdown(md); fileName = a.id + '.md'; ext = 'md'; format ??= T.format.doc; size ??= kb(md); }
  } else if (a.view === 'code') {
    source = a.file ? textFiles[dir + a.file] ?? null : null;
    if (source == null) errors.push(`${where}: нет файла с кодом (поле file: «${a.file ?? ''}»)`);
    else { fileName = a.file!; ext = a.file!.split('.').pop() || 'txt'; format ??= ext.toUpperCase(); size ??= kb(source); }
  } else if (a.view === 'image' || a.view === 'pdf') {
    src = a.file ? assetFiles[dir + a.file] ?? null : null;
    if (src == null) errors.push(`${where}: нет файла «${a.file ?? ''}» в папке artifacts/`);
    format ??= a.view === 'pdf' ? T.format.pdf : T.format.image;
  } else if (a.view === 'link') {
    if (!a.href) errors.push(`${where}: для view «link» нужно поле href`);
    format ??= T.format.link;
    try { size ??= new URL(a.href || '').host; } catch { /* оставим пустым */ }
  } else if (diagramData) {
    fileName = a.id + '.json'; ext = 'json'; format ??= T.format.diagram;
    size ??= diagramData.kind === 'components' ? T.nodes(diagramData.nodes.length)
      : diagramData.kind === 'erd' ? T.entities(diagramData.entities.length) : T.steps(diagramData.steps.length);
  }

  return {
    ...a,
    projectId: p.id,
    typeLabel: type?.label ?? a.type,
    typeCode: type?.code ?? '',
    icon: VIEW_ICON[a.view] || 'file',
    format: format ?? '',
    size: size ?? '',
    metaLine: [format, size].filter(Boolean).join(' · '),
    href: `${p.href}?tab=artifacts&doc=${a.id}`,
    fileName, ext, md, html, source, src, diagramData,
  };
}

function load(lang: Lang): Content {
  const missing: string[] = [];
  const errors: string[] = [];
  const site = validate(SiteSchema, localize(parseYaml(siteRaw, 'site.yaml'), lang, 'site', missing), 'src/content/site.yaml');
  const taxonomy = validate(TaxonomySchema, localize(parseYaml(taxonomyRaw, 'taxonomy.yaml'), lang, 'taxonomy', missing), 'src/content/taxonomy.yaml');

  const projects: Project[] = Object.entries(projectFiles).map(([file, raw]) => {
    const id = file.split('/').at(-2)!;
    const rel = `src/content/projects/${id}/project.yaml`;
    const data = validate(ProjectSchema, localize(parseYaml(raw, rel), lang, id, missing), rel);
    const href = localePath(lang, `/works/${id}/`);
    const where = `projects/${id}/project.yaml`;
    const diagram = (did?: string) => (did ? data.diagrams.find((d) => d.id === did) || null : null);
    const cat = taxonomy.categories.find((c) => c.id === data.category);
    const st = taxonomy.statuses.find((s) => s.id === data.status);
    if (!cat) errors.push(`${where}: неизвестная category «${data.category}»`);
    if (!st) errors.push(`${where}: неизвестный status «${data.status}»`);
    data.tech.forEach((x) => { if (!taxonomy.technologies.some((tt) => tt.id === x)) errors.push(`${where}: технология «${x}» не описана в taxonomy.yaml`); });
    const refs = [data.cover, data.architecture?.diagram, data.dataModel?.diagram, ...(data.architecture?.flows ?? [])];
    refs.forEach((r) => { if (r && !diagram(r)) errors.push(`${where}: нет диаграммы «${r}»`); });
    const dupe = data.artifacts.map((a) => a.id).find((x, i, arr) => arr.indexOf(x) !== i);
    if (dupe) errors.push(`${where}: повторяется id артефакта «${dupe}»`);
    return {
      ...data,
      id, href,
      categoryLabel: cat?.label ?? data.category,
      statusLabel: st?.label ?? data.status,
      techList: data.tech.map((x) => ({ id: x, label: taxonomy.technologies.find((tt) => tt.id === x)?.label ?? x })),
      artifacts: data.artifacts.map((a) => buildArtifact(a, { id, diagrams: data.diagrams, href }, lang, taxonomy, errors)),
      diagram,
    };
  }).sort((a, b) => a.order - b.order || a.code.localeCompare(b.code));

  const ids = new Set(projects.map((p) => p.id));
  projects.forEach((p) => (p.related ?? []).forEach((r) => { if (!ids.has(r)) errors.push(`projects/${p.id}/project.yaml: связанный проект «${r}» не найден`); }));

  if (errors.length) throw new Error('[content] Ошибки в контенте:\n' + errors.map((e) => '  • ' + e).join('\n'));
  if (missing.length && lang !== 'ru') {
    console.warn(`[content] Нет перевода (${lang}) для ${missing.length} полей — показан русский текст:\n` + missing.slice(0, 15).map((m) => '  • ' + m).join('\n') + (missing.length > 15 ? `\n  … и ещё ${missing.length - 15}` : ''));
  }

  const byId = new Map(projects.map((p) => [p.id, p]));
  return { lang, site, taxonomy, projects, project: (id) => byId.get(id) ?? null, hasDemo: projects.some((p) => p.demo) };
}

const cache = new Map<Lang, Content>();
export function getContent(lang: Lang): Content {
  if (!import.meta.env.DEV && cache.has(lang)) return cache.get(lang)!;
  const c = load(lang);
  cache.set(lang, c);
  return c;
}

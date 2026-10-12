/*
 * View-модели: из контента собираются простые объекты для компонентов.
 * Всё здесь сериализуемо, потому что передаётся в React-островки как props.
 */
import { localePath, pad2, t, type Lang } from '@/i18n';
import type { Artifact, Content, Project } from './content';
import type { ComponentsDiagram, ErdDiagram, FlowDiagram } from '@/content/schema';
import type { BadgeVariant } from '@/components/ds/Display';

export type BadgeVM = { label: string; variant: BadgeVariant; dot: boolean; pulse: boolean };
export type LinkVM = { label: string; href: string; icon: string; external: boolean };

const BADGE: Record<string, Omit<BadgeVM, 'label'>> = {
  live: { variant: 'outline', dot: false, pulse: false },
  wip: { variant: 'solid', dot: true, pulse: true },
  concept: { variant: 'dashed', dot: false, pulse: false },
  archive: { variant: 'subtle', dot: false, pulse: false },
};

export const badgeOf = (p: Project): BadgeVM => ({ label: p.statusLabel, ...(BADGE[p.status] ?? BADGE.live) });

export function projectLinks(p: Project, lang: Lang): LinkVM[] {
  const T = t(lang).card;
  const out: LinkVM[] = [];
  const l = p.links ?? {};
  if (l.demo) out.push({ label: T.linkDemo, href: l.demo, icon: 'external-link', external: true });
  if (l.repo) out.push({ label: T.linkRepo, href: l.repo, icon: 'github', external: true });
  if (l.docs === 'artifacts' && p.artifacts.length) out.push({ label: T.linkDocs, href: p.href + '?tab=artifacts', icon: 'file', external: false });
  else if (l.docs && l.docs !== 'artifacts') out.push({ label: T.linkDocs, href: l.docs, icon: 'file', external: /^https?:/.test(l.docs) });
  return out;
}

export type CardVM = {
  id: string; href: string; code: string; year: number; categoryLabel: string; category: string;
  title: string; summary: string; demo: boolean; badge: BadgeVM;
  tech: string[]; techList: { id: string; label: string }[];
  coverNodes: ComponentsDiagram['nodes']; coverLinks: ComponentsDiagram['links'];
  links: LinkVM[];
  search: string;
};

export function cardVM(p: Project, lang: Lang): CardVM {
  const cover = p.diagram(p.cover);
  const comp = cover && cover.kind === 'components' ? cover : null;
  return {
    id: p.id, href: p.href, code: p.code, year: p.year, categoryLabel: p.categoryLabel, category: p.category,
    title: p.title, summary: p.summary, demo: p.demo, badge: badgeOf(p),
    tech: p.tech, techList: p.techList,
    coverNodes: comp?.nodes ?? [], coverLinks: comp?.links ?? [],
    links: projectLinks(p, lang),
    search: [p.title, p.summary, p.overview ?? '', p.code].join(' '),
  };
}

/* ---------- страница проекта ---------- */
export type ArtifactVM = Artifact;
export type FlowVM = { idx: string; title: string; diagram: FlowDiagram };
export type DecisionVM = { idx: string; title: string; choice?: string; why?: string; alternatives?: string; pros?: string; cons?: string };

export type OverviewRow =
  | { kind: 'text'; title: string; text: string; sub?: string }
  | { kind: 'list'; title: string; items: { idx: string; text: string }[] }
  | { kind: 'chips'; title: string; items: string[] }
  | { kind: 'reqs'; title: string; items: { id: string; text: string; priority?: string }[] }
  | { kind: 'scenarios'; title: string; items: { title: string; actor?: string; steps: { idx: string; text: string }[] }[] }
  | { kind: 'stages'; title: string; items: { period: string; title: string; text?: string }[] }
  | { kind: 'challenges'; title: string; items: { title: string; text: string }[] }
  | { kind: 'stack'; title: string; items: { text: string; href: string }[] };

export type ProjectBodyVM = {
  lang: Lang;
  slug: string;
  code: string;
  rows: OverviewRow[];
  arch: {
    components: { diagram: ComponentsDiagram; text?: string; fig: string; items: { id: string; idx: string; label: string; note: string }[] } | null;
    flows: FlowVM[];
    erd: { idx: string; diagram: ErdDiagram; text?: string } | null;
    api: { idx: string; endpoints: { method: string; path: string; text?: string }[]; integrations: { name: string; protocol?: string; text?: string }[] } | null;
    decisions: { idx: string; items: DecisionVM[] } | null;
  } | null;
  artifacts: ArtifactVM[];
  /** Экраны интерфейса (артефакты type: ui, view: image) — галерея в начале «Обзора». */
  screens: ArtifactVM[];
};

export function projectBodyVM(p: Project, c: Content): ProjectBodyVM {
  const lang = c.lang;
  const T = t(lang).project;
  const R = T.rows;
  const rows: OverviewRow[] = [];
  if (p.problem) rows.push({ kind: 'text', title: R.problem, text: p.problem });
  if (p.overview) rows.push({ kind: 'text', title: R.solution, text: p.overview, sub: p.purpose });
  if (p.goals?.length) rows.push({ kind: 'list', title: R.goals, items: p.goals.map((g, i) => ({ idx: pad2(i + 1), text: g })) });
  if (p.features?.length) rows.push({ kind: 'chips', title: R.features, items: p.features });
  if (p.requirements?.length) rows.push({ kind: 'reqs', title: R.requirements, items: p.requirements });
  if (p.scenarios?.length) rows.push({ kind: 'scenarios', title: R.scenarios, items: p.scenarios.map((s) => ({ ...s, steps: s.steps.map((x, j) => ({ idx: pad2(j + 1), text: x })) })) });
  if (p.stages?.length) rows.push({ kind: 'stages', title: R.stages, items: p.stages });
  if (p.challenges?.length) rows.push({ kind: 'challenges', title: R.challenges, items: p.challenges });
  const res = p.results ?? {};
  if (res.text || res.state) rows.push({ kind: 'text', title: R.results, text: (res.text || res.state)!, sub: res.text ? res.state : undefined });
  rows.push({ kind: 'stack', title: R.tech, items: p.techList.map((x) => ({ text: x.label, href: localePath(lang, '/works/') + '?tech=' + x.id })) });

  // Раздел «Архитектура»: номера параграфов идут по порядку, пустые блоки не показываются
  const comp = p.diagram(p.architecture?.diagram);
  const components = comp && comp.kind === 'components' ? comp : null;
  let k = components ? 1 : 0;
  const flows: FlowVM[] = (p.architecture?.flows ?? []).map((id) => p.diagram(id)).filter((d): d is FlowDiagram => !!d && d.kind === 'flow')
    .map((d) => ({ idx: '2.' + ++k, title: d.title, diagram: d }));
  const erdD = p.diagram(p.dataModel?.diagram);
  const erd = erdD && erdD.kind === 'erd' ? { idx: '2.' + ++k, diagram: erdD, text: p.dataModel?.text } : null;
  const endpoints = p.api?.endpoints ?? [];
  const integrations = p.api?.integrations ?? [];
  const api = endpoints.length || integrations.length ? { idx: '2.' + ++k, endpoints, integrations } : null;
  const dec = (p.decisions ?? []).map((d, i) => ({
    idx: pad2(i + 1), title: d.title, choice: d.choice, why: d.why, alternatives: d.alternatives,
    pros: d.pros?.length ? d.pros.join('; ') : undefined, cons: d.cons?.length ? d.cons.join('; ') : undefined,
  }));
  const decisions = dec.length ? { idx: '2.' + ++k, items: dec } : null;
  const hasArch = !!(components || flows.length || erd || api || decisions);

  return {
    lang, slug: p.id, code: p.code, rows,
    arch: hasArch ? {
      components: components ? {
        diagram: components, text: p.architecture?.text, fig: p.code.slice(-2),
        items: components.nodes.map((n, i) => ({ id: n.id, idx: pad2(i + 1), label: n.label, note: components.notes?.[n.id] || n.sub || '—' })),
      } : null,
      flows, erd, api, decisions,
    } : null,
    artifacts: p.artifacts.map((a) => ({ ...a })),
    screens: p.artifacts.filter((a) => a.type === 'ui' && a.view === 'image' && a.src).map((a) => ({ ...a })),
  };
}

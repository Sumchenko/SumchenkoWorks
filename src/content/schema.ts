/*
 * Схема контента. Описывает уже локализованные данные: в YAML любое текстовое поле можно записать
 * либо строкой (одинаково для обоих языков), либо объектом { ru: ..., en: ... }.
 * Если перевода нет, на английской версии показывается русский текст, а сборка печатает предупреждение.
 */
import { z } from 'zod';

const str = z.string();
const nullableStr = z.string().nullable().optional();

/* ---------- справочники ---------- */
export const TaxonomySchema = z.object({
  categories: z.array(z.object({ id: str, label: str, text: str })),
  statuses: z.array(z.object({ id: str, label: str })),
  technologies: z.array(z.object({ id: str, label: str, group: str })),
  artifactTypes: z.array(z.object({ id: str, code: str, label: str })),
});

/* ---------- сайт и профиль ---------- */
const Link = z.object({ id: str, label: str, href: nullableStr, icon: str });

export const SiteSchema = z.object({
  name: str,
  tagline: str,
  description: str,
  profile: z.object({
    name: nullableStr,
    location: nullableStr,
    headline: str,
    summary: str,
    principles: z.array(z.object({ title: str, text: str })),
    skills: z.object({ placeholder: z.boolean().optional(), groups: z.array(z.object({ title: str, items: z.array(str) })) }),
    tools: z.object({ placeholder: z.boolean().optional(), items: z.array(str) }),
    links: z.array(Link),
  }),
  lifecycle: z.object({
    title: str,
    text: str,
    stages: z.array(z.object({ code: str, short: str, name: str, text: str, input: str, output: str })).length(6),
  }),
});

/* ---------- диаграммы ---------- */
const IsoNode = z.object({ id: str, label: str, sub: str.optional(), x: z.number(), y: z.number(), w: z.number(), d: z.number(), h: z.number() });

export const DiagramSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('components'), id: str, title: str,
    nodes: z.array(IsoNode),
    links: z.array(z.tuple([str, str])),
    notes: z.record(str, str).optional(),
  }),
  z.object({
    kind: z.literal('erd'), id: str, title: str,
    entities: z.array(z.object({ id: str, name: str, fields: z.array(z.union([z.tuple([str, str]), z.tuple([str, str, z.enum(['PK', 'FK', 'UK'])])])) })),
    relations: z.array(z.union([z.tuple([str, str]), z.tuple([str, str, str])])),
  }),
  z.object({
    kind: z.literal('flow'), id: str, title: str,
    steps: z.array(z.object({ lane: str, title: str, text: str.optional() })),
  }),
]);

/* ---------- артефакты ---------- */
export const ArtifactSchema = z.object({
  id: str,
  code: str,
  type: str,
  view: z.enum(['doc', 'code', 'erd', 'components', 'flow', 'image', 'pdf', 'link']),
  title: str,
  summary: str,
  version: str.optional(),
  updated: str.optional(),
  format: str.optional(),
  size: str.optional(),
  diagram: str.optional(), // erd / components / flow
  file: str.optional(), // code / image / pdf: имя файла в папке artifacts/
  href: str.optional(), // link
  demo: z.boolean().optional(),
});

/* ---------- проект ---------- */
const Decision = z.object({
  title: str,
  choice: str.optional(),
  why: str.optional(),
  alternatives: str.optional(),
  pros: z.array(str).optional(),
  cons: z.array(str).optional(),
});

export const ProjectSchema = z.object({
  code: str,
  order: z.number().default(100),
  demo: z.boolean().default(false),
  featured: z.boolean().default(false),
  title: str,
  summary: str,
  category: str,
  status: str,
  year: z.number(),
  period: str.optional(),
  role: str.optional(),
  tech: z.array(str).default([]),
  cover: str.optional(),
  links: z.object({ demo: nullableStr, repo: nullableStr, docs: nullableStr }).partial().default({}),

  problem: str.optional(),
  overview: str.optional(),
  purpose: str.optional(),
  goals: z.array(str).optional(),
  features: z.array(str).optional(),
  requirements: z.array(z.object({ id: str, type: str.optional(), text: str, priority: str.optional() })).optional(),
  scenarios: z.array(z.object({ title: str, actor: str.optional(), steps: z.array(str) })).optional(),
  stages: z.array(z.object({ period: str, title: str, text: str.optional() })).optional(),
  challenges: z.array(z.object({ title: str, text: str })).optional(),
  results: z.object({ text: str.optional(), state: str.optional() }).optional(),

  architecture: z.object({ diagram: str.optional(), text: str.optional(), flows: z.array(str).optional() }).optional(),
  dataModel: z.object({ diagram: str, text: str.optional() }).optional(),
  api: z.object({
    endpoints: z.array(z.object({ method: str, path: str, text: str.optional() })).optional(),
    integrations: z.array(z.object({ name: str, protocol: str.optional(), text: str.optional() })).optional(),
  }).optional(),
  decisions: z.array(Decision).optional(),
  related: z.array(str).optional(),

  diagrams: z.array(DiagramSchema).default([]),
  artifacts: z.array(ArtifactSchema).default([]),
});

export type Taxonomy = z.infer<typeof TaxonomySchema>;
export type Site = z.infer<typeof SiteSchema>;
export type Diagram = z.infer<typeof DiagramSchema>;
export type ComponentsDiagram = Extract<Diagram, { kind: 'components' }>;
export type ErdDiagram = Extract<Diagram, { kind: 'erd' }>;
export type FlowDiagram = Extract<Diagram, { kind: 'flow' }>;
export type ArtifactData = z.infer<typeof ArtifactSchema>;
export type ProjectData = z.infer<typeof ProjectSchema>;

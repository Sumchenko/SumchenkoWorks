import { t, type Lang } from '@/i18n';
import type { ArtifactVM } from '@/lib/vm';
import { Button } from '@/components/ds/Button';
import { IsoDiagram } from '@/components/ds/IsoDiagram';
import { Icon } from '@/components/ds/Icon';
import { copyText, downloadText } from '@/lib/client';
import { ErdView } from './ErdView';
import { FlowView } from './FlowView';

const MIME: Record<string, string> = { md: 'text/markdown', yaml: 'text/yaml', yml: 'text/yaml', json: 'application/json' };

/* Просмотр артефакта в окне: документ, код с номерами строк, диаграммы, изображение, PDF или внешняя ссылка. */
export function ArtifactViewer({ a, lang }: { a: ArtifactVM; lang: Lang }) {
  const L = t(lang);
  const T = L.artifact;
  const d = a.diagramData;
  const copyTexts = (done: string) => ({ done, fail: L.toast.copyFail, failMsg: L.toast.copyFailMsg, close: L.close });
  const saveTexts = { done: L.toast.saved, fail: L.toast.saveFail, close: L.close };

  const download = () => {
    if (!a.fileName || !a.ext) return;
    const text = a.view === 'doc' ? `# ${a.code} ${a.title}\n\n${a.md ?? ''}` : a.view === 'code' ? a.source ?? '' : JSON.stringify(d, null, 2);
    downloadText(a.fileName, text, MIME[a.ext] || 'text/plain', saveTexts);
  };
  const lines = a.view === 'code' ? (a.source ?? '').replace(/\n$/, '').split('\n') : [];
  let host = '';
  try { host = a.href ? new URL(a.href).host : ''; } catch { host = a.href || ''; }
  const meta = [a.typeLabel, a.metaLine, a.version ? 'v' + a.version : '', a.updated].filter(Boolean).join(' · ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="sw-label">{meta}</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {a.ext && (a.view !== 'image' && a.view !== 'pdf') ? <Button size="sm" iconStart="download" onClick={download}>{T.download(a.ext)}</Button> : null}
          {(a.view === 'image' || a.view === 'pdf') && a.src ? <Button size="sm" iconStart="download" href={a.src} download={a.file}>{T.download(a.file?.split('.').pop() || '')}</Button> : null}
          {a.view === 'code' ? <Button variant="secondary" size="sm" iconStart="copy" onClick={() => copyText(a.source ?? '', copyTexts(L.toast.codeCopied))}>{T.copy}</Button> : null}
          {a.view === 'link' && a.href ? <Button size="sm" href={a.href} target="_blank" rel="noopener noreferrer" iconEnd="external-link">{T.open}</Button> : null}
          <Button variant="ghost" size="sm" iconStart="link" onClick={() => copyText(location.href, copyTexts(L.toast.linkCopied))}>{T.link}</Button>
        </div>
      </div>
      <p style={{ fontSize: 15, color: 'var(--fg-2)', maxWidth: '64ch' }}>{a.summary}</p>

      {a.view === 'doc' && a.html ? <div className="sw-doc" dangerouslySetInnerHTML={{ __html: a.html }} /> : null}

      {a.view === 'code' ? (
        <figure style={{ margin: 0, border: '1px solid var(--line)', background: 'var(--surface)' }}>
          <figcaption style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--line)' }}>
            <span className="sw-label">{a.fileName}</span><span className="sw-label">{T.lines(lines.length)}</span>
          </figcaption>
          <div style={{ overflow: 'auto', maxHeight: '56vh' }}>
            <pre style={{ margin: 0, padding: '16px 0', fontSize: 13, lineHeight: 1.65, minWidth: 'max-content' }}>
              {lines.map((ln, k) => (
                <span key={k} style={{ display: 'grid', gridTemplateColumns: '52px auto' }}>
                  <span aria-hidden="true" style={{ color: 'var(--fg-3)', textAlign: 'right', paddingRight: 18, userSelect: 'none' }}>{k + 1}</span>
                  <span style={{ whiteSpace: 'pre', paddingRight: 24 }}>{ln || ' '}</span>
                </span>
              ))}
            </pre>
          </div>
        </figure>
      ) : null}

      {a.view === 'erd' && d?.kind === 'erd' ? <div style={{ padding: 'clamp(12px,2vw,24px)', border: '1px solid var(--line)' }}><ErdView diagram={d} lang={lang} /></div> : null}
      {a.view === 'flow' && d?.kind === 'flow' ? <div style={{ padding: 'clamp(20px,3vw,32px)', border: '1px solid var(--line)', background: 'var(--surface)' }}><FlowView diagram={d} lang={lang} /></div> : null}
      {a.view === 'components' && d?.kind === 'components' ? (
        <figure style={{ margin: 0, border: '1px solid var(--line)', background: 'var(--surface)', padding: '40px 16px 24px', position: 'relative' }}>
          <figcaption className="sw-label" style={{ position: 'absolute', top: 12, left: 16 }}>{a.code} — {d.title}</figcaption>
          <div className="diagram-scroll"><IsoDiagram nodes={d.nodes} links={d.links} unit={28} label={d.title} style={{ maxHeight: '50vh' }} /></div>
        </figure>
      ) : null}
      {a.view === 'image' && a.src ? (
        <figure style={{ margin: 0, border: '1px solid var(--line)', background: 'var(--surface)', padding: 16 }}>
          <img src={a.src} alt={a.title} style={{ maxWidth: '100%', maxHeight: '60vh', margin: '0 auto', objectFit: 'contain' }} />
        </figure>
      ) : null}
      {a.view === 'pdf' && a.src ? <iframe src={a.src} title={a.title} style={{ width: '100%', height: '60vh', border: '1px solid var(--line)', background: 'var(--surface)' }} /> : null}
      {a.view === 'link' && a.href ? (
        <a href={a.href} target="_blank" rel="noopener noreferrer" className="row-link" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 32px', alignItems: 'center', justifyContent: 'space-between', padding: 28, border: '1px dashed var(--line-strong)' }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span className="sw-label">{T.external}</span><span className="sw-mono" style={{ fontSize: 'clamp(16px,2vw,20px)' }}>{host}</span></span>
          <Icon name="external-link" size={24} />
        </a>
      ) : null}
    </div>
  );
}

import { createElement, useEffect, useState } from 'react';
import { PixelField } from '@/components/ds/PixelField';
import { PixelLogo } from '@/components/ds/PixelLogo';

const sizeFor = (w: number) => Math.max(170, Math.min(240, Math.round(w * 0.2)));

/* Пиксельное поле и знак SW, пиксели которого разлетаются от курсора. До загрузки JS виден статичный знак. */
export default function HeroVisual() {
  const [ready, setReady] = useState(false);
  const [size, setSize] = useState(240);
  useEffect(() => {
    import('@/scripts/sw-logo-burst.js').then(() => setReady(true));
    const rs = () => setSize(sizeFor(window.innerWidth));
    rs();
    window.addEventListener('resize', rs);
    return () => window.removeEventListener('resize', rs);
  }, []);
  return (
    <>
      <PixelField height="100%" cell={16} radius={120} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'relative', padding: 24, background: 'var(--bg)' }}>
        {ready ? createElement('sw-logo-burst', { size: String(size) }) : <PixelLogo size={size} />}
      </div>
    </>
  );
}

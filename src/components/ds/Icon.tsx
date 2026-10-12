import type { CSSProperties, SVGProps } from 'react';
import { ICON_PATHS } from './icon-paths';

export type IconName = keyof typeof ICON_PATHS;

type Props = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: string;
  size?: number;
  title?: string;
  style?: CSSProperties;
};

export function Icon({ name, size = 16, title, style, ...rest }: Props) {
  const ds = ICON_PATHS[name];
  if (!ds) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      shapeRendering="crispEdges"
      style={{ display: 'inline-block', flex: 'none', verticalAlign: 'middle', ...style }}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {ds.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

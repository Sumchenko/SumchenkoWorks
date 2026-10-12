import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  iconStart?: string;
  iconEnd?: string;
  block?: boolean;
  href?: string;
  className?: string;
  children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>;

export function Button({ variant = 'primary', size = 'md', iconStart, iconEnd, block = false, href, className = '', children, ...rest }: ButtonProps) {
  const iconSize = size === 'sm' ? 14 : 16;
  const props = {
    className: ('sw-btn ' + className).trim(),
    'data-variant': variant,
    'data-size': size,
    'data-block': block ? 'true' : undefined,
    ...rest,
  };
  const inner = (
    <>
      {iconStart ? <span className="sw-btn__icon" data-slot="start"><Icon name={iconStart} size={iconSize} /></span> : null}
      {children != null ? <span>{children}</span> : null}
      {iconEnd ? <span className="sw-btn__icon" data-slot="end"><Icon name={iconEnd} size={iconSize} /></span> : null}
    </>
  );
  if (href) return <a href={href} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>{inner}</a>;
  return <button type="button" {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>{inner}</button>;
}

type IconButtonProps = {
  icon: string;
  label: string;
  variant?: 'outline' | 'solid' | 'bare';
  size?: 'sm' | 'md' | 'lg';
  pressed?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ icon, label, variant = 'outline', size = 'md', pressed, className = '', ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      className={('sw-iconbtn ' + className).trim()}
      data-variant={variant}
      data-size={size}
      aria-label={label}
      title={label}
      aria-pressed={pressed == null ? undefined : pressed}
      {...rest}
    >
      <Icon name={icon} size={size === 'lg' ? 24 : 16} />
    </button>
  );
}

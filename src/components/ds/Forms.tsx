import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import { Icon } from './Icon';

export function Field({ label, hint, htmlFor, children }: { label?: ReactNode; hint?: ReactNode; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="sw-field">
      {label ? <label className="sw-field__label" htmlFor={htmlFor}><span>{label}</span></label> : null}
      {children}
      {hint ? <div className="sw-field__hint">{hint}</div> : null}
    </div>
  );
}

export function Input({ label, hint, icon, className = '', ...rest }:
  { label?: ReactNode; hint?: ReactNode; icon?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const control = <input id={id} className={('sw-input ' + className).trim()} data-has-prefix={icon ? 'true' : undefined} {...rest} />;
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      {icon ? (
        <div className="sw-input-wrap">
          <span className="sw-input-wrap__prefix"><Icon name={icon} size={16} /></span>
          {control}
        </div>
      ) : control}
    </Field>
  );
}

export function Select({ label, hint, options, className = '', ...rest }:
  { label?: ReactNode; hint?: ReactNode; options: { value: string; label: string }[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className="sw-select-wrap">
        <select id={id} className={('sw-select ' + className).trim()} {...rest}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="sw-select-wrap__chev"><Icon name="chevron-down" size={16} /></span>
      </div>
    </Field>
  );
}

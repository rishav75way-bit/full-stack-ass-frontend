
function join(
  value: string | number | boolean | undefined | null | unknown[] | Record<string, boolean | undefined | null>
): string {
  if (value == null || value === false) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return (value as any[]).map(join).filter(Boolean).join(' ');
  return Object.keys(value).filter((k) => (value as Record<string, boolean | undefined | null>)[k]).join(' ');
}

export function cn(
  ...inputs: (string | number | boolean | undefined | null | unknown[] | Record<string, boolean | undefined | null>)[]
): string {
  return inputs
    .map((x) => join(x))
    .filter(Boolean)
    .join(' ');
}

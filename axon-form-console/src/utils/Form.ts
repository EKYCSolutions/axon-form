/* eslint-disable @typescript-eslint/no-explicit-any */

export function stableStringify(obj: any) {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

export function getFieldArrayChanges(original: any[], current: any[]) {
  const added = current.filter((c) => !c.id);
  const deleted = original.filter((o) => !current.some((c) => c.id === o.id));

  const updated = current.filter((c) => {
    if (!c.id) return false;
    const orig = original.find((o) => o.id === c.id);
    if (!orig) return false;

    return stableStringify(orig) !== stableStringify(c);
  });

  return { added, deleted, updated };
}

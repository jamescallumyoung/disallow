export type DisallowList = {
  disallow: Array<string>;
};

const isArrayOfStrings = (u: unknown): u is Array<string> =>
  Array.isArray(u) &&
  u.every(entry => typeof entry === 'string');

export const isDisallowList = (u: unknown): u is DisallowList =>
  isArrayOfStrings((u as any)?.disallow);

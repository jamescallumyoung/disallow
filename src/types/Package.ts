export type Package = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const isRecordOfStrings = (u: unknown): u is Record<string, string> =>
  u != undefined &&
  typeof u === "object" &&
  Object.values(u).every((dep) => typeof dep === "string");

export const isPackage = (u: unknown): u is Package =>
  (typeof (u as any)?.name === "string" &&
    typeof (u as any)?.version === "string" &&
    ((u as any)?.dependencies === undefined ||
      isRecordOfStrings((u as any)?.dependencies))) ||
  (u as any)?.devDependencies === undefined ||
  isRecordOfStrings((u as any)?.devDependencies);

import { readFile } from "node:fs/promises";

/**
 * @throws SyntaxError
 * @throws whatever_readFile_throws
 */
export const readJsonFile = async (filePath: string): Promise<unknown> => {
  try {
    const jsonStr = await readFile(filePath, { encoding: "utf8" });
    return JSON.parse(jsonStr);
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(`Failed to parse file as JSON: "${filePath}"`);
      throw err;
    }
    console.error(`Failed to read file: "${filePath}"`);
    throw err;
  }
};

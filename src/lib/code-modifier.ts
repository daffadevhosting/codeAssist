// src/lib/code-modifier.ts BOLEH DIHAPUS ATAU SIMPAN
import { SEARCH_START, DIVIDER, REPLACE_END } from './prompts';

export function applyCodeChanges(currentCode: string, aiResponse: string): string {
  let modifiedCode = currentCode;
  const blocks = aiResponse.split(SEARCH_START);

  for (const block of blocks) {
    if (block.trim() === "") continue;

    if (!block.includes(DIVIDER) || !block.includes(REPLACE_END)) continue;

    const parts = block.split(DIVIDER);
    const searchPartRaw = parts[0];
    const replacePartRaw = parts[1].split(REPLACE_END)[0];

    // Membersihkan trailing newline yang mungkin ada
    const searchLines = searchPartRaw.trimEnd();
    const replaceLines = replacePartRaw.trimEnd();

    if (searchLines.trim() === '') { // Kasus untuk menyisipkan di awal
        modifiedCode = replaceLines + '\n' + modifiedCode;
    } else {
        modifiedCode = modifiedCode.replace(searchLines, replaceLines);
    }
  }

  return modifiedCode;
}
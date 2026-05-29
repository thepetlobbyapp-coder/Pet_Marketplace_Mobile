import { enGB } from "./en-GB";

type TranslationKey = keyof typeof enGB;

export function t(key: TranslationKey): string {
  return enGB[key];
}

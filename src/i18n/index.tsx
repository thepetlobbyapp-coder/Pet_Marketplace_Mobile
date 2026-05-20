/**
 * i18n mínimo en-GB (sem deps). Fase 1 tem só en-GB; a forma do hook
 * (`useT`) já permite trocar por i18next depois sem mexer nas telas.
 */
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { getDefaultLocale } from '../config/env';
import { enGB, type StringKey } from './strings';

type Translator = (key: StringKey) => string;

const I18nContext = createContext<Translator | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Fase 1: única tabela. `getDefaultLocale()` documenta a intenção en-GB.
  const locale = getDefaultLocale();
  const t = useMemo<Translator>(() => {
    void locale;
    return (key) => enGB[key] ?? key;
  }, [locale]);

  return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>;
}

export function useT(): Translator {
  const t = useContext(I18nContext);
  if (!t) {
    // Fallback defensivo: nunca renderizar chave crua sem provider.
    return (key) => enGB[key] ?? key;
  }
  return t;
}

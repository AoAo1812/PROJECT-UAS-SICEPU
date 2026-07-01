"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import id from "./translations/id.json";
import en from "./translations/en.json";
import zh from "./translations/zh.json";
import ja from "./translations/ja.json";
import ko from "./translations/ko.json";
import ar from "./translations/ar.json";

type Translations = typeof id;
type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : K) : never }[keyof T]
  : never;

const translations: Record<string, Translations> = { id, en, zh, ja, ko, ar };

interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({ locale: "id", setLocale: () => {}, t: (key: string) => key });

export function useTranslation() {
  return useContext(I18nContext);
}

export function getLocaleLabel(locale: string): string {
  const labels: Record<string, string> = { id: "Bahasa Indonesia", en: "English", zh: "中文", ja: "日本語", ko: "한국어", ar: "العربية" };
  return labels[locale] || locale;
}

export function getAvailableLocales(): { value: string; label: string }[] {
  return [
    { value: "id", label: "Bahasa Indonesia" },
    { value: "en", label: "English" },
    { value: "zh", label: "中文" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
    { value: "ar", label: "العربية" },
  ];
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("locale");
    if (stored && translations[stored]) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: string) => {
    if (translations[newLocale]) {
      setLocaleState(newLocale);
      localStorage.setItem("locale", newLocale);
    }
  }, []);

  const t = useCallback((key: string): string => {
    const trans = translations[locale] || translations.id;
    return getNestedValue(trans as Record<string, unknown>, key);
  }, [locale]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

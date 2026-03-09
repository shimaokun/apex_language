import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { App } from 'antd';

interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, fallback?: string) => string;
  languages: Language[];
  loading: boolean;
  refreshLanguages: () => Promise<void>;
  toggleLanguage: (code: string) => Promise<void>;
  deleteLanguage: (code: string) => Promise<void>;
  updateLanguage: (code: string, name: string, version: string) => Promise<void>;
}

export interface Language {
  code: string;
  name: string;
  status: number;
  key_count: number;
  version: string;
  updated_at: string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { message } = App.useApp();
  const [locale, setLocale] = useState(localStorage.getItem('app_locale') || 'zh-CN');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [defaultTranslations, setDefaultTranslations] = useState<Record<string, string>>({});
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTranslations, setLoadingTranslations] = useState(false);

  const fetchDefaultTranslations = async () => {
    try {
      const res = await fetch(`/api/translations/zh-CN`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        setDefaultTranslations(data);
      }
    } catch (err) {
      console.error('Failed to fetch default translations', err);
    }
  };

  const refreshLanguages = async (forceLocaleUpdate = false) => {
    try {
      const res = await fetch('/api/languages');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        setLanguages(data);
        
        // Sync locale with active language from server
        const active = data.find((l: Language) => l.status === 1);
        if (active && (active.code !== locale || forceLocaleUpdate)) {
          setLocale(active.code);
        }
      }
    } catch (err) {
      console.error('Failed to fetch languages', err);
    }
  };

  const toggleLanguage = async (code: string) => {
    console.log(`[I18nContext] Toggling language to: ${code}`);
    try {
      setLoadingTranslations(true);
      const res = await fetch('/api/languages/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMsg = 'Failed to toggle language';
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        }
        throw new Error(errorMsg);
      }
      
      console.log(`[I18nContext] Toggle response ok`);
      
      // Update local state immediately to trigger re-render and translation fetch
      setLocale(code);
      
      // Refresh language list to show correct active status in UI
      await refreshLanguages(false);
      message.success(t('message.switch_success', '语言已切换至 {code}').replace('{code}', code));
    } catch (err) {
      console.error('[I18nContext] Toggle failed', err);
      message.error('Failed to switch language');
    } finally {
      setLoadingTranslations(false);
    }
  };

  const deleteLanguage = async (code: string) => {
    try {
      const res = await fetch(`/api/languages/${code}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await refreshLanguages();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const updateLanguage = async (code: string, name: string, version: string) => {
    try {
      const res = await fetch('/api/languages/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name, version }),
      });
      if (!res.ok) throw new Error('Update failed');
      await refreshLanguages();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const fetchTranslations = async (code: string, isManualSwitch = false) => {
    console.log(`[I18nContext] Fetching translations for: ${code}, isManualSwitch: ${isManualSwitch}`);
    try {
      const res = await fetch(`/api/translations/${code}`);
      
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMsg = 'Failed to fetch translations';
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        }
        throw new Error(errorMsg);
      }
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        console.log(`[I18nContext] Received translations for ${code}:`, Object.keys(data).length, 'keys');
        setTranslations(data);
        
        // If this was a manual switch, show success message in the new language
        if (isManualSwitch && data['message.switch_success']) {
          message.success(data['message.switch_success'].replace('{code}', code));
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('[I18nContext] Failed to fetch translations', err);
      message.error('Failed to load translations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLanguages();
    fetchDefaultTranslations();
  }, []);

  useEffect(() => {
    setLoading(true);
    // Only show switch success if it's not the initial load
    const isInitialLoad = !languages.length;
    fetchTranslations(locale, !isInitialLoad);
    localStorage.setItem('app_locale', locale);
  }, [locale, languages.length]);

  const t = React.useCallback((key: string, fallback?: string) => {
    const value = translations[key] || defaultTranslations[key] || fallback || key;
    // Only log a few keys to avoid flooding the console
    if (key === 'sidebar.title' || key === 'header.title') {
      console.log(`[I18nContext] Translating ${key} -> ${value} (locale: ${locale})`);
    }
    return value;
  }, [translations, defaultTranslations, locale]);

  const contextValue = React.useMemo(() => ({ 
    locale, 
    setLocale, 
    t, 
    languages, 
    loading, 
    refreshLanguages,
    toggleLanguage,
    deleteLanguage,
    updateLanguage
  }), [locale, t, languages, loading]);

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

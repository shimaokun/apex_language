import { reactive, computed, onMounted, watch } from 'vue';
import { message } from 'ant-design-vue';

export interface Language {
  code: string;
  name: string;
  status: number;
  key_count: number;
  version: string;
  updated_at: string;
}

const state = reactive({
  locale: localStorage.getItem('app_locale') || 'zh-CN',
  translations: {} as Record<string, string>,
  defaultTranslations: {} as Record<string, string>,
  languages: [] as Language[],
  loading: true,
  loadingTranslations: false
});

export const useI18nStore = () => {
  const fetchDefaultTranslations = async () => {
    try {
      const res = await fetch(`/api/translations/zh-CN`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      state.defaultTranslations = data;
    } catch (err) {
      console.error('Failed to fetch default translations', err);
    }
  };

  const refreshLanguages = async (forceLocaleUpdate = false) => {
    try {
      const res = await fetch('/api/languages');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      state.languages = data;
      
      const active = data.find((l: Language) => l.status === 1);
      if (active) {
        if (active.code !== state.locale || forceLocaleUpdate) {
          state.locale = active.code;
        }
      } else if (data.length > 0) {
        state.locale = data[0].code;
      }
    } catch (err) {
      console.error('Failed to fetch languages', err);
    }
  };

  const fetchTranslations = async (code: string, isManualSwitch = false) => {
    try {
      state.loading = true;
      const res = await fetch(`/api/translations/${code}`);
      if (!res.ok) throw new Error('Failed to fetch translations');
      const data = await res.json();
      state.translations = data;
      
      if (isManualSwitch && data['message.switch_success']) {
        message.success(data['message.switch_success'].replace('{code}', code));
      }
    } catch (err) {
      console.error('Failed to fetch translations', err);
      message.error('Failed to load translations');
    } finally {
      state.loading = false;
    }
  };

  const toggleLanguage = async (code: string) => {
    try {
      state.loadingTranslations = true;
      const res = await fetch('/api/languages/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      
      if (!res.ok) throw new Error('Failed to toggle language');
      
      state.locale = code;
      await refreshLanguages(false);
    } catch (err) {
      console.error('Toggle failed', err);
      message.error('Failed to switch language');
    } finally {
      state.loadingTranslations = false;
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

  const t = (key: string, fallback?: string) => {
    return state.translations[key] || state.defaultTranslations[key] || fallback || key;
  };

  return {
    state,
    t,
    refreshLanguages,
    toggleLanguage,
    deleteLanguage,
    updateLanguage,
    fetchDefaultTranslations,
    fetchTranslations
  };
};

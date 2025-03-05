export const useTranslation = () => ({
  t: (key) => key,
  i18n: {
    changeLanguage: () => new Promise(() => {}),
  },
});

export const initReactI18next = {
  type: '3rdParty',
  init: () => {},
};

export default {
  useTranslation,
  initReactI18next,
};

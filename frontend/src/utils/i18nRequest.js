import i18n from "../i18n";

export const getCurrentLanguage = () => {
  const language = i18n.resolvedLanguage || i18n.language || "en";
  return language.split("-")[0] || "en";
};

export const buildLocalizedHeaders = (headers = {}) => ({
  ...headers,
  "Accept-Language": getCurrentLanguage(),
});

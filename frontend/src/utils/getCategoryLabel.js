import { CATEGORY_SLUG_KEYS } from './categoryLabels';

/** Translated category name when slug is known, else API name */
export const getCategoryLabel = (slug, apiName, t) => {
  const key = CATEGORY_SLUG_KEYS[slug];
  return key ? t(key) : apiName;
};

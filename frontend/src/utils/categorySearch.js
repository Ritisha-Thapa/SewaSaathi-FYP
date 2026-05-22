/** Common search terms mapped to the core category keyword (slug/name_key stem). */
const SEARCH_SYNONYMS = {
  plumber: "plumbing",
  plumbers: "plumbing",
  electrician: "electrical",
  electricians: "electrical",
  cleaner: "cleaning",
  cleaners: "cleaning",
  painter: "painting",
  painters: "painting",
  gardener: "gardening",
  gardeners: "gardening",
  carpenter: "carpentry",
  carpenters: "carpentry",
};

function getCategoryStems(category) {
  const stems = new Set();
  const nameKey = (category.name_key || "").toLowerCase();
  const slug = (category.slug || "").toLowerCase();

  if (nameKey.startsWith("category_")) {
    stems.add(nameKey.replace(/^category_/, ""));
  }

  if (slug) {
    stems.add(slug.replace(/^category-/, ""));
  }

  return [...stems].filter(Boolean);
}

function scoreTermMatch(term, query, prefixOnly = false) {
  if (!term || !query) return 0;
  if (term === query) return 100;
  if (term.startsWith(query)) return 85;
  if (prefixOnly) return 0;
  if (term.includes(query)) return 70;
  return 0;
}

export function getCategoryLabel(category, translate) {
  return translate(`categories.${category.name_key}`, {
    defaultValue: category.name_key || "",
  });
}

/**
 * Return categories that match a partial search query, best matches first.
 * e.g. "plu" → Plumbing, "P" → Painting & Plumbing (label starts with P).
 */
export function getCategorySearchSuggestions(categories, rawQuery, translate) {
  const query = rawQuery.trim().toLowerCase();
  if (!query || !categories?.length) return [];

  const prefixOnly = query.length === 1;
  const expandedQuery = SEARCH_SYNONYMS[query] || null;
  const queries =
    expandedQuery && expandedQuery !== query ? [query, expandedQuery] : [query];

  const results = [];

  for (const category of categories) {
    const label = getCategoryLabel(category, translate);
    const labelLower = label.toLowerCase();
    const stems = getCategoryStems(category);

    let score = 0;

    for (const q of queries) {
      if (labelLower.startsWith(q)) {
        score = Math.max(score, 100);
      } else if (stems.some((stem) => stem.startsWith(q))) {
        score = Math.max(score, 90);
      } else if (!prefixOnly) {
        if (labelLower.includes(q)) {
          score = Math.max(score, 75);
        } else if (stems.some((stem) => stem.includes(q))) {
          score = Math.max(score, 65);
        }
      }
    }

    if (score > 0) {
      results.push({ category, label, score });
    }
  }

  return results
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.label.localeCompare(b.label);
    })
    .map((item) => item.category);
}

/**
 * Find the best-matching service category for a dashboard/hero search query.
 */
export function findCategoryBySearchQuery(categories, rawQuery, translate) {
  const query = rawQuery.trim().toLowerCase();
  if (!query || !categories?.length) return null;

  const suggestions = getCategorySearchSuggestions(categories, query, translate);
  if (suggestions.length === 1) return suggestions[0];

  const prefixOnly = query.length === 1;
  const expandedQuery = SEARCH_SYNONYMS[query] || query;
  const queries = query === expandedQuery ? [query] : [query, expandedQuery];

  let bestMatch = null;
  let bestScore = 0;

  for (const category of categories) {
    const labelLower = getCategoryLabel(category, translate).toLowerCase();
    const stems = getCategoryStems(category);
    const terms = [labelLower, ...stems];

    for (const q of queries) {
      for (const term of terms) {
        const score = scoreTermMatch(term, q, prefixOnly);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = category;
        }
      }
    }
  }

  if (bestScore >= 70) return bestMatch;
  return suggestions[0] || null;
}

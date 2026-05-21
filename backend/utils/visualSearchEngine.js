import Product from '../models/Product.js';

/** Semantic expansions for AI visual + voice search */
const SYNONYMS = {
  black: ['black', 'dark', 'charcoal', 'ebony'],
  white: ['white', 'ivory', 'cream', 'off-white'],
  red: ['red', 'crimson', 'maroon', 'ruby'],
  blue: ['blue', 'navy', 'indigo', 'denim'],
  green: ['green', 'olive', 'mint', 'emerald'],
  pink: ['pink', 'rose', 'blush', 'magenta'],
  floral: ['floral', 'flower', 'bloom', 'print', 'pattern'],
  gold: ['gold', 'golden', 'brass'],
  silver: ['silver', 'metallic', 'steel'],
  sneaker: ['sneaker', 'sneakers', 'shoe', 'shoes', 'footwear', 'running', 'trainer'],
  dress: ['dress', 'gown', 'frock', 'maxi', 'midi'],
  shirt: ['shirt', 'tee', 't-shirt', 'top', 'polo'],
  pan: ['pan', 'fry', 'cookware', 'kadai', 'pot'],
  curtain: ['curtain', 'drape', 'window'],
  mat: ['mat', 'rug', 'floor'],
  watch: ['watch', 'wrist', 'timepiece'],
  phone: ['phone', 'mobile', 'smartphone', 'tablet'],
  laptop: ['laptop', 'notebook', 'computer'],
  headphone: ['headphone', 'earbud', 'audio', 'earphone'],
  lipstick: ['lipstick', 'makeup', 'cosmetic'],
  kurti: ['kurti', 'ethnic', 'traditional'],
  toy: ['toy', 'game', 'play'],
};

const expandTerms = (terms) => {
  const expanded = new Set();
  terms.forEach((raw) => {
    const t = String(raw).toLowerCase().trim();
    if (!t) return;
    expanded.add(t);
    Object.entries(SYNONYMS).forEach(([key, list]) => {
      if (t.includes(key) || list.some((s) => t.includes(s))) {
        list.forEach((s) => expanded.add(s));
      }
    });
  });
  return [...expanded];
};

const scoreProduct = (product, terms) => {
  const text = [
    product.name,
    product.description,
    product.brand,
    ...(product.tags || []),
    ...(product.visualTags || []),
    ...(product.colors || []),
    product.category?.name || '',
  ]
    .join(' ')
    .toLowerCase();

  let score = 0;
  const matched = new Set();

  terms.forEach((term) => {
    if (term.length < 2) return;
    if (text.includes(term)) {
      score += term.length >= 5 ? 4 : 2;
      matched.add(term);
    }
    const words = text.split(/\s+/);
    words.forEach((w) => {
      if (w.startsWith(term) || term.startsWith(w)) {
        score += 1;
        matched.add(term);
      }
    });
  });

  return { score, matched: [...matched] };
};

/**
 * AI-style visual search: match products by color, style, shape, and labels.
 */
export const searchByVisualAttributes = async ({
  keywords = [],
  colors = [],
  labels = [],
  patterns = [],
  limit = 12,
}) => {
  const rawTerms = [...keywords, ...colors, ...labels, ...patterns];
  const terms = expandTerms(rawTerms);

  if (!terms.length) {
    return { products: [], similar: [], analysis: { terms: [] }, total: 0 };
  }

  const allProducts = await Product.find({ countInStock: { $gte: 0 } }).populate(
    'category',
    'name slug'
  );

  const scored = allProducts
    .map((product) => {
      const { score, matched } = scoreProduct(product, terms);
      return { product, score, matched };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const strong = scored.filter((s) => s.score >= 6);
  const weak = scored.filter((s) => s.score < 6 && s.score > 0);

  const products = (strong.length ? strong : scored).slice(0, limit).map((s) => s.product);
  const similar = (strong.length ? weak : []).slice(0, 8).map((s) => s.product);

  return {
    products,
    similar,
    exactMatch: strong.length > 0,
    analysis: {
      terms,
      input: { keywords, colors, labels, patterns },
    },
    total: products.length + similar.length,
  };
};

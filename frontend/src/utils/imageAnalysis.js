import { extractDominantColors, detectPatternHint } from './colorExtractor';

/** Map MobileNet labels to ecommerce search keywords */
const mapLabelsToKeywords = (labels) => {
  const keywords = new Set();
  const rules = [
    [/sneaker|running shoe|tennis shoe/i, ['sneakers', 'footwear', 'shoes']],
    [/sandal|flip-flop/i, ['footwear', 'sandals']],
    [/dress|gown/i, ['dress', 'women', 'fashion']],
    [/shirt|jersey|tee/i, ['shirt', 'top']],
    [/jean|denim/i, ['jeans', 'denim', 'trousers']],
    [/lipstick|cosmetic/i, ['makeup', 'lipstick', 'beauty']],
    [/headphone|earphone/i, ['headphones', 'audio']],
    [/laptop|notebook/i, ['laptop', 'computer']],
    [/cellular|phone|mobile/i, ['phone', 'mobile']],
    [/television|tv/i, ['tv', 'electronics']],
    [/pan|pot|skillet/i, ['cookware', 'pan', 'kitchen']],
    [/curtain/i, ['curtain', 'decor']],
    [/watch|clock/i, ['watch', 'accessories']],
    [/backpack|bag/i, ['bag', 'backpack']],
    [/toy|plush/i, ['toys', 'kids']],
    [/flower|floral/i, ['floral', 'pattern']],
  ];

  labels.forEach((label) => {
    const text = typeof label === 'string' ? label : label.className || '';
    rules.forEach(([regex, terms]) => {
      if (regex.test(text)) terms.forEach((t) => keywords.add(t));
    });
    text.split(/[, ]+/).slice(0, 2).forEach((w) => {
      if (w.length > 3) keywords.add(w.toLowerCase());
    });
  });

  return [...keywords];
};

let mobilenetModel = null;

const classifyWithMobileNet = async (imageSrc) => {
  try {
    await import('@tensorflow/tfjs');
    await import('@tensorflow/tfjs-backend-webgl');
    const mobilenet = await import('@tensorflow-models/mobilenet');
    if (!mobilenetModel) {
      mobilenetModel = await mobilenet.load();
    }
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = imageSrc;
    });
    const predictions = await mobilenetModel.classify(img);
    return predictions.map((p) => p.className);
  } catch {
    return [];
  }
};

/**
 * Full AI image analysis: colors + patterns + MobileNet object labels.
 */
export const analyzeProductImage = async (imageDataUrl) => {
  const [colors, patterns, labels] = await Promise.all([
    extractDominantColors(imageDataUrl),
    detectPatternHint(imageDataUrl),
    classifyWithMobileNet(imageDataUrl),
  ]);

  const labelKeywords = mapLabelsToKeywords(labels);
  const keywords = [...new Set([...colors, ...labelKeywords, ...patterns])];

  return {
    colors,
    patterns,
    labels,
    keywords,
  };
};

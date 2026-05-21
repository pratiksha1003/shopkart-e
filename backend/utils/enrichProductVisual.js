/** Auto-tag products for visual search from name/description */
export const inferVisualMeta = (name, description = '') => {
  const text = `${name} ${description}`.toLowerCase();
  const colors = [];
  const visualTags = [];

  const colorWords = ['black', 'white', 'red', 'blue', 'green', 'pink', 'gold', 'silver', 'floral', 'denim'];
  colorWords.forEach((c) => {
    if (text.includes(c)) {
      colors.push(c);
      visualTags.push(c);
    }
  });

  const styleMap = [
    ['sneaker', ['sneakers', 'footwear', 'running', 'shoes']],
    ['shoe', ['footwear', 'shoes']],
    ['dress', ['dress', 'fashion', 'women']],
    ['kurti', ['ethnic', 'kurti', 'women']],
    ['saree', ['ethnic', 'saree', 'women']],
    ['t-shirt', ['shirt', 'casual', 'men']],
    ['polo', ['shirt', 'men']],
    ['jeans', ['denim', 'trousers', 'men']],
    ['pan', ['cookware', 'kitchen']],
    ['cookware', ['kitchen', 'cookware']],
    ['curtain', ['home', 'decor']],
    ['mat', ['home', 'floor']],
    ['watch', ['accessories', 'wearable']],
    ['headphone', ['electronics', 'audio']],
    ['earbud', ['electronics', 'audio']],
    ['laptop', ['electronics', 'computer']],
    ['phone', ['electronics', 'mobile']],
    ['tablet', ['electronics', 'mobile']],
    ['tv', ['electronics', 'appliance']],
    ['vacuum', ['appliance', 'home']],
    ['lipstick', ['beauty', 'makeup']],
    ['serum', ['beauty', 'skincare']],
    ['shampoo', ['beauty', 'hair']],
    ['perfume', ['beauty', 'fragrance']],
    ['toy', ['kids', 'toys']],
    ['backpack', ['bag', 'school']],
    ['yoga', ['sports', 'fitness']],
    ['dumbbell', ['sports', 'fitness']],
  ];

  styleMap.forEach(([key, tags]) => {
    if (text.includes(key)) visualTags.push(...tags);
  });

  return {
    colors: [...new Set(colors)],
    visualTags: [...new Set(visualTags)],
  };
};

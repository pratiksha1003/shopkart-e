/**
 * Extract dominant colors from an image using canvas pixel sampling.
 */
const RGB_TO_NAME = [
  { name: 'black', check: (r, g, b) => r < 50 && g < 50 && b < 50 },
  { name: 'white', check: (r, g, b) => r > 210 && g > 210 && b > 210 },
  { name: 'red', check: (r, g, b) => r > 120 && g < 90 && b < 90 },
  { name: 'blue', check: (r, g, b) => b > r && b > g && b > 100 },
  { name: 'green', check: (r, g, b) => g > r && g > b && g > 90 },
  { name: 'pink', check: (r, g, b) => r > 160 && g < 140 && b > 120 },
  { name: 'gold', check: (r, g, b) => r > 170 && g > 140 && b < 100 },
  { name: 'silver', check: (r, g, b) => Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && r > 120 && r < 200 },
];

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const extractDominantColors = async (imageSrc, maxColors = 4) => {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const buckets = {};
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const found = RGB_TO_NAME.find((c) => c.check(r, g, b));
    const key = found?.name || 'neutral';
    buckets[key] = (buckets[key] || 0) + 1;
  }

  return Object.entries(buckets)
    .filter(([k]) => k !== 'neutral')
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxColors)
    .map(([name]) => name);
};

/** High color variance may indicate floral/patterned designs */
export const detectPatternHint = async (imageSrc) => {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, 48, 48);
  const { data } = ctx.getImageData(0, 0, 48, 48);
  let variance = 0;
  const samples = [];
  for (let i = 0; i < data.length; i += 4) {
    samples.push((data[i] + data[i + 1] + data[i + 2]) / 3);
  }
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  samples.forEach((v) => {
    variance += (v - mean) ** 2;
  });
  variance /= samples.length;
  const patterns = [];
  if (variance > 1200) patterns.push('floral', 'pattern', 'print');
  return patterns;
};

import asyncHandler from 'express-async-handler';
import { searchByVisualAttributes } from '../utils/visualSearchEngine.js';

// @desc    AI visual search — match by color, style, labels from image analysis
// @route   POST /api/products/visual-search
export const visualSearch = asyncHandler(async (req, res) => {
  const { keywords = [], colors = [], labels = [], patterns = [] } = req.body;

  const result = await searchByVisualAttributes({
    keywords,
    colors,
    labels,
    patterns,
    limit: Number(req.body.limit) || 12,
  });

  res.json(result);
});

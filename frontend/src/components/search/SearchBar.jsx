import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiMic, FiCamera, FiMicOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { listenForSearchQuery, isVoiceSearchSupported } from '../../utils/voiceSearch';
import { analyzeProductImage } from '../../utils/imageAnalysis';
import VisualSearchModal from './VisualSearchModal';

/**
 * Search bar with text, voice (Speech API), and camera visual search.
 */
const SearchBar = ({ className = '', inputClassName = 'input-field', compact = false }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [visualOpen, setVisualOpen] = useState(false);
  const [visualLoading, setVisualLoading] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const submitTextSearch = (term) => {
    const q = (term || query).trim();
    if (!q) return;
    navigate(`/products?keyword=${encodeURIComponent(q)}`);
    setQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitTextSearch();
  };

  const startVoiceSearch = () => {
    if (!isVoiceSearchSupported()) {
      toast.error(t('visualSearch.voiceUnsupported'));
      return;
    }
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    setListening(true);
    toast.success(t('visualSearch.listeningSay'));
    recognitionRef.current = listenForSearchQuery(
      (transcript) => {
        setListening(false);
        setQuery(transcript);
        toast.success(t('visualSearch.searching', { query: transcript }));
        submitTextSearch(transcript);
      },
      (msg) => {
        setListening(false);
        toast.error(msg);
      }
    );
  };

  const runVisualSearch = async (imageDataUrl) => {
    setVisualLoading(true);
    try {
      const analysis = await analyzeProductImage(imageDataUrl);
      const { data } = await api.post('/products/visual-search', {
        keywords: analysis.keywords,
        colors: analysis.colors,
        labels: analysis.labels,
        patterns: analysis.patterns,
      });
      setVisualOpen(false);
      navigate('/products', {
        state: {
          visualSearch: true,
          products: data.products,
          similar: data.similar,
          analysis: data.analysis,
          exactMatch: data.exactMatch,
          previewImage: imageDataUrl,
        },
      });
      toast.success(
        data.exactMatch
          ? t('visualSearch.found', { count: data.products.length })
          : t('visualSearch.similar', { count: data.similar?.length || 0 })
      );
    } catch (err) {
      toast.error(err.response?.data?.message || t('visualSearch.failed'));
    }
    setVisualLoading(false);
  };

  const iconPad = compact ? 'pl-20 pr-10' : 'pl-[4.5rem] pr-12';

  return (
    <>
      <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
        <div className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center gap-0.5">
          <button
            type="button"
            onClick={startVoiceSearch}
            title={t('visualSearch.voiceSearch')}
            aria-label={t('visualSearch.voiceSearch')}
            className={`rounded-lg p-2 transition hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 ${
              listening ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-400 animate-pulse' : 'text-gray-500'
            }`}
          >
            {listening ? <FiMicOff size={18} /> : <FiMic size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setVisualOpen(true)}
            title={t('visualSearch.cameraSearch')}
            aria-label={t('visualSearch.cameraSearch')}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30"
          >
            <FiCamera size={18} />
          </button>
        </div>
        <input
          type="search"
          placeholder={compact ? t('nav.searchPlaceholderShort') : t('nav.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${inputClassName} ${iconPad}`}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-gray-400 hover:text-primary-600"
          aria-label={t('products.search')}
        >
          <FiSearch size={20} />
        </button>
      </form>

      <VisualSearchModal
        open={visualOpen}
        onClose={() => setVisualOpen(false)}
        onAnalyze={runVisualSearch}
        loading={visualLoading}
      />
    </>
  );
};

export default SearchBar;

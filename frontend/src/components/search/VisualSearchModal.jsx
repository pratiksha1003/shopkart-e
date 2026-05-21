import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCamera, FiUpload, FiX, FiLoader } from 'react-icons/fi';

const VisualSearchModal = ({ open, onClose, onAnalyze, loading }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  const handleClose = () => {
    stopCamera();
    setPreview(null);
    onClose();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
      setPreview(null);
    } catch {
      alert(t('support.cameraDenied'));
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setPreview(canvas.toDataURL('image/jpeg', 0.85));
    stopCamera();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{t('visualSearch.title')}</h3>
          <button type="button" onClick={handleClose} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiX size={20} />
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">{t('visualSearch.desc')}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary gap-2 text-sm">
            <FiUpload /> {t('visualSearch.upload')}
          </button>
          <button type="button" onClick={cameraOn ? stopCamera : startCamera} className="btn-secondary gap-2 text-sm">
            <FiCamera /> {cameraOn ? t('visualSearch.stopCamera') : t('visualSearch.useCamera')}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
        {cameraOn && (
          <div className="mt-4">
            <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg bg-black max-h-48" />
            <button type="button" onClick={capturePhoto} className="btn-primary mt-2 w-full">{t('visualSearch.capture')}</button>
          </div>
        )}
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="" className="mx-auto max-h-48 rounded-lg object-contain" />
            <button type="button" onClick={() => onAnalyze(preview)} disabled={loading} className="btn-primary mt-4 w-full gap-2">
              {loading ? <FiLoader className="animate-spin" /> : null}
              {loading ? t('visualSearch.analyzing') : t('visualSearch.searchSimilar')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualSearchModal;

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMic, FiMicOff, FiCamera, FiCameraOff, FiSend, FiVolume2 } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const SPEECH_LANG = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

const LiveSupportPanel = () => {
  const { t, i18n } = useTranslation();
  const [ticket, setTicket] = useState(null);
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [sending, setSending] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const chatEndRef = useRef(null);

  const loadTicket = async () => {
    const { data } = await api.get('/support/my-ticket');
    setTicket(data);
  };

  useEffect(() => {
    loadTicket();
    const interval = setInterval(loadTicket, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const sendMessage = async (payload) => {
    setSending(true);
    try {
      const { data } = await api.post('/support/message', {
        ticketId: ticket?._id,
        ...payload,
      });
      setTicket(data);
      setText('');
      toast.success(t('support.sent'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('support.sendFailed'));
    }
    setSending(false);
  };

  const handleTextSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage({ text: text.trim(), messageType: 'text' });
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(t('support.speechUnsupported'));
      return;
    }
    const lang = SPEECH_LANG[i18n.language?.split('-')[0]] || 'en-IN';
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;
    setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setListening(false);
      toast.success(t('support.voiceCaptured'));
    };
    recognition.onerror = () => {
      setListening(false);
      toast.error(t('support.speechFailedMic'));
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          sendMessage({ audioData: reader.result, messageType: 'voice', text: '🎤 Voice message' });
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      toast.success(t('support.recording'));
    } catch {
      toast.error(t('support.micDenied'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setCameraOn(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch {
      toast.error(t('support.cameraDenied'));
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.85);
    sendMessage({ imageData, messageType: 'image', text: '📷 Photo from camera' });
    toggleCamera();
  };

  return (
    <div className="card flex flex-col overflow-hidden" style={{ minHeight: '480px' }}>
      <div className="border-b border-gray-200 bg-primary-600 px-4 py-3 text-white dark:border-gray-800">
        <h3 className="font-semibold">{t('support.liveHelp')}</h3>
        <p className="text-xs text-white/90">{t('support.liveHelpPanelDesc')}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-primary-50/30 dark:bg-gray-900/30 max-h-80">
        {ticket?.messages?.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                m.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100'
              }`}
            >
              {m.text && <p>{m.text}</p>}
              {m.audioData && (
                <audio controls src={m.audioData} className="mt-2 max-w-full h-8" />
              )}
              {m.imageData && (
                <img src={m.imageData} alt="Shared" className="mt-2 max-h-40 rounded-lg" />
              )}
              <p className={`mt-1 text-[10px] ${m.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                {new Date(m.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {cameraOn && (
        <div className="relative border-t border-gray-200 bg-black p-2 dark:border-gray-800">
          <video ref={videoRef} autoPlay playsInline muted className="mx-auto max-h-40 rounded-lg" />
          <button type="button" onClick={capturePhoto} className="btn-primary mt-2 w-full text-sm">
            {t('support.capturePhoto')}
          </button>
        </div>
      )}

      <div className="border-t border-gray-200 p-3 dark:border-gray-800">
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={listening ? undefined : startVoiceInput}
            className={`btn-secondary gap-1 text-xs py-2 ${listening ? 'ring-2 ring-primary-500' : ''}`}
            title={t('support.speak')}
          >
            {listening ? <FiVolume2 className="animate-pulse" /> : <FiMic />}
            {listening ? t('support.listening') : t('support.speak')}
          </button>
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            className={`btn-secondary gap-1 text-xs py-2 ${recording ? 'bg-red-100 text-red-700' : ''}`}
          >
            {recording ? <FiMicOff /> : <FiMic />}
            {recording ? t('support.stopSend') : t('support.voiceNote')}
          </button>
          <button type="button" onClick={toggleCamera} className="btn-secondary gap-1 text-xs py-2">
            {cameraOn ? <FiCameraOff /> : <FiCamera />}
            {cameraOn ? t('support.closeCam') : t('support.camera')}
          </button>
        </div>
        <form onSubmit={handleTextSend} className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder={t('support.typeOptional')}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" disabled={sending} className="btn-primary p-2.5">
            <FiSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LiveSupportPanel;

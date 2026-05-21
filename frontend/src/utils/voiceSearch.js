/**
 * Web Speech API — voice search (Chrome, Edge, Safari).
 */
export const isVoiceSearchSupported = () =>
  !!(window.SpeechRecognition || window.webkitSpeechRecognition);

export const listenForSearchQuery = (onResult, onError) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError?.('Voice search is not supported in this browser. Try Chrome or Edge.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    onError?.(event.error === 'not-allowed' ? 'Microphone permission denied' : 'Could not recognize speech');
  };

  recognition.start();
  return recognition;
};

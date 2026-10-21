/**
 * Browser Web Speech API service for hands-free voice input on mobile and smart devices
 */
export function listenToVoiceInput(
  onResult: (transcript: string) => void,
  onError?: (error: string) => void
) {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) onError('Voice input is not supported in this browser. Please try Chrome or Safari.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    if (onError) onError(event.error || 'Failed to capture voice input.');
  };

  recognition.start();
}
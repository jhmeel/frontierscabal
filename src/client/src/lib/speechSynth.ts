
import React, { useState, useEffect } from 'react';

interface TextToSpeechProps {
  text: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleStop = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    const handleEnd = () => {
      setIsSpeaking(false);
    };

    speechSynthesis.addEventListener('end', handleEnd);

    return () => {
      speechSynthesis.removeEventListener('end', handleEnd);
    };
  }, []);

  return (
    <div>
      <button onClick={handleSpeak} disabled={isSpeaking}>
        {isSpeaking ? 'Speaking...' : 'Speak'}
      </button>
      <button onClick={handleStop} disabled={!isSpeaking}>
        Stop
      </button>
    </div>
  );
};

export default TextToSpeech;

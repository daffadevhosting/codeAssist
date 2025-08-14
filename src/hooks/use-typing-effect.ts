// src/hooks/use-typing-effect.ts
import { useState, useEffect } from 'react';

export function useTypingEffect(fullText: string | null, typingSpeed = 2) {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    setTypedText(''); // Selalu reset saat teks baru diterima

    if (fullText) {
      let i = 0;
      const intervalId = setInterval(() => {
        setTypedText(prev => prev + fullText.charAt(i));
        i++;
        if (i >= fullText.length) {
          clearInterval(intervalId);
        }
      }, typingSpeed);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [fullText, typingSpeed]);

  return typedText;
}
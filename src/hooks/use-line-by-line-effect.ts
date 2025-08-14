// src/hooks/use-line-by-line-effect.ts
import { useState, useEffect } from 'react';

export function useLineByLineEffect(fullCode: string | null, lineSpeed = 80) {
  const [displayedCode, setDisplayedCode] = useState('');

  useEffect(() => {
    setDisplayedCode(''); // Selalu reset saat kode baru diterima

    if (fullCode) {
      const lines = fullCode.split('\n');
      let currentLine = 0;

      const intervalId = setInterval(() => {
        if (currentLine < lines.length) {
          setDisplayedCode(prev => prev + (currentLine > 0 ? '\n' : '') + lines[currentLine]);
          currentLine++;
        } else {
          clearInterval(intervalId);
        }
      }, lineSpeed);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [fullCode, lineSpeed]);

  return displayedCode;
}
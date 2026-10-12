import { useCallback, useEffect, useState } from 'react';

const CONTRASTE_KEY = 'aysen_alto_contraste';
const TEXTO_KEY = 'aysen_texto_grande';

export function useA11y() {
  const [altoContraste, setAltoContraste] = useState(() => localStorage.getItem(CONTRASTE_KEY) === '1');
  const [textoGrande, setTextoGrande] = useState(() => localStorage.getItem(TEXTO_KEY) === '1');

  useEffect(() => {
    document.documentElement.classList.toggle('alto-contraste', altoContraste);
    localStorage.setItem(CONTRASTE_KEY, altoContraste ? '1' : '0');
  }, [altoContraste]);

  useEffect(() => {
    document.documentElement.classList.toggle('texto-grande', textoGrande);
    localStorage.setItem(TEXTO_KEY, textoGrande ? '1' : '0');
  }, [textoGrande]);

  const toggleContraste = useCallback(() => setAltoContraste(v => !v), []);
  const toggleTexto = useCallback(() => setTextoGrande(v => !v), []);

  return { altoContraste, textoGrande, toggleContraste, toggleTexto };
}

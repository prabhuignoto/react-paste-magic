import { useCallback, useEffect } from 'react';

let usePaste: (callback: (data: any) => void) => void;

usePaste = callback => {
  const handlePaste = useCallback((event: ClipboardEvent) => {
    const data = event.clipboardData?.getData('text');
    callback(data);
  }, []);

  const handleCopy = (event: ClipboardEvent) => {
    const selection = window.getSelection();
    const text = selection?.toString();
    event.clipboardData?.setData('text/plain', text || '');
    event.preventDefault();
  };

  useEffect(() => {
    // Add event listeners for 'paste' and 'copy' events
    document.addEventListener('paste', handlePaste);
    document.addEventListener('copy', handleCopy);

    // Clean up by removing event listeners when the component unmounts
    return () => {
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('copy', handleCopy);
    };
  }, [callback]);
};

export default usePaste;

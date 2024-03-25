import { RefObject, useCallback, useEffect } from 'react';

let usePaste: (ref: RefObject<HTMLElement>, callback: (data: any) => void) => void;

usePaste = (ref, callback) => {
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
    const element = ref.current;

    if (element) {
      // Add event listeners for 'paste' and 'copy' events
      element.addEventListener('paste', handlePaste);
      element.addEventListener('copy', handleCopy);
    }

    // Clean up by removing event listeners when the component unmounts
    return () => {
      const element = ref.current;

      if (element) {
        element.removeEventListener('paste', handlePaste);
        element.removeEventListener('copy', handleCopy);
      }
    };
  }, [callback, ref]);
};

export default usePaste;

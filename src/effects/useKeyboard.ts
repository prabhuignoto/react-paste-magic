import { RefObject, useCallback, useEffect, useState } from 'react';

type useKeyboardProps = {
  ref: RefObject<HTMLElement>;
  ctrlKeyUsed?: boolean;
  keyCode?: string;
};

let useKeyboard: (props: useKeyboardProps) => {
  data: string;
  activated: boolean;
};

useKeyboard = ({ ref, ctrlKeyUsed = false, keyCode }) => {
  const [activated, setActivated] = useState(false);

  const [clipboardData, setClipboardData] = useState('' as string);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (ctrlKeyUsed && event.ctrlKey) {
      setActivated(event.key === keyCode);
    } else {
      setActivated(event.key === keyCode);
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('paste', ev => {
        ev.preventDefault();
        const data = ev.clipboardData?.getData('text');

        if (data) {
          setClipboardData(data);
        }
      });
      element.addEventListener('keyup', handleKeyUp);
    }
  }, [ref]);

  useEffect(() => {
    return () => {
      const element = ref.current;
      if (element) {
        element.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, []);

  return {
    data: clipboardData,
    activated,
  };
};

export { useKeyboard };

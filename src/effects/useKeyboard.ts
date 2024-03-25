import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

type useKeyboardProps = {
  ref: RefObject<HTMLElement>;
  ctrlKeyUsed?: boolean;
  keyCode?: string;
};

let useKeyboard: (props: useKeyboardProps) => {
  // data: string;
  reset?: () => void;
  activated: boolean;
};

useKeyboard = ({ ref, ctrlKeyUsed = false, keyCode }) => {
  const [activated, setActivated] = useState(false);

  const controlKeyPressed = useRef(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && ctrlKeyUsed) {
      controlKeyPressed.current = true;
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();

    console.log(keyCode, controlKeyPressed.current);

    if (controlKeyPressed.current && event.key === keyCode) {
      setActivated(true);
      controlKeyPressed.current = false;
    } else {
      // setActivated(event.key === keyCode);
    }
  }, []);

  const reset = useCallback(() => {
    setActivated(false);
  }, []);

  // useEffect(() => {
  //   const element = ref.current;
  //   if (element) {
  //     element.addEventListener('paste', ev => {
  //       ev.preventDefault();
  //       const data = ev.clipboardData?.getData('text');

  //       if (data) {
  //         setClipboardData(data);
  //       }
  //     });
  //     element.addEventListener('keyup', handleKeyUp);
  //     element.addEventListener('keydown', handleKeyDown);
  //   }
  // }, []);

  useEffect(() => {
    const element = ref.current;

    if (element) {
      element.addEventListener('keyup', handleKeyUp);
      element.addEventListener('keydown', handleKeyDown);
    }
  }, [ref]);

  useEffect(() => {
    return () => {
      const element = ref.current;
      if (element) {
        element.removeEventListener('keyup', handleKeyUp);
        element.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  return {
    // data: clipboardData,
    activated,
    reset,
  };
};

export { useKeyboard };

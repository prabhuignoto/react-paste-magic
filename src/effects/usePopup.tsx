import { ReactNode, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Popup } from '../components/popup/popup';
import { useKeyboard } from './useKeyboard';

type usePopupProps = {
  width?: number;
  height?: number;
  ref: RefObject<HTMLElement>;
  title?: string;
};

let usePopup: (props: usePopupProps) => ReactNode | null;

usePopup = ({ ref, width = 400, height = 400, title }) => {
  const [popupOpen, setPopupOpen] = useState(false);

  const { activated, data } = useKeyboard({ ref, ctrlKeyUsed: true, keyCode: 'v' });

  const bodyRef = useRef(document.body);

  const popupPlaceholder = useRef(document.createElement('div'));

  const handleClose = useCallback(() => setPopupOpen(false), []);

  useEffect(() => {
    if (activated) {
      setPopupOpen(true);
    } else {
      setPopupOpen(false);
    }
  }, [activated]);

  useEffect(() => {
    if (bodyRef && popupPlaceholder) {
      const body = bodyRef.current;
      const placeholder = popupPlaceholder.current;

      placeholder.style.cssText += `
        position: fixed;
        width: ${width}px;
        height: ${height}px;
        top: 10px;
        left: 10px;
        display: none;
        align-items: center;
        justify-content: center;
        background: red;
        padding: 10px;
      `;

      body.appendChild(placeholder);
    }
  }, [bodyRef, popupPlaceholder]);

  useEffect(() => {
    if (activated) {
      setPopupOpen(true);
    }
  }, [activated, data]);

  useEffect(() => {
    if (ref.current && popupOpen) {
      const placeholder = popupPlaceholder.current;
      placeholder.style.display = 'flex';
    }
  }, [ref, popupOpen]);

  useEffect(() => {
    if (!popupOpen) {
      const placeholder = popupPlaceholder.current;
      placeholder.style.display = 'none';
    }
  }, [popupOpen]);

  return popupOpen
    ? createPortal(
        <Popup title={title} onClose={handleClose} data={data} />,
        popupPlaceholder.current,
      )
    : null;
};

export { usePopup };

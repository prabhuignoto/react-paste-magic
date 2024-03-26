import { ReactNode, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Popup } from '../components/popup/popup';
import styles from '../components/popup/popup.module.scss';
import { useKeyboard } from './useKeyboard';
import usePaste from './usePaste';

type usePopupProps = {
  width?: number;
  height?: number;
  ref: RefObject<HTMLElement>;
  title?: string;
};

const usePopup: (props: usePopupProps) => ReactNode | null = ({
  ref,
  width = 400,
  height = 400,
  title,
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState('');

  const bodyRef = useRef(document.body);
  const popupPlaceholder = useRef(document.createElement('div'));
  const popupBackdrop = useRef(document.createElement('div'));

  const { activated, reset } = useKeyboard({ ref, ctrlKeyUsed: true, keyCode: 'v' });

  usePaste(ref, data => setPopupData(data));

  const handleClose = useCallback(() => {
    setPopupOpen(false);
    reset?.();
  }, []);

  const handleSave = useCallback((data: string) => {
    const target = ref.current as HTMLInputElement;

    if (target) {
      target.value = data;
    }

    handleClose();
  }, []);

  useEffect(() => {
    const targetElement = ref.current;
    if (activated && targetElement) {
      setPopupOpen(true);

      targetElement.style.cssText += `
        pointer-events: none;
        opacity: 0.5;
      `;
    } else if (targetElement) {
      setPopupOpen(false);
      targetElement.style.cssText += `
        pointer-events: auto;
        opacity: 1;
      `;
    }
  }, [activated]);

  useEffect(() => {
    if (bodyRef && popupPlaceholder) {
      const body = bodyRef.current;
      const placeholder = popupPlaceholder.current;
      const backdrop = popupBackdrop.current;
      backdrop.classList.add(styles.popup_container);

      placeholder.style.cssText += `
        width: ${width}px;
        height: ${height}px;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        background: #fff;
        border-radius: 4px;
        border: 12px solid blue;
      `;

      backdrop.appendChild(placeholder);
      body.appendChild(backdrop);
    }
  }, [bodyRef, popupPlaceholder]);

  useEffect(() => {
    if (activated) {
      setPopupOpen(true);
    }
  }, [activated]);

  useEffect(() => {
    const backdrop = popupBackdrop.current;
    if (ref.current && popupOpen) {
      backdrop.style.display = 'flex';
    } else {
      backdrop.style.display = 'none';
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
        <Popup title={title} onClose={handleClose} data={popupData} onSaved={handleSave} />,
        popupBackdrop.current,
      )
    : null;
};

export { usePopup };

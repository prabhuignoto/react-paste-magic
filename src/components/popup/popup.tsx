import { FunctionComponent, useCallback, useEffect, useRef } from 'react';
import { useKeyboard } from '../../effects/useKeyboard';
import { PopupProps } from './popup.model';
import styles from './popup.module.scss';

const Popup: FunctionComponent<PopupProps> = ({ title, onClose, onSaved, data }) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  const { activated: escActivated } = useKeyboard({
    ref: popupRef,
    ctrlKeyUsed: false,
    keyCode: 'Escape',
  });

  useEffect(() => {
    if (escActivated) {
      onClose?.();
    }
  }, [escActivated]);

  const handleSave = useCallback(() => onSaved?.(), []);

  return (
    <div className={styles.container} ref={popupRef}>
      <header className={styles.header}>{title}</header>
      <div className={styles.textarea_container}>
        <textarea className={styles.textarea}>{data}</textarea>
      </div>
      <footer className={styles.footer}>
        <button className={styles.button} onClick={handleSave}>
          save
        </button>
      </footer>
    </div>
  );
};

export { Popup };

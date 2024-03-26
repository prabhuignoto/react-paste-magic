import cls from 'classnames';
import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useKeyboard } from '../../effects/useKeyboard';
import { PopupProps } from './popup.model';
import styles from './popup.module.scss';

const Popup: FunctionComponent<PopupProps> = ({ title, onClose, onSaved, data }) => {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [textAreaValue, setTextAreaValue] = useState(data || '');

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

  const handleSave = useCallback(() => onSaved?.(textAreaValue), [textAreaValue]);

  const handleClose = useCallback(() => onClose?.(), []);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => setTextAreaValue(event.target.value),
    [],
  );

  const closeBtnClass = useMemo(() => {
    return cls(styles.button, styles.close_btn);
  }, []);

  return (
    <div className={styles.container} ref={popupRef}>
      <header className={styles.header}>
        <span>{title}</span>
        <button className={closeBtnClass} onClick={handleClose}>
          close
        </button>
      </header>
      <div className={styles.textarea_container}>
        <textarea className={styles.textarea} value={textAreaValue} onChange={onChange}></textarea>
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

export interface PopupProps {
  title?: string;
  data?: string;
  onClose?: () => void;
  onOpen?: () => void;
  onSaved?: (data: string) => void;
}

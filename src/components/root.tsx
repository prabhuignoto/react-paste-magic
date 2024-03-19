import { useRef } from 'react';
import { usePopup } from '../effects/usePopup';

const RootComponent = () => {
  const ref = useRef<HTMLInputElement>(null);

  const Node = usePopup({ ref });

  return (
    <div>
      <h1>Root Component is the new component that is superior and mind blowing</h1>

      <input type="text" placeholder="Paste here" ref={ref} />
      {Node}
    </div>
  );
};

export { RootComponent };

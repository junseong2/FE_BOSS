import { useState } from 'react';

export default function useToggle() {
  const [openModal, setOpenModal] = useState(false);

  const onToggle = () => {
    setOpenModal((prev) => !prev);
  };

  return { onToggle, openModal };
}

import { useState } from 'react';

export default function useToggle() {
  const [isOpen, setOpenModal] = useState(false);
  const [id, setId] = useState(0);

  const onToggle = (id) => {
    setId(id);
    setOpenModal((prev) => !prev);
  };

  return { onToggle, isOpen, toggleId: id };
}

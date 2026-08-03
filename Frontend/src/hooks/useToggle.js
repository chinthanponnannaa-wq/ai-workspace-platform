import { useState } from 'react';

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn(v => !v);
  const set = (v) => setOn(v);
  return [on, toggle, set];
}

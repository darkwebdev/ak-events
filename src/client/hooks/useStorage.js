import { useState, useEffect } from 'react';

/**
 * useStorage hook for syncing state with localStorage
 * @param {string} key - localStorage key
 * @param {any} initialValue - initial value if localStorage is empty
 * @returns {[any, function]} - [value, setValue]
 */
export function useStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}

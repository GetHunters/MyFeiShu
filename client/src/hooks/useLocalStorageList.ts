import { useCallback, useEffect, useRef, useState } from 'react';

function safeGetItem<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return initial;
    return JSON.parse(raw) as T;
  } catch {
    return initial;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/**
 * 与 localStorage 同步的列表状态 hook。
 * 首次挂载时从 localStorage 读取，之后每次改动自动写回。
 */
export function useLocalStorageList<T extends { id: string }>(
  key: string,
  initial: T[],
) {
  const isHydrated = useRef(false);
  const [items, setItems] = useState<T[]>(initial);

  useEffect(() => {
    const stored = safeGetItem<T[]>(key, initial);
    setItems(stored);
    isHydrated.current = true;
  }, [key]);

  useEffect(() => {
    if (!isHydrated.current) return;
    safeSetItem(key, items);
  }, [key, items]);

  const addItem = useCallback((item: T) => {
    setItems((prev: T[]) => [item, ...prev]);
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<T>) => {
    setItems((prev: T[]) =>
      prev.map((it: T) => (it.id === id ? { ...it, ...patch } : it)),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev: T[]) => prev.filter((it: T) => it.id !== id));
  }, []);

  return { items, addItem, updateItem, removeItem };
}

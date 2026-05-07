import { useState } from 'react';

export function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  function update<K extends keyof T>(key: K, value: T[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function reset(nextValues = initialValues) {
    setValues(nextValues);
  }

  return { values, update, reset, setValues };
}

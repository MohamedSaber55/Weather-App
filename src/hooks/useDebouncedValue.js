import { useEffect, useState } from 'react'

export function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return debounced
}

export default useDebouncedValue
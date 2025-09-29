import {useEffect, useRef} from 'react'

export function useClickOutside(handler: () => void) {
  const dropdownRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [dropdownRef, handler])

  return {dropdownRef}
}


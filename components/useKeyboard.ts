import {KeyboardEvent, useRef} from 'react'

interface UseKeyboardProps<T> {
  showDropdown: boolean
  items: T[]
  selectedIndex: number
  setSelectedIndex: (fn: (prev: number) => number) => void
  onSelect: (item: T) => void
  setShowDropdown: (show: boolean) => void
}

export function useKeyboard<T>({
  showDropdown,
  items,
  selectedIndex,
  setSelectedIndex,
  onSelect,
  setShowDropdown,
}: UseKeyboardProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null)

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || items.length === 0) {
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < items.length - 1 ? prev + 1 : prev))
        break

      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
        break

      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault()
          onSelect(items[selectedIndex])
        }
        break

      case 'Escape':
        e.preventDefault()
        setShowDropdown(false)
        inputRef.current?.blur()
        break
    }
  }

  return {onKeyDown, inputRef}
}


import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useKeyboard } from './useKeyboard'

function TestComponent<T extends { label: string }>(props: {
  items: T[]
  showDropdown: boolean
  onSelect: (item: T) => void
}) {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1)
  const [showDropdown, setShowDropdown] = React.useState(props.showDropdown)
  const { onKeyDown, inputRef } = useKeyboard<T>({
    showDropdown,
    items: props.items,
    selectedIndex,
    setSelectedIndex,
    onSelect: props.onSelect,
    setShowDropdown,
  })

  return (
    <div>
      <input ref={inputRef} data-testid="input" onKeyDown={onKeyDown} />
      {showDropdown && (
        <ul>
          {props.items.map((item, idx) => (
            <li
              key={item.label}
              data-testid={`item-${idx}`}
              style={{
                background: idx === selectedIndex ? 'lightblue' : undefined,
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

describe('useKeyboard', () => {
  const items = [
    { label: 'Apple' },
    { label: 'Banana' },
    { label: 'Orange' },
  ]

  it('navigates with ArrowDown and ArrowUp', async () => {
    render(
      <TestComponent
        items={items}
        showDropdown={true}
        onSelect={() => {}}
      />
    )
    const input = screen.getByTestId('input')
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByTestId('item-0')).toHaveStyle('background: lightblue')
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByTestId('item-1')).toHaveStyle('background: lightblue')
    await userEvent.keyboard('{ArrowUp}')
    expect(screen.getByTestId('item-0')).toHaveStyle('background: lightblue')
  })

  it('calls onSelect with Enter', async () => {
    const onSelect = jest.fn()
    render(
      <TestComponent
        items={items}
        showDropdown={true}
        onSelect={onSelect}
      />
    )
    const input = screen.getByTestId('input')
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledWith(items[0])
  })

  it('closes dropdown with Escape', async () => {
    render(
      <TestComponent
        items={items}
        showDropdown={true}
        onSelect={() => {}}
      />
    )
    const input = screen.getByTestId('input')
    await userEvent.click(input)
    await userEvent.keyboard('{Escape}')
    // Wait for dropdown to disappear
    await screen.findByTestId('input')
    expect(screen.queryByTestId('item-0')).not.toBeInTheDocument()
  })
})

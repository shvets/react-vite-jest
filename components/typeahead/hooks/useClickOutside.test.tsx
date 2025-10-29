import { render, fireEvent } from '@testing-library/react'
import { useClickOutside } from './useClickOutside'

function TestComponent({ onOutside }: { onOutside: () => void }) {
  const { dropdownRef } = useClickOutside(onOutside)
  return (
    <div>
      <ul ref={dropdownRef} data-testid="dropdown">
        <li>Item</li>
      </ul>
      <button data-testid="outside">Outside</button>
    </div>
  )
}

describe('useClickOutside', () => {
  it('calls handler when clicking outside', () => {
    const handler = jest.fn()
    const { getByTestId } = render(<TestComponent onOutside={handler} />)
    fireEvent.mouseDown(getByTestId('outside'))
    expect(handler).toHaveBeenCalled()
  })

  it('does not call handler when clicking inside', () => {
    const handler = jest.fn()
    const { getByTestId } = render(<TestComponent onOutside={handler} />)
    fireEvent.mouseDown(getByTestId('dropdown'))
    expect(handler).not.toHaveBeenCalled()
  })
})


import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Typeahead from './Typeahead'

const mockItems = [
  { id: '1', label: 'Apple 1' },
  { id: '2', label: 'Apple 2' },
  { id: '3', label: 'Banana 1' },
  { id: '4', label: 'Banana 2' },
]

const fetchItems = async (query: string, page: number, pageSize: number) => {
  await new Promise(res => setTimeout(res, 50))
  const filtered = mockItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  )
  return {
    items: filtered.slice(page * pageSize, (page + 1) * pageSize),
    hasMore: (page + 1) * pageSize < filtered.length
  }
}

describe('Typeahead', () => {
  it('renders input', () => {
    render(<Typeahead minQueryLength={3} fetchItems={fetchItems} />)
    expect(screen.getByPlaceholderText(/type to search/i)).toBeInTheDocument()
  })

  it('does not show dropdown for less than minQueryLength', async () => {
    render(<Typeahead minQueryLength={3} fetchItems={fetchItems} />)
    const input = screen.getByPlaceholderText(/type to search/i)
    await userEvent.type(input, 'ap')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('shows dropdown with items for 3+ characters', async () => {
    render(<Typeahead minQueryLength={3} fetchItems={fetchItems} />)
    const input = screen.getByPlaceholderText(/type to search/i)
    await userEvent.type(input, 'app')
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0)
    })
  })

  it('filters items based on input', async () => {
    render(<Typeahead minQueryLength={3} fetchItems={fetchItems} />)
    const input = screen.getByPlaceholderText(/type to search/i)
    await userEvent.type(input, 'banana')
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem').every(li => li.textContent?.toLowerCase().includes('banana'))).toBe(true)
    })
  })

  it('navigates items with arrow keys and selects with Enter', async () => {
    render(<Typeahead minQueryLength={3} fetchItems={fetchItems} />)
    const input = screen.getByPlaceholderText(/type to search/i)
    await userEvent.type(input, 'app')
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument()
    })
    await userEvent.keyboard('{ArrowDown}')
    const firstItem = screen.getAllByRole('listitem')[0]
    expect(firstItem).toHaveClass('typeahead-item-selected')
    await userEvent.keyboard('{Enter}')
    expect(input).toHaveValue(firstItem.textContent!)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('closes dropdown with Escape key', async () => {
    render(<Typeahead minQueryLength={3} fetchItems={fetchItems} />)
    const input = screen.getByPlaceholderText(/type to search/i)
    await userEvent.type(input, 'app')
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument()
    })
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('selects item with mouse click', async () => {
    render(<Typeahead minQueryLength={3} fetchItems={fetchItems} />)
    const input = screen.getByPlaceholderText(/type to search/i)
    await userEvent.type(input, 'app')
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument()
    })
    const item = screen.getAllByRole('listitem')[0]
    await userEvent.click(item)
    expect(input).toHaveValue(item.textContent!)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})


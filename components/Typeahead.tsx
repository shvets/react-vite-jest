import React, {useState, useEffect} from 'react'

import './typeahead/Typeahead.css'

import { useKeyboard } from './typeahead/hooks/useKeyboard'
import { useClickOutside } from './typeahead/hooks/useClickOutside'
import {Suggestion} from "./typeahead/model/suggestion.ts"
import {TypeaheadFetchCallback} from "./typeahead/model/typeahead-fetch-callback.ts";

interface TypeaheadProps<T> {
  minQueryLength?: number
  pageSize?: number
  placeholder?: string
  fetchItems: TypeaheadFetchCallback<T>
  onSelect: (item: T) => void
  children: (item: T, isSelected: boolean, onSelect: (item: T) => void) => React.ReactNode
}

const Typeahead = <T extends Suggestion>({
  minQueryLength = 0,
  pageSize = 20,
  placeholder = "Type to search...",
  fetchItems,
  onSelect,
  children
}: TypeaheadProps<T>) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<T[]>([]);

  const [showDropdown, setShowDropdown] = useState(false)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [itemSelected, setItemSelected] = useState<boolean>(false)

  const {dropdownRef} = useClickOutside(() => setShowDropdown(false))

  const loadMore = async () => {
    if (loading || !hasMore) return

    //setLoading(true)
    const {items: newItems, hasMore: more} = await fetchItems(query, page, pageSize)
    setSuggestions(prev => [...prev, ...newItems])
    setHasMore(more)
    setPage(p => p + 1)
    //setLoading(false)
  }

  const handleScroll = async (e: React.UIEvent<HTMLUListElement>) => {
    const list = e.currentTarget

    if (list.scrollTop + list.clientHeight >= list.scrollHeight - 20) {
      await loadMore()
    }
  }

  const onSelectLocal = (item: T) => {
    setItemSelected(true)
    setQuery(item.label)
    setShowDropdown(false)
    setSelectedIndex(-1)
    setTimeout(() => {
      setShowDropdown(false)
    }, 0)

    onSelect(item)
  }

  const {onKeyDown, inputRef} = useKeyboard({
    showDropdown,
    items: suggestions,
    selectedIndex,
    setSelectedIndex,
    onSelect,
    setShowDropdown
  })

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setItemSelected(false)
  }

  const onTextFocus = () => {
    if (query.length >= minQueryLength && suggestions.length > 0) {
      setShowDropdown(true)
      setItemSelected(false)
    }
  }

  useEffect(() => {
    setSelectedIndex(-1)
    setSuggestions([])
    setPage(0)
    setHasMore(true)

    if (query.length < minQueryLength) {
      setShowDropdown(false)
      return
    }

    setLoading(true)

    if (query && !itemSelected) {
      fetchItems(query, 0, pageSize).then(({items: newItems, hasMore}) => {
        setSuggestions(newItems)
        setHasMore(hasMore)
        setShowDropdown(true)
        setLoading(false)
      })
    }
  }, [query, itemSelected])

  return <>
    <div className="typeahead">
      <input ref={inputRef} className="typeahead-input" value={query} placeholder={placeholder} autoComplete="off"
             onChange={onTextChange}
             onFocus={onTextFocus}
             onKeyDown={onKeyDown}/>

      {showDropdown && (suggestions.length > 0 || loading) && (
        <ul className="typeahead-list" ref={dropdownRef} tabIndex={-1} role="list"
            onScroll={handleScroll}>
          {/*{suggestions.map((item, index) => (*/}
          {/*  <TypeaheadItem item={item} isSelected={index === selectedIndex}*/}
          {/*                 onSelect={onSelectLocal} />*/}
          {/*))}*/}

          {suggestions.map((item, index) =>
            children(item, index === selectedIndex, onSelectLocal)
          )}

          {loading && (
            <li className="typeahead-loading" role="listitem">Loading...</li>
          )}
        </ul>
      )}
    </div>
  </>
}

export default Typeahead

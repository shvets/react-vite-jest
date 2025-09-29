import {Suggestion} from "./suggestion.ts"

interface TypeaheadItemProps<T> {
  item: T
  isSelected: boolean
  onSelect: (item: T) => void
}

const TypeaheadItem = <T extends Suggestion>({item, isSelected, onSelect}: TypeaheadItemProps<T>) => {
  const className = isSelected ? 'typeahead-item typeahead-item-selected' : 'typeahead-item'

  return <li key={item.id} className={className} role="listitem" onClick={() => onSelect(item)}>
    {item.label}
  </li>
}

export default TypeaheadItem

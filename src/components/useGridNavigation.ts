import React from 'react';

export function useGridNavigation(
  refs: React.MutableRefObject<Array<Array<HTMLElement | null>>>,
  rows: number,
  cols: number
) {
  return (rowIndex: number, colIndex: number) =>
    (e: React.KeyboardEvent<HTMLElement>) => {
      const key = e.key;
      let targetRow = rowIndex;
      let targetCol = colIndex;

      if (key === 'ArrowDown') {
        targetRow = Math.min(Math.max(0, rows - 1), rowIndex + 1);
      } else if (key === 'ArrowUp') {
        targetRow = Math.max(0, rowIndex - 1);
      } else if (key === 'ArrowLeft') {
        targetCol = Math.max(0, colIndex - 1);
      } else if (key === 'ArrowRight') {
        targetCol = Math.min(Math.max(0, cols - 1), colIndex + 1);
      } else {
        return;
      }

      e.preventDefault();

      const el = refs.current?.[targetRow]?.[targetCol];
      if (el && typeof (el as HTMLElement).focus === 'function') {
        (el as HTMLElement).focus();
        // move caret to end for text inputs
        if (el instanceof HTMLInputElement && el.type === 'text') {
          try {
            const len = el.value?.length ?? 0;
            el.setSelectionRange(len, len);
          } catch {
            // ignore if not applicable
          }
        }
      }
    };
}


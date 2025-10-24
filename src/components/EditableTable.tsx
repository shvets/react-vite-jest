import { useEffect, useRef, useState } from 'react';
import './EditableTable.css';
import { useGridNavigation } from './useGridNavigation';

export type Column = {
  key: string;
  title?: string;
  type: 'text' | 'select' | 'checkbox';
  options?: string[]; // for select
  width?: number | string;
};

export interface EditableTableProps<Row extends Record<string, any>> {
  columns: Column[];
  data: Row[];
  onChange: (newData: Row[]) => void;
  className?: string;
}

const EditableTable = <Row extends Record<string, any>>({
  columns,
  data,
  onChange,
  className,
}: EditableTableProps<Row>) => {
  // ...existing code...
  const [rows, setRows] = useState<Row[]>(data);
  useEffect(() => setRows(data), [data]);

  // matrix of refs: refs.current[rowIndex][colIndex] = HTMLElement | null
  const refs = useRef<Array<Array<HTMLElement | null>>>([]);

  // navigation hook: returns factory to create onKeyDown for each cell
  const getOnKeyDown = useGridNavigation(refs, rows.length, columns.length);

  const setCellRef = (r: number, c: number) => (el: HTMLElement | null) => {
    refs.current[r] = refs.current[r] || [];
    refs.current[r][c] = el;
  };

  const handleValueChange = (rowIndex: number, colKey: string, value: any) => {
    const newRows = rows.map((r, i) => (i === rowIndex ? { ...r, [colKey]: value } : r));
    setRows(newRows);
    onChange(newRows);
  };

  return (
    <div className={`editable-table-wrapper ${className || ''}`}>
      <table className="editable-table" role="grid">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width ?? 'auto', textAlign: 'left' }}>
                {col.title ?? col.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {columns.map((col, cIdx) => {
                const cellKey = `${rIdx}-${col.key}`;
                const commonProps = {
                  ref: setCellRef(rIdx, cIdx),
                  onKeyDown: getOnKeyDown(rIdx, cIdx),
                  'data-row': rIdx,
                  'data-col': cIdx,
                  className: 'editable-cell',
                } as any;

                if (col.type === 'text') {
                  return (
                    <td key={cellKey}>
                      <input
                        {...commonProps}
                        type="text"
                        value={row[col.key] ?? ''}
                        onChange={(e) => handleValueChange(rIdx, col.key, e.target.value)}
                      />
                    </td>
                  );
                }

                if (col.type === 'select') {
                  return (
                    <td key={cellKey}>
                      <select
                        {...commonProps}
                        value={row[col.key] ?? (col.options?.[0] ?? '')}
                        onChange={(e) => handleValueChange(rIdx, col.key, e.target.value)}
                      >
                        {(col.options ?? []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                }

                // checkbox
                return (
                  <td key={cellKey}>
                    <input
                      {...commonProps}
                      type="checkbox"
                      checked={!!row[col.key]}
                      onChange={(e) => handleValueChange(rIdx, col.key, e.target.checked)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;


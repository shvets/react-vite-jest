import React, { useEffect, useMemo, useRef } from 'react';
import { useSizeChange, SizeDirection } from './useSizeChange';
import './TableWidthDetector.css';

type Row = Record<string, string | number | boolean>;

export interface TableWidthDetectorProps {
  onChange?: (payload: { width: number | null; direction: SizeDirection }) => void;
  className?: string;
  // optional: allow custom column/row counts; defaults produce a big table
  columnsCount?: number;
  rowsCount?: number;
}

export default function TableWidthDetector({
  onChange,
  className,
  columnsCount = 12,
  rowsCount = 50,
}: TableWidthDetectorProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { width, direction } = useSizeChange<HTMLDivElement>(wrapperRef);

  useEffect(() => {
    if (onChange) onChange({ width, direction });

    const element = document.getElementById('direction-label');

    //   const labelStyle: React.CSSProperties =
    //     direction === 'increasing'
    //       ? { right: `${baseOffsetPx}px`, left: 'auto', transform: 'none' }
    //       : direction === 'decreasing'
    //       ? { left: `${baseOffsetPx}px`, transform: 'none' }
    //       : { left: '50%', transform: 'translateX(-50%)' };
    if (direction === 'increasing') {
      console.log('Table width is increasing', element);

      if (element) {
        element.style.right = '0';
        element.style.left = 'auto'
        element.style.transform = 'none';
      }
      //element?.style?.right = '8px';
    } else if (direction === 'decreasing') {
      console.log('Table width is decreasing');
      if (element) {
        element.style.left = '0';
        element.style.transform = 'none';
      }
    }
    else {
      if (element) {
        element.style.left = '50%';
        element.style.transform = 'translateX(-50%)';
      }
    }
  }, [width, direction, onChange]);

  // generate column headers and rows (stable across renders)
  const { columns, rows } = useMemo(() => {
    const cols = Array.from({ length: columnsCount }, (_, i) => `Col ${i + 1}`);
    const rws: Row[] = Array.from({ length: rowsCount }, (_, r) => {
      const obj: Row = {};
      cols.forEach((c) => {
        obj[c] = `${c} R${r + 1}`;
      });
      obj['Number'] = r + 1;
      obj['Active'] = (r % 3) === 0;
      return obj;
    });
    if (!cols.includes('Number')) cols.push('Number');
    if (!cols.includes('Active')) cols.push('Active');
    return { columns: cols, rows: rws };
  }, [columnsCount, rowsCount]);

  // compute inline style for the floating label so tests can inspect computed style
  const labelId = 'direction-label';
  const labelTestId = 'direction-label-testid';
  // const baseOffsetPx = 8;

  // const labelStyle: React.CSSProperties =
  //   direction === 'increasing'
  //     ? { right: `${baseOffsetPx}px`, left: 'auto', transform: 'none' }
  //     : direction === 'decreasing'
  //     ? { left: `${baseOffsetPx}px`, transform: 'none' }
  //     : { left: '50%', transform: 'translateX(-50%)' };

  return (
    <div className={`table-width-detector ${className || ''}`}>
      <div className="detector-header">
        <strong>Table Width:</strong>{' '}
        <span className="detector-value">{width === null ? 'n/a' : `${width}px`}</span>{' '}
        {direction ? <span className="detector-direction">({direction})</span> : null}
      </div>

      {/* floating label container (the hook observes this wrapper) */}
      <div className="label-container" aria-hidden>
        {/* id + data-testid added so tests can find the element via document.getElementById or getByTestId */}
        <div
          id={labelId}
          data-testid={labelTestId}
          className="direction-label"
          // style={labelStyle}
        >
          {direction ?? '—'}
        </div>
      </div>

      <div className="table-scroll-wrapper" ref={wrapperRef}>
        <table className="detector-table" role="table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} style={{ textAlign: 'left' }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {columns.map((col) => (
                  <td key={col + rIdx}>{String(row[col] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

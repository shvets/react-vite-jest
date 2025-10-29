// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// import MyComponent from "@/my-component.tsx";
// import {SearchDemo} from "@/search-demo.tsx";
// import {TableDemo} from "@/TableDemo.tsx";
import React, {useState} from "react";
import {Suggestion} from "../components/typeahead/model/suggestion.ts";
import DownloadExcelButton from "@/DownloadExcelButton.tsx";
import TableWidthDetector from './components/TableWidthDetector';
import Typeahead from "../components/Typeahead.tsx";
import TypeaheadItem from "../components/typeahead/TypeaheadItem.tsx";

const generateMockData = () => {
  const fruits = ['Apple', 'Banana', 'Orange', 'Mango', 'Pear', 'Grape', 'Kiwi', 'Lemon',
    'Lime', 'Peach', 'Plum', 'Cherry', 'Strawberry', 'Blueberry', 'Raspberry']

  return Array.from({length: 1000}, (_, i) => {
    const fruit = fruits[Math.floor(Math.random() * fruits.length)]
    return {id: `${i + 1}`, label: `${fruit} ${i + 1}`}
  })
}

const mockData = generateMockData()

interface User {
  // Name: string;
  // Age: number;
  // City: string;
  [key: string]: string | number;
}

const userData: User[] = [
  { Name: 'John Doe', Age: 30, City: 'New York' },
  { Name: 'Jane Smith', Age: 25, City: 'San Francisco' },
  { Name: 'Peter Jones', Age: 35, City: 'Chicago' },
];

function App() {
  const [downloadOutcome, setDownloadOutcome] = useState<string | null>(null);

  const handleDownloadSaved = () => {
    setDownloadOutcome('File was successfully saved!');
  };

  const handleDownloadCanceled = () => {
    setDownloadOutcome('Download was canceled by the user.');
  };

  const pageSize = 10
  const placeholder = "Select..."

  // const [count, setCount] = useState(0)
  const fetchItems = React.useCallback(
    async (query: string, page: number, pageSize: number): Promise<{ items: Suggestion[]; hasMore: boolean }> => {

      return new Promise(resolve => {
        setTimeout(() => {
          const filtered = mockData.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase())
          )

          const start = page * pageSize
          const items = filtered.slice(start, start + pageSize)
          const hasMore = start + pageSize < filtered.length

          resolve({ items, hasMore })
        }, 300)
      })
    },
    []
  )

  const handleChange = (payload: { width: number | null; direction: 'increasing' | 'decreasing' | 'same' | null }) => {
    console.log('Table size changed:', payload);
  };

  return (
    <>
      {/*<div>*/}
      {/*    <a href="https://vitejs.dev" target="_blank">*/}
      {/*        <img src={viteLogo} className="logo" alt="Vite logo"/>*/}
      {/*    </a>*/}
      {/*    <a href="https://react.dev" target="_blank">*/}
      {/*        <img src={reactLogo} className="logo react" alt="React logo"/>*/}
      {/*    </a>*/}
      {/*</div>*/}
      {/*<h1>Vite + React</h1>*/}
      {/*<div className="card">*/}
      {/*    <button onClick={() => setCount((count) => count + 1)}>*/}
      {/*        count is {count}*/}
      {/*    </button>*/}
      {/*    <p>*/}
      {/*        Edit <code>src/App.tsx</code> and save to test HMR*/}
      {/*    </p>*/}
      {/*</div>*/}
      {/*<p className="read-the-docs">*/}
      {/*    Click on the Vite and React logos to learn more*/}
      {/*</p>*/}

      {/*<MyComponent/>*/}
      {/*<SearchDemo/>*/}
      {/*<TableDemo/>*/}

      {/*<TableWithContextMenu/>*/}

      <div style={{padding: 40}}>
        <h2>Typeahead Example</h2>
        <Typeahead<Suggestion> minQueryLength={1} pageSize={pageSize} placeholder={placeholder} fetchItems={fetchItems}
                               onSelect={(item) => console.log('Selected item:', item)}>

          {(item, isSelected, onSelectItem) => (
            <TypeaheadItem key={item.id} item={item} isSelected={isSelected}
                           onSelect={onSelectItem} />
          )}
        </Typeahead>
      </div>

      {/*<div>*/}
      {/*  <h1>Export Data to Excel</h1>*/}
      {/*  <DownloadExcelButton<User>*/}
      {/*    data={userData}*/}
      {/*    fileName="users.xlsx"*/}
      {/*    onDownloadSaved={handleDownloadSaved}*/}
      {/*    onDownloadCanceled={handleDownloadCanceled}*/}
      {/*  >*/}
      {/*    Download User Data (.xlsx)*/}
      {/*  </DownloadExcelButton>*/}
      {/*  {downloadOutcome && (*/}
      {/*    <p style={{marginTop: '15px', color: downloadOutcome.includes('saved') ? 'green' : 'red'}}>*/}
      {/*      {downloadOutcome}*/}
      {/*    </p>*/}
      {/*  )}*/}
      {/*</div>*/}

      {/*<div style={{padding: 16}}>*/}
      {/*  <h2>TableWidthDetector demo</h2>*/}
      {/*  <p>Drag the container border (or resize the window) to see width and direction updates.</p>*/}

      {/*  /!* wrapper is resizable in supporting browsers; TableWidthDetector also supports scrolling *!/*/}
      {/*  <div style={{*/}
      {/*    width: '80%',*/}
      {/*    maxWidth: '100%',*/}
      {/*    resize: 'horizontal',*/}
      {/*    overflow: 'auto',*/}
      {/*    border: '1px solid #ccc',*/}
      {/*    padding: 8*/}
      {/*  }}>*/}
      {/*    <TableWidthDetector columnsCount={16} rowsCount={100} onChange={handleChange}/>*/}
      {/*  </div>*/}
      {/*</div>*/}

    </>
  );
}

export default App

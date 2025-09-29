// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// import MyComponent from "@/my-component.tsx";
// import {SearchDemo} from "@/search-demo.tsx";
// import {TableDemo} from "@/TableDemo.tsx";
import Typeahead from "../components/Typeahead.tsx";
import React from "react";
import {Suggestion} from "../components/suggestion.ts";

const generateMockData = () => {
  const fruits = ['Apple', 'Banana', 'Orange', 'Mango', 'Pear', 'Grape', 'Kiwi', 'Lemon',
    'Lime', 'Peach', 'Plum', 'Cherry', 'Strawberry', 'Blueberry', 'Raspberry']

  return Array.from({length: 1000}, (_, i) => {
    const fruit = fruits[Math.floor(Math.random() * fruits.length)]
    return {id: `${i + 1}`, label: `${fruit} ${i + 1}`}
  })
}

const mockData = generateMockData()


function App() {
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
            <div style={{ padding: 40 }}>
                <h2>Typeahead Example</h2>
              <Typeahead minQueryLength={3} fetchItems={fetchItems}/>
            </div>
        </>
    );
}

export default App

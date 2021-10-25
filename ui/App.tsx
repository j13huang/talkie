import { useState } from "react";
import logo from "./logo.svg";
import { Audio, Video } from "./media";
import { useWS } from "./websockets";
import { EVENT_TYPES } from "../shared/websockets";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [wsRef, wsClientID] = useWS((data) => {
    setCount(data.count);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>user count: {userCount}</p>
        <div>
          <Audio />
          {false && <Video />}
        </div>
        <p>
          <button
            type="button"
            onClick={() => {
              if (wsRef.current) {
                wsRef.current.send(JSON.stringify({ type: EVENT_TYPES.INCREMENT_COUNT }));
              }
              fetch("/api/request")
                .then((response) => response.json())
                .then((data) => console.log(data));
              //setCount((count) => count + 1);
            }}
          >
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          {" | "}
          <a className="App-link" href="https://vitejs.dev/guide/features.html" target="_blank" rel="noopener noreferrer">
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import logo from "./logo.svg";
import { Audio } from "./components/media";
import { useWS } from "./lib/websockets";
import { EVENT_TYPES } from "../shared/websockets";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [usersToInitiate, setUsersToInitiate] = useState([]);
  const [wsRef, clientID] = useWS();

  useEffect(() => {
    if (!wsRef || !wsRef.current) {
      return;
    }

    const onMessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (!data) {
        return;
      }
      if (data.count) {
        setCount(data.count);
      }
      if (data.users) {
        setUsers(data.users);
      }
      if (data.initiateWithUsers) {
        setUsersToInitiate(data.initiateWithUsers);
      }
    };
    wsRef.current.addEventListener("message", onMessage);
    return () => {
      if (!wsRef || !wsRef.current) {
        return;
      }
      wsRef.current.removeEventListener("message", onMessage);
    };
  }, [wsRef]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <div>
          {users.map((id) =>
            id !== clientID ? (
              <div key={id}>
                <div>{id}</div>
                <Audio clientID={id} wsRef={wsRef} initiate={usersToInitiate.includes(id)} />
              </div>
            ) : null,
          )}
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

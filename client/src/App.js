import Login from "./Login";
import Dashboard from "./Dashboard";

import "./App.css";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  const reload = () => {
    window.location.replace("/");
  };
  return (
    <div className="full-app">
      <div className="app">
        <h1 onClick={reload} className="title">
          Not-ify
        </h1>
        {code ? <Dashboard code={code} /> : <Login className="login-page" />}
      </div>
    </div>
  );
}

export default App;

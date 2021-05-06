import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return (
    <div>
      <h1 className="title">Not-ify</h1>
      {code ? <Dashboard code={code} /> : <Login className="login-page" />}
    </div>
  );
}

export default App;

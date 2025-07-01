import './App.css';
import Router from "./AppRouter/Router";
import axios from "axios";
function App() {
  axios.defaults.withCredentials = true;

  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;

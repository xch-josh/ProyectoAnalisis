import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Layout from "./Components/Layout/Layout";
import UsersMainView from "./Components/Administration/Users/UsersMainView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/Users" element={<UsersMainView/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

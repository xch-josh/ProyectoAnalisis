import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Layout from "./Components/Layout/Layout";
import UsersMain from "./Components/Administration/Users/UsersMain";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/Users" element={<UsersMain/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

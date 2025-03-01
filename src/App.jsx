import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../src/pages/Landing";
import Login from "../src/pages/login";
import Not_Found from "../src/pages/Not_Found";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/NT_Lyrics/" element={<Landing />} />
          <Route path="/NT_Lyrics/login" element={<Login />} />
          <Route path="*" element={<Not_Found />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

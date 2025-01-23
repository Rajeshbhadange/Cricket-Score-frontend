import "./App.css";
import AdminView from "./Examples/AdmiView/AdminView.jsx";
import LoginForm from "./Examples/Login/Login";
import UserView from "./Examples/UserView/UserView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminView />} />
          <Route path="/" element={<UserView />} />
          <Route path="/adminlogin" element={<LoginForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

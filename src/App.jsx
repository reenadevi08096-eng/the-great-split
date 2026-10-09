import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import CreateGroup from "./pages/CreateGroup";
import AddExpense from "./pages/AddExpense";
import "./App.css";
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/add-expense" element={<AddExpense />} />
      </Routes>
    </>
  );
}

export default App;
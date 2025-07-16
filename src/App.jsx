import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./pages/MainLayout";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<MainLayout />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;

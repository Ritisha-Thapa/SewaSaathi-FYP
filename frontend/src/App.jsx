import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CustomerSignup from "./pages/CustomerSignup";
import Login from "./pages/Login"
import ProviderSignup from './pages/ProviderSignup'; 
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/customer" element={<CustomerSignup />} />
        <Route path="/signup/provider" element={<ProviderSignup />} />
      </Routes>
    </Router>
  );
}

export default App
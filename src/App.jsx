import React from "react";
import Navbar from "./components/header";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import BrowserRouter
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar/>
        <Routes> {/* Use <Routes> instead of useRoutes */}
          <Route path="/" element={<Home />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
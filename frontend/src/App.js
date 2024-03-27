import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom/client';
import {Routes, Route} from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Update from "./pages/update";
import ProductList from "./pages/productList";
import ProductView from "./pages/productView";
import ProductCreate from "./pages/productCreate";
import ShipmentList from "./pages/shipmentList";
import ShipmentView from "./pages/shipmentView";
import ShipmentCreate from "./pages/shipmentCreate";


export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="signup" element={<Signup />} />
        <Route path="update" element={<Update />} />
        <Route path="productList" element={<ProductList />} />
        <Route path="productView" element={<ProductView />} />
        <Route path="productCreate" element={<ProductCreate />} />
        <Route path="shipmentList" element={<ShipmentList />} />
        <Route path="shipmentView" element={<ShipmentView />} />
        <Route path="shipmentCreate" element={<ShipmentCreate />} />
      </Routes>
    </>
  );
}


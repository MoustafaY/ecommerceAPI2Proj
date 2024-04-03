import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom/client';
import {Routes, Route, useLocation} from "react-router-dom";
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
import InventoryView from "./pages/inventoryView";
import InventoryProductView from "./pages/inventoryProductView";
import ShoppingCart from "./pages/shoppingCart";
import TranscriptList from "./pages/transcriptList";
import TranscriptView from "./pages/transcriptView";
import BalanceView from "./pages/balanceView";
import Navbar from "./navbar";


export default function App() {
  const location = useLocation();

  const excludeFromNavbar = ["/", "/signup"];

  return (
    <>
    {!excludeFromNavbar.includes(location.pathname) && <Navbar />}
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
        <Route path="shoppingCart" element={<ShoppingCart />} />
        <Route path="inventoryView" element={<InventoryView />} />
        <Route path="inventoryProductView" element={<InventoryProductView />} />
        <Route path="transcriptList" element={<TranscriptList />} />
        <Route path="transcriptView" element={<TranscriptView />} />
        <Route path="balanceView" element={<BalanceView />} />
      </Routes>
    </>
  );
}


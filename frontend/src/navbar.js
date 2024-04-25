import React from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from "js-cookie";



function Navbar() {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    

  return (
    <nav className="navbar navbar-expand lg navbar-light">
      <div className="container-fluid">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 custom-nav">
        <li className="nav-item p-2">
          <NavLink className="custom-link" to="/home">Home</NavLink>
        </li>
        <li className="nav-item p-2">
          <NavLink className="custom-link" to="/">Logout</NavLink>
        </li>
        {user === "Customer" && <li className="nav-item p-2"><NavLink className="custom-link" to="/balanceView">Balance</NavLink></li>}
        {user === "Customer" && <li className="nav-item p-2"><NavLink className="custom-link" to="/transcriptList">Transcripts</NavLink></li>}
        {user === "Customer" && <li className="nav-item p-2"><NavLink className="custom-link" to="/shoppingCart">Shopping Cart</NavLink></li>}
        {user === "Supplier" && <li className="nav-item p-2"><NavLink className="custom-link" to="/productList">Products</NavLink></li>}
        {user === "Supplier" && <li className="nav-item p-2"><NavLink className="custom-link" to="/shipmentList">Shipments</NavLink></li>}
      </ul>
      </div>
    </nav>
  );
}

export default Navbar;

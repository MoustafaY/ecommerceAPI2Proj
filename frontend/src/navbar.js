import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

function Navbar() {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    

  return (
    <nav>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        {user === "Customer" && <li><Link to="/balanceView">Balance</Link></li>}
        {user === "Customer" && <li><Link to="/transcriptList">Transcripts</Link></li>}
        {user === "Customer" && <li><Link to="/shoppingCart">Shopping Cart</Link></li>}
        {user === "Supplier" && <li><Link to="/productList">Products</Link></li>}
        {user === "Supplier" && <li><Link to="/shipmentList">Shipments</Link></li>}
      </ul>
    </nav>
  );
}

export default Navbar;

import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function ShipmentView(){
    const location = useLocation();
    const token = Cookies.get("token");
    const shipment = location.state.shipment;
    const navigate = useNavigate();
    
    return (
        <div style={{height: '200px', overflowY: 'auto'}}>
            <h1>{shipment.date} Shipment</h1> 
            <ul>
                {shipment.products.map((product, index) => (
                   <li key={index}>
                    {product.name} {product.quantity}
                   </li> 
                ))}
            </ul>
        </div>
    );
}

export default ShipmentView;
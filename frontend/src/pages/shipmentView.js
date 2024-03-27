import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ShipmentView(){
    const location = useLocation();
    const [token, setToken] = useState(location.state.token || "");
    const [shipment, setShipment] = useState(location.state.shipment);
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
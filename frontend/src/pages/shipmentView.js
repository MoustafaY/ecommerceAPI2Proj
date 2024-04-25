import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function ShipmentView(){
    const location = useLocation();
    const token = Cookies.get("token");
    const shipment = location.state.shipment;
    const navigate = useNavigate();
    
    return (
        <div>
            <div class="row">
                <div class="col d-flex justify-content-center">
                    <h1 class="d-flex justify-content-center" style={{color:'#FFF4E9'}}>Shipment</h1>
                </div>
            </div>
            <div class="row">
                <div class="d-flex justify-content-center">
                    <div class="card" style={{padding:'10px'}}>
                        <div class="card-body" style={{height: '200px', overflowY: 'auto', backgroundColor: '#E6DCD1', padding:'0', borderRadius:'10px'}}>
                        <ul class="custom-list">
                            {shipment.products.map((product, index) => (
                            <li class="custom-item" key={index}>
                                <b>Product: </b>{product.name} <b>Quantity: </b>{product.quantity}
                            </li> 
                            ))}
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShipmentView;
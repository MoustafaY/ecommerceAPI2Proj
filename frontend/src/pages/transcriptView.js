import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function TranscriptView(){
    const location = useLocation();
    const token = Cookies.get("token");
    const transcript = location.state.transcript;
    const navigate = useNavigate();
    
    return (
        <div>
            <div class="row">
                <div class="col d-flex justify-content-center">
                    <h1 class="d-flex justify-content-center" style={{color:'#FFF4E9'}}>Transcript</h1>
                </div>
            </div>
            <div class="row">
                <div class="d-flex justify-content-center">
                    <div class="card" style={{padding:'10px'}}>
                        <div class="card-body" style={{height: '200px', overflowY: 'auto', backgroundColor: '#E6DCD1', padding:'0', borderRadius:'10px'}}>
                        <ul class="custom-list">
                            {transcript.products.map((product, index) => (
                            <li class="custom-item" key={index}>
                                <b>Product: </b>{product.name}  <b>Quantity: </b>{product.quantity}  <b>Price: </b>{product.price}
                            </li> 
                            ))}
                        </ul>
                        </div>
                        <span>Sum: {transcript.sum}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TranscriptView;
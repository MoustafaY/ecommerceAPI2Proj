import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function TranscriptView(){
    const location = useLocation();
    const token = Cookies.get("token");
    const transcript = location.state.transcript;
    const navigate = useNavigate();
    
    return (
        <div style={{height: '200px', overflowY: 'auto'}}>
            <h1>{transcript.date} transcript</h1> 
            <ul>
                {transcript.products.map((product, index) => (
                   <li key={index}>
                    {product.name} {product.quantity} {product.price}
                   </li> 
                ))}
            </ul>
            <span>Sum: {transcript.sum}</span>
        </div>
    );
}

export default TranscriptView;
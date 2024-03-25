import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProductView(){
    const location = useLocation();
    const [token, setToken] = useState(location.state.token || "");
    const product = location.state.product;
    const navigate = useNavigate();
    
    return (
        <div style={{height: '200px', overflowY: 'auto'}}>
            <h1>{product.name}</h1>
            <ul>
                <li>
                    Quantity: {product.quantity}
                </li>
                <li>
                    Price: {product.price}
                </li>
            </ul>
        </div>
    );
}

export default ProductView;
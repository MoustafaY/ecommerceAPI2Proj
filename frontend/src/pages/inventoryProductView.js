import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function InventoryProductView(){
    const location = useLocation();
    const token = Cookies.get("token");
    const [product, setProduct] = useState(location.state.product);
    const [quantity, setQuantity] = useState(0);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const addToCart = async () =>{
        try{
            const response = await fetch("/Customer/ShoppingCart", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"id": product.id, "name": product.name, "quantity": quantity, "price": product.price, "supplierId": product.supplierId}),
            });
            if (response.ok){
                navigate("/shoppingCart");
            }
        }catch(error){
            console.error("error: " + error);
        }
    };

    const handleUpdate = () =>{
        if(validate()){
            addToCart();
        }
    }

    const validate = () => {
        if(quantity <= 0){
            setError("Invalid quantity amount");
            return false;
        }
        return true;
    }
    
    return (
        <div>
            <h1>{product.name}</h1>
            <ul>
                <li>Quantity: <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}></input><button onClick={handleUpdate}>Add to cart</button></li>
                <li>Price: {product.price}</li>
            </ul>
        </div>
    );
}

export default InventoryProductView;
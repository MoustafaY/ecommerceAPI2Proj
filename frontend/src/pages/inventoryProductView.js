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
            <div class="d-flex justify-content-center">
                <h1 class="d-flex justify-content-center" style={{color:'#FFF4E9'}}>{product.name}</h1>
            </div>
            <div class="d-flex justify-content-center">
                <div class="card">
                {error && <p class="error">{error}</p>}
                    <div class="card-body">
                        <div class="row">
                            <div class="col d-flex justify-content-start">
                                Quantity: <input class="custom-input" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>
                            </div>
                            <div class="col d-flex justify-content-start">
                                Price: {product.price}
                            </div>
                            <div class="col d-flex justify-content-start">
                                <button class="btn btn-sm custom-button" onClick={handleUpdate}>Add to cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InventoryProductView;
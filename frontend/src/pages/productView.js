import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProductView(){
    const location = useLocation();
    const [token, setToken] = useState(location.state.token || "");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0.0);
    const [updateQuantity, setUpdateQuantity] = useState(false);
    const [updatePrice, setUpdatePrice] = useState(false);
    const [product, setProduct] = useState(location.state.product);
    const navigate = useNavigate();

    const handleQuantity = () => {
        if (updateQuantity){
            updateProduct({"id": product.id, "name": product.name, "quantity": quantity, "price": product.price});
            setUpdateQuantity(false);
        }else{
            setUpdateQuantity(true);
        }
    }

    const handlePrice = () => {
        if (updatePrice){
            updateProduct({"id":product.id, "name": product.name, "quantity": product.quantity, "price": price});
            setUpdatePrice(false);
        }else{
            setUpdatePrice(true);
        }
    }

    const updateProduct = async (productData) => {
        try{
            const response = await fetch("/Supplier/Product", {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });
            if(response.ok){
                const data = await response.json();
                console.log(data);
                setProduct(data);
            }
        }catch(error){
            console.log("error" + error);
        }
    };

    const handleDelete = () => {
        deleteProduct({"id": product.id});
    }

    const deleteProduct = async (id) => {
        try{
            const response = await fetch("/Supplier/Product", {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
            });
            if (response.ok){
                navigate("/productList", {state:{token:token}});
            }
        }catch(error){
            console.log("error: " + error);
        }
    };
    
    return (
        <div style={{height: '200px', overflowY: 'auto'}}>
            <h1>{product.name}</h1> {!updateQuantity && <button onClick={handleDelete}>Delete product</button>}
            <ul>
                <li>
                    Quantity: {updateQuantity && <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>} {!updateQuantity && product.quantity} <button onClick={handleQuantity}>{updateQuantity ? 'Submit Change' : 'Change quantity'}</button> 
                </li>
                <li>
                    Price: {updatePrice && <input type="number" step="0.1" value={price} onChange={(e) => setPrice(e.target.value)}></input>} {!updatePrice && product.price} <button onClick={handlePrice}>{updatePrice ? 'Submit Change' : 'Change price'}</button>
                </li>
            </ul>
        </div>
    );
}

export default ProductView;
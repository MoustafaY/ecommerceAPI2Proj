import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function InventoryView(){
    const token = Cookies.get("token");
    const [products, setProducts] = useState([]);
    const [cartProducts, setCartProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch("/Inventory");
                const result = await response.json();
                setProducts(result);
            }catch(error){
                console.error('Error fetching data: ' , error);
            }
        };

        fetchData();
    }, []);
    
    return (
        <div style={{height: '200px', overflowY: 'auto'}}>
            <h1>Shopping Cart:</h1>
            <ul>
                {products.map((product) => (
                    <InventoryItem product={product} token={token} navigate={navigate} />
                ))}
            </ul>
        </div>
    );
}

function InventoryItem({product, token, navigate}){
    const handleClick = () => {
        navigate("/inventoryProductView", {state:{product:product}});
    }

    return (
        <>
            <li key={product.id}>{product.name}: {product.quantity}</li> <button onClick={handleClick}>View</button>
        </>
        
    )
}

export default InventoryView;
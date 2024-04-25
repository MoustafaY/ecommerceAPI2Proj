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

    const handleClick = (product) => {
        navigate("/inventoryProductView", {state:{product:product}});
    }
    
    return (
        <div>
        <div class="row">
          <div class="col d-flex justify-content-center">
            <h1 class="d-flex justify-content-center" style={{color:'#FFF4E9'}}>Inventory products</h1>
          </div>
        </div>
        <div class="row">
            <div class="d-flex justify-content-center">
                <div class="card" style={{padding:'10px'}}>
                    <div class="card-body" style={{height: '200px', overflowY: 'auto', backgroundColor: '#E6DCD1', padding:'0', borderRadius:'10px'}}>
                    <ul class="custom-list">
                        {products.map((product) => (
                            <li class="custom-item" onClick={() => handleClick(product)} key={product.id}>
                                <InventoryItem product={product} />
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

function InventoryItem({product}){

    return (
        <div class="row d-flex justify-content-evenly">
            <div class="col d-flex justify-content-start">
                {product.name}: {product.quantity}
            </div>
        </div>
        
    )
}

export default InventoryView;
import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function ShoppingCart(){
    const token = Cookies.get("token");
    const [products, setProducts] = useState([]);
    const [sum, setSum] = useState(0.0);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch("/Customer/ShoppingCart", {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });
                const result = await response.json();
                setProducts(result.products);
                setSum(result.sum);
            }catch(error){
                console.error('Error fetching data: ' , error);
            }
        };

        fetchData();
    }, []);

    const onDelete = async (product) => {
        try{
            const response = await fetch("/Customer/ShoppingCart", {
                method: "DELETE",
                headers:{
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product.id),
            });
            if (response.ok){
                const newProducts = products.filter(item => item.id != product.id);
                const newPrice = sum - (product.quantity * product.price).toFixed(1);
                setSum(parseFloat(newPrice).toFixed(1));
                setProducts(newProducts);
            }
        }catch(error){
            console.error("error: " + error);
        }
    };

    const onViewClick = () => {
        navigate("/inventoryView");
    }

    const onCreateClick = async () => {
        try{
            const response = await fetch("/Customer/Transcripts", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token
                },
            });
            if(response.ok){
                setProducts([]);
                setSum(0.0);
                navigate("/home");
            }else{
                const data = await response.json();
                setError(data.message);
            };
        }catch(error){
            console.error("Error " + error);
        }
    };
    
    return (
        <div>
            <div class="row">
            <div class="col d-flex justify-content-center">
                <h1 class="d-flex justify-content-center" style={{color:'#FFF4E9'}}>Shopping Cart</h1>
            </div>
            </div>
            <div class="row">
                <div class="d-flex justify-content-center">
                    <div class="card" style={{padding:'10px'}}>
                        <div class="card-body" style={{height: '200px', overflowY: 'auto', backgroundColor: '#E6DCD1', padding:'0', borderRadius:'10px'}}>
                            <div class="row">
                                <div class="col d-flex justify-content-center">
                                    {error && <p class="error">{error}</p>}
                                </div>
                            </div>
                            <ul class="custom-list">
                                {products.map((product) => (
                                    <li class="custom-item" key={product.id}>
                                        <ShoppingCartItem product={product} navigate={navigate} token={token} onDelete={onDelete} onErrorSet={setError} onProductSet={setProducts} onSumSet={setSum} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div class="row d-flex justify-content-evenly">
                            <div class="col d-flex justify-content-center">
                                <span>Total: {sum}</span>
                            </div>
                            <div class="col d-flex justify-content-center">
                                <button class="btn btn-sm custom-button" onClick={onViewClick}>View Products</button>
                            </div>
                            <div class="col d-flex justify-content-center">
                                <button class="btn btn-sm custom-button" onClick={onCreateClick}>Make order</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShoppingCartItem({product, navigate, token, onDelete, onErrorSet, onProductSet, onSumSet}){
    const [isEdit, setIsEdit] = useState(false);
    const [quantity, setQuantity] = useState(product.quantity);

    const handleClick = () =>{
        if(isEdit){
            if(validate()){
                product.quantity = quantity;
            updateProduct(product);
            setQuantity(product.quantity);
            setIsEdit(false);
            }
        }
        else{
            setIsEdit(true);
        }
    }

    const validate = () => {
        if(quantity <= 0){
            onErrorSet("Invalid quantity amount");
            return false;
        }
        return true;
    }

    const updateProduct = async(productData) => {
        try {
            const response = await fetch ("/Customer/ShoppingCart", {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });
            if(response.ok){
                const data = await response.json();
                onProductSet(data.products);
                onSumSet(data.sum);
            }
        }catch(error){
            console.error("Error: " + error);
        }
    };

    const handleDelete = () => {
        onDelete(product);
    }

    return (
        <div class="row d-flex justify-content-evenly">
            <div class="col d-flex justify-content-start">
                {product.name}: {!isEdit && product.quantity} {isEdit && <input class="custom-input" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>}
            </div>
            <div class="col d-flex justify-content-start">
                {!isEdit && <button class="btn btn-sm custom-button" onClick={handleClick}>Change product</button>} {isEdit && <button class="btn btn-sm custom-button" onClick={handleClick}>Submit change</button>}
            </div>
            <div class="col d-flex justify-content-start">
                <button class="btn btn-sm custom-button" onClick={handleDelete}>Remove from cart</button>
            </div>  
        </div>
    )

}

export default ShoppingCart;
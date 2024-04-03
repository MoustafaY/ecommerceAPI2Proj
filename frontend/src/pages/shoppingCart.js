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
        <div style={{height: '200px', overflowY: 'auto'}}>
            <h1>Shopping Cart:</h1>
            {error && <p>{error}</p>}
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <ShoppingCartItem product={product} navigate={navigate} token={token} onDelete={onDelete} onErrorSet={setError} />
                    </li>
                ))}
            </ul>
            <span>Total: {sum}</span>
            <button onClick={onViewClick}>View Products</button>
            <button onClick={onCreateClick}>Make order</button>
        </div>
    );
}

function ShoppingCartItem({product, navigate, token, onDelete, onErrorSet}){
    const [isEdit, setIsEdit] = useState(false);
    const [quantity, setQuantity] = useState(product.quantity);

    const handleClick = () =>{
        if(isEdit){
            if(validate()){
                product.quantity = quantity;
            updateProduct(product);
            setIsEdit(false);
            }
        }
        else{
            setIsEdit(true);
        }
    }

    const validate = () => {
        if(quantity < 0){
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
            if(!response.ok){
                const data = await response.json();
                onErrorSet(data.message);
            }
        }catch(error){
            console.error("Error: " + error);
        }
    };

    const handleDelete = () => {
        onDelete(product);
    }

    return (
        <>
            {product.name}: {!isEdit && product.quantity} {!isEdit && <button onClick={handleClick}>Change product</button>} {isEdit && <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>} {isEdit && <button onClick={handleClick}>Submit change</button>} <button onClick={handleDelete}>Remove from cart</button>
        </>
    )

}

export default ShoppingCart;
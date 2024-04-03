import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function ProductList(){
    const token = Cookies.get("token");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch("/Supplier/Products", {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });
                const result = await response.json();
                setProducts(result);
            }catch(error){
                console.error('Error fetching data: ' , error);
            }
        };

        fetchData();
    }, []);

    const onProductClick = (product) =>{
        navigate("/productView", {state:{product:product}});
    }

    const onCreateClick = () => {
        navigate("/productCreate");
    }
    
    return (
        <div style={{height: '200px', overflowY: 'auto'}}>
            <h1>Products</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id} onClick={() => onProductClick(product)} style={{ cursor: 'pointer' }} >
                        {product.name} 
                    </li>
                ))}
            </ul>
            <button onClick={onCreateClick}>Create new product</button>
        </div>
    );
}

export default ProductList;
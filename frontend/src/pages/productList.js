import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProductList(){
    const location = useLocation();
    const [token, setToken] = useState(location.state.token || "");
    const user = location.state.user;
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
        navigate("/productView", {state:{token:token, product:product}});
    }

    const onCreateClick = () => {
        navigate("/productCreate", {state:{token:token}});
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
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
        <div>
        <div class="row">
          <div class="col d-flex justify-content-center">
            <h1 class="d-flex justify-content-center" style={{color:'#FFF4E9'}}>Products</h1>
          </div>
        </div>
        <div class="row">
            <div class="d-flex justify-content-center">
                <div class="card" style={{padding:'10px'}}>
                    <div class="card-body" style={{height: '200px', overflowY: 'auto', backgroundColor: '#E6DCD1', padding:'0', borderRadius:'10px'}}>
                    <ul class="custom-list">
                        {products.map((product) => (
                            <li class="custom-item" key={product.id} onClick={() => onProductClick(product)} >
                                {product.name} 
                            </li>
                        ))}
                    </ul>
                    </div>
                    <div class="d-flex justify-content-center" style={{padding:'5px'}}>
                        <button class="btn btn-primary w-50 custom-button" onClick={onCreateClick}>Create new product</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default ProductList;
import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProductCreate(){
    const location = useLocation();
    const [token, setToken] = useState(location.state.token);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0.0);
    const navigate = useNavigate();

    const handleCreate = async (productData) => {
        try {
          const response = await fetch("/Supplier/Products", {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          });
    
          if (response.ok) {
            const data = await response.json();
            navigate("/home", {state:{token:token}});
          }else{
            const data = await response.json();
            setError(data.message)
          }
        }catch(error){
          console.error("Error: ", error);
          setError("An error occurred. Please try again later.");
        }
      };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleCreate({"name": name, "price": price, "quantity": quantity});
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <label>Name:
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}  />
            </label>
            <label>Quantity:
                <input type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}  />
            </label>
            <label>Price:
                <input type="number" step="0.1" name="price" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <input type="submit" />
        </form>
    );
}

export default ProductCreate;
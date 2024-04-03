import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function ProductCreate(){
    const token = Cookies.get("token");
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
            navigate("/home");
          }else{
            const data = await response.json();
            setError(data.message)
          }
        }catch(error){
          console.error("Error: ", error);
          setError("An error occurred. Please try again later.");
        }
      };

    const handleSubmit = () => {
        if(validate()){
          handleCreate({"name": name, "price": price, "quantity": quantity});
        }
    }

    const validate = () => {
      if(name === ''){
        setError("Name is required");
        return false;
      }
      else if(price <= 0.0 || quantity <= 0){
        setError("Invalid input");
        return false;
      }
      return true;
    }
    
    return (
        <div>
          {error && <span>{error}</span>}
            <label>Name:
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}  />
            </label>
            <label>Quantity:
                <input type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}  />
            </label>
            <label>Price:
                <input type="number" step="0.1" name="price" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <button onClick={handleSubmit}>Create product</button>
        </div>
    );
}

export default ProductCreate;
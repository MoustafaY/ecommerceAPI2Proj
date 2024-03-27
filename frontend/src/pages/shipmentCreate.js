import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ShipmentCreate(){
    const location = useLocation();
    const [token, setToken] = useState(location.state.token);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [shipment, setShipment] = useState([]);
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
              setName(result[0].name);
              setProducts(result);
          }catch(error){
              console.error('Error fetching data: ' , error);
          }
      };

      fetchData();
  }, []);

    const handleCreate = async (shipmentData) => {
        try {
          const response = await fetch("/Supplier/Shipments", {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(shipmentData),
          });
    
          if (response.ok) {
            const data = await response.json();
            navigate("/home", {state:{token:token}});
          }else{
            const data = await response.json();
            setError(data.message)
          }
        }catch(error){
          console.error("Error: "+ error);
          setError("An error occurred. Please try again later.");
        }
      };

    const handleClick = () => {
        shipment.push({"name": name, "quantity": quantity});
        setQuantity(0);
    }

    const handleSubmit = () => {
        handleCreate({"products": shipment});
    }
    
    return (
        <>
            <div>
                <label>Name:
                    <select value={name} onChange={(e) => setName(e.target.value)}>
                      {products.map((fetch_product, index) => (
                        <option key={index} value={fetch_product.name}>{fetch_product.name}</option>
                      ))}
                    </select>
                </label>
                <label>Quantity:
                    <input type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}  />
                </label>
                <button onClick={handleClick}>Add another product</button>
                <button onClick={handleSubmit}>Make shipment</button>           
            </div>
            <h1>Products to ship:</h1>
            <ul>
                {shipment.map((shipment_product, index) => (
                    <li key={index}>
                        {shipment_product.name} {shipment_product.quantity}
                    </li>
                ))}
            </ul>
        </>
        
    );
}

export default ShipmentCreate;
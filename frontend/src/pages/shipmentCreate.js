import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function ShipmentCreate(){
    const token = Cookies.get("token");
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
              if(result.length > 0){
                setName(result[0].name);
              }
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
            navigate("/home");
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
        if(validate()){
          const newShipment = shipment.map(item => {
            if(item.name === name){;
              return{...item, quantity: parseInt(item.quantity) + parseInt(quantity)};
            }
            else{
              return item;
            }
          });
          if(shipment.find(item => item.name === name)){
            setShipment(newShipment);
          }
          else{
            shipment.push({"name": name, "quantity": quantity});
          }
          setError("");
          setQuantity(0);
        }
    }

    const handleSubmit = () => {
      if(validateShipments()){
        handleCreate({"products": shipment});
      } 
    }

    const validate = () => {
      if(quantity <= 0){
        setError("Invalid quantity amount");
        return false;
      }
      return true;
    }

    const validateShipments = () => {
      if(shipment.length === 0){
        setError("Shipment is empty");
        return false;
      }
      return true;
    }
    
    return (
        <div>
            <div class="row" style={{paddingTop:'10px'}}>
              <div class="d-flex justify-content-center">
                <div class="card" style={{padding:'10px'}}>
                <div class="row">
                      <div class="col d-flex justify-content-center">
                        {error && <p class="error">{error}</p>}
                      </div>
                    </div>
                    <div class="card-body" style={{height: '200px', overflowY: 'auto', backgroundColor: '#E6DCD1', padding:'0', borderRadius:'10px'}}>
                      <ul class="custom-list">
                          {shipment.map((shipment_product, index) => (
                              <li class="custom-item" key={index}>
                                  {shipment_product.name} {shipment_product.quantity}
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div class="row d-flex justify-content-evenly">
                    <div class="col d-flex justify-content-center">
                      <label>Product:
                          <select value={name} onChange={(e) => setName(e.target.value)}>
                            {products.map((fetch_product, index) => (
                              <option key={index} value={fetch_product.name}>{fetch_product.name}</option>
                            ))}
                          </select>
                      </label>
                    </div>
                    <div class="col d-flex justify-content-center">
                      <label>Quantity:
                          <input class="custom-input" type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}  />
                      </label>
                    </div>
                  </div>
                  <div class="row d-flex justify-content-evenly">
                    <div class="col d-flex justify-content-center">
                      <button class="btn btn-sm custom-button" onClick={handleClick}>Add product</button>
                    </div>
                    <div class="col d-flex justify-content-center">
                      <button class="btn btn-sm custom-button" onClick={handleSubmit}>Make shipment</button>  
                    </div>
                  </div>
                </div>
              </div>            
            </div>
        </div>
        
    );
}

export default ShipmentCreate;
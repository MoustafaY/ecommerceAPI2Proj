import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function ShipmentList(){
    const location = useLocation();
    const token = Cookies.get("token");
    const [shipments, setShipments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch("/Supplier/Shipments", {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });
                const result = await response.json();
                setShipments(result);
            }catch(error){
                console.error('Error fetching data: ' , error);
            }
        };

        fetchData();
    }, []);

    const onshipmentClick = (shipment) =>{
        navigate("/shipmentView", {state:{shipment:shipment}});
    }

    const onCreateClick = () => {
        navigate("/shipmentCreate");
    }
    
    return (
        <div>
        <div class="row">
          <div class="col d-flex justify-content-center">
            <h1 class="d-flex justify-content-center" style={{color:'#FFF4E9'}}>Shipments</h1>
          </div>
        </div>
        <div class="row">
            <div class="d-flex justify-content-center">
                <div class="card" style={{padding:'10px'}}>
                    <div class="card-body" style={{height: '200px', overflowY: 'auto', backgroundColor: '#E6DCD1', padding:'0', borderRadius:'10px'}}>
                        <ul class="custom-list">
                            {shipments.map((shipment) => (
                                <li class="custom-item" key={shipment.id} onClick={() => onshipmentClick(shipment)} style={{ cursor: 'pointer' }} >
                                    {shipment.date} 
                                </li>
                            ))}
                        </ul>
        </div>
        <div class="d-flex justify-content-center" style={{padding:'5px'}}>
            <button class="btn btn-primary w-50 custom-button" onClick={onCreateClick}>Make a shipment</button>
        </div>
        </div>
        </div>
        </div>
        </div>
    );
}

export default ShipmentList;
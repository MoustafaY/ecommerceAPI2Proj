import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ShipmentList(){
    const location = useLocation();
    const [token, setToken] = useState(location.state.token || "");
    const user = location.state.user;
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
        navigate("/shipmentView", {state:{token:token, shipment:shipment}});
    }

    const onCreateClick = () => {
        navigate("/shipmentCreate", {state:{token:token}});
    }
    
    return (
        <div style={{height: '200px', overflowY: 'auto'}}>
            <h1>shipments</h1>
            <ul>
                {shipments.map((shipment) => (
                    <li key={shipment.id} onClick={() => onshipmentClick(shipment)} style={{ cursor: 'pointer' }} >
                        {shipment.date} 
                    </li>
                ))}
            </ul>
            <button onClick={onCreateClick}>Make a shipment</button>
        </div>
    );
}

export default ShipmentList;
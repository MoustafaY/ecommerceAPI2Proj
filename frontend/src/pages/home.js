import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faCartShopping, faReceipt, faMoneyBill, faEgg, faTruck } from '@fortawesome/free-solid-svg-icons';


function Home(){
  const user = Cookies.get("user");
  const token = Cookies.get("token");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try{
            const response = await fetch("/User", {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const result = await response.json();
            setName(result.name);
        }catch(error){
            console.error('Error fetching data: ' , error);
        }
    };

    fetchData();
}, []);

  const handleUpdate = () => {
    navigate("/update");
  };

  const handleLogout = async () => {
    try{
      const response = await fetch("/logout", {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok){
        Cookies.remove("token");
        navigate("/");
      }
    }catch (error){
      console.error("Error", error);
    }
  };

  const handleDelete = async() =>{
    try{
      const path = "/"+user;
      const response = await fetch(path, {
        method: "DELETE",
        headers: {
        Authorization: "Bearer " + token,
        },
      });
    if(response.ok){
      navigate("/");
    }
    }catch(error){
      console.error("Error", error);
    }
  };

  const handleProductsView = () =>{
    navigate("/productList");
  };

  const handleShipmentsView = () => {
    navigate("/shipmentList");
  };

  const handleShoppingCartView = () => {
    navigate("/shoppingCart");
  }

  const handleTranscriptList = () =>{
    navigate("/transcriptList");
  }
  
  const handleBalanceView = () => {
    navigate("/balanceView");
  }
    
  return (
    <div>
        <div class="row">
          <div class="col d-flex justify-content-center">
            <h1 className="d-flex justify-content-center" style={{color:'#FFF4E9'}}>Welcome, {name}</h1>
          </div>
        </div>
        <div class="container">
        <div class="row">
          <div class="col d-flex justify-content-evenly">
            <div class="icon" style={{textAlign: 'center'}}>
              <FontAwesomeIcon  onClick={handleUpdate} icon={faPenToSquare} style={{ fontSize: '48px' }} />
              <p>Change name</p>
            </div>
            <div class="icon" style={{textAlign: 'center'}}>
              <FontAwesomeIcon onClick={handleDelete} icon={faTrash} style={{ fontSize: '48px' }} />
              <p>Delete Account</p>
            </div>
            {user === "Supplier" && <div class="icon" style={{textAlign:'center'}}><FontAwesomeIcon onClick={handleProductsView} icon={faEgg} style={{fontSize: '48px'}} /><p>Products</p></div>}
            {user === "Supplier" && <div class="icon" style={{textAlign:'center'}}><FontAwesomeIcon onClick={handleShipmentsView} icon={faTruck} style={{fontSize: '48px'}} /><p>Shipments</p></div>}
            {user === "Customer" && <div class="icon" style={{textAlign:'center'}}><FontAwesomeIcon onClick={handleShoppingCartView} icon={faCartShopping} style={{fontSize: '48px'}} /><p>Shopping Cart</p></div>}
            {user === "Customer" && <div class="icon" style={{textAlign:'center'}}><FontAwesomeIcon onClick={handleTranscriptList} icon={faReceipt} style={{fontSize: '48px'}} /><p>Transcripts</p></div>}
            {user === "Customer" && <div class="icon" style={{textAlign:'center'}}><FontAwesomeIcon onClick={handleBalanceView} icon={faMoneyBill} style={{fontSize: '48px'}} /><p>Balance</p></div>}
          </div>
        </div>
        </div>
    </div>
  );
}


export default Home;
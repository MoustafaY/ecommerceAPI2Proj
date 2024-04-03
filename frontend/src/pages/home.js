import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

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
        <h1>Welcome, {name}</h1>
        <button onClick={handleLogout}>Log out</button>
        <button onClick={handleUpdate}>Change name</button>
        <button onClick={handleDelete}>Delete account</button>
        {user === "Supplier" && <button onClick={handleProductsView}>View Products</button>}
        {user === "Supplier" && <button onClick={handleShipmentsView}>View Shipments</button>}
        {user === "Customer" && <button onClick={handleShoppingCartView}>View Shopping cart</button>}
        {user === "Customer" && <button onClick={handleTranscriptList}>View Transcripts</button>}
        {user === "Customer" && <button onClick={handleBalanceView}>View Balance</button>}
    </div>
  );
}

export default Home;
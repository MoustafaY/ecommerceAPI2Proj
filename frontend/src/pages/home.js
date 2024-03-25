import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Home(){
  const location = useLocation();
  const [client, setClient] = useState({});
  const [token, setToken] = useState(location.state.token || "");
  const user = location.state.user;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try{
            const path = "/" + user;
            const response = await fetch(path, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const result = await response.json();
            setClient(result);
        }catch(error){
            console.error('Error fetching data: ' , error);
        }
    };

    fetchData();
}, []);

  const handleUpdate = () => {
    navigate("/update", {state:{token:token, user:user}});
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
    navigate("/productList", {state:{token:token, user:user}});
  };
    
  return (
    <div>
        <h1>Welcome, {client.name}</h1>
        <button onClick={handleLogout}>Log out</button>
        <button onClick={handleUpdate}>Change name</button>
        <button onClick={handleDelete}>Delete account</button>
        {user === "Supplier" && <button onClick={handleProductsView}>View Products</button>}
    </div>
  );
}

export default Home;
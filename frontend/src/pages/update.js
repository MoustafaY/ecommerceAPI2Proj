import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Update(){
  const location = useLocation();
  const [token, setToken] = useState(location.state.token || "");
  const [name, setName] = useState("");
  const user = location.state.user;
  const navigate = useNavigate();

  const handleSubmit = async (userData) => {
    try{
        const path = "/" + user.user;
        const response = await fetch(path, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (response.ok){
        const data =  await response.json();
        navigate("/home", {state:{token:token}});
      }
    }catch (error){
      console.error("Error", error);
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    handleSubmit({"name": name});
  }
    
  return (
    <div>
        <form onSubmit={handleClick}>
            <label>New name:
            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}  />
            </label>
            <input type="submit" />
        </form>
    </div>
  );
}

export default Update;
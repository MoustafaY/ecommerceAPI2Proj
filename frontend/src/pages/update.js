import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Update(){
  const location = useLocation();
  const token = Cookies.get("token");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const user = Cookies.get("user");
  const navigate = useNavigate();

  const handleSubmit = async (userData) => {
    try{
        const path = "/" + user;
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
        navigate("/home");
      }
      else{
        const data = await response.json();
        setError(data.message);
      }
    }catch (error){
      console.error("Error", error);
    }
  };

  const handleClick = () => {
    if(validate()){
      handleSubmit({"name": name});
    }
  }

  const validate = () => {
    if(name === ''){
      setError("Name is required");
      return false;
    }
    return true;
  }
    
  return (
    <div>
      {error && <p>{error}</p>}
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
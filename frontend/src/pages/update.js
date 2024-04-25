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
      <div class="row" style={{paddingTop:'10px'}}>
          <div class="d-flex justify-content-center">
              <div class="card" style={{padding:'10px'}}>
                  {error && <p class="error">{error}</p>}
                  <div class="card-body">
                      <div class="row d-flex justify-content-start">
                        <input class="form-control w-100" placeholder="New name" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}  />
                        <button class="btn btn-sm custom-button" onClick={handleClick}>Submit</button>
                      </div>
                  </div>
                </div>
            </div>
          </div>
    </div>
  );
}

export default Update;
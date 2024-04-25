import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

function Signup(){
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSignup = async (userData) => {
    try {
      const response = await fetch("/Signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set("token", data.token);
        navigate("/home");
      }else{
        const data = await response.json();
        setError(data.message)
      }
    }catch(error){
      console.error("Error: " + error);
      setError(error.message);
    }
  };

      return (
        <>
          <div class="d-flex justify-content-center">
            <h1 style={{color:'#FFF4E9'}}>Be a Minizon member</h1>
          </div>
          <div>
            <SignupCard onSign={handleSignup} setError={setError} error={error} />
          </div>
        </>
      );
}

function SignupCard({onSign, setError, error}){
  return(
    <div class="container d-flex justify-content-center">
      <div class="card">
      <SignupForm onSign={onSign} setError={setError} error={error} />
    </div>
    </div>
  );
}

function SignupForm({onSign, setError, error}){
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("Customer");

  const handleSubmit = () => {
    if(validate()){
      Cookies.set("user", type);
      onSign({"name": name, "email": email, "password": password, "user": type});
    }
  }

  const validate = () =>{
    if(name === ''){
      setError("Name is required");
      return false;
    }
    else if(email === ''){
      setError("Email is required");
      return false;
    }
    else if(password === ''){
      setError("Password is required");
      return false;
    }
    return true;
  }

  return(
    <div class="card-body">
      {error && <div class="row"><div class="col d-flex justify-content-center"><p class="error">{error}</p></div></div>}
      <div class="row">
        <div class="col d-flex justify-content-center">
          <input class="form-control w-100" type="text" placeholder="Name" name="name" value={name} onChange={(e) => setName(e.target.value)}  />
        </div>
      </div>
      <div class="row">
        <div class="col d-flex justify-content-center">
          <input class="form-control w-100" type="text" placeholder="Email" name="username" value={email} onChange={(e) => setEmail(e.target.value)}  />
        </div>
      </div>
      <div class="row">
        <div class="col d-flex justify-content-center">
          <input class="form-control w-100" type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
        <div class="row">
          <div class="col d-flex justify-content-start">
            <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Customer">Customer</option>
            <option value="Supplier">Supplier</option>
            </select>
          </div>
        </div>
          <button class="btn btn-primary w-100 custom-button" onClick={handleSubmit}>Sign in</button>
    </div>
  )
}

export default Signup;
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
      console.error("Error: ". error);
      setError("An error occurred. Please try again later.");
    }
  };

      return (
        <>
          <h1>Sign up</h1>
          {error && <p>{error}</p>}
          <div>
            <SignupCard onSign={handleSignup} setError={setError} />
          </div>
        </>
      );
}

function SignupCard({onSign, setError}){
  return(
    <>
      <SignupForm onSign={onSign} setError={setError} />
    </>
  );
}

function SignupForm({onSign, setError}){
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
    <div>
        <label>Name:
            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}  />
        </label>
        <label>Email:
            <input type="text" name="username" value={email} onChange={(e) => setEmail(e.target.value)}  />
        </label>
        <label>Password:
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>Type of user:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Customer">Customer</option>
          <option value="Supplier">Supplier</option>
        </select>
        </label>
          <button onClick={handleSubmit}>Sign in</button>
    </div>
  )
}

export default Signup;
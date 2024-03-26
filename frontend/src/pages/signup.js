import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

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
        navigate("/home", {state:{token:data.token}});
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
            <SignupCard onSign={handleSignup} />
          </div>
        </>
      );
}

function SignupCard({onSign}){
  return(
    <>
      <SignupForm onSign={onSign} />
    </>
  );
}

function SignupForm({onSign}){
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("Customer");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSign({"name": name, "email": email, "password": password, "user": type});
  }

  return(
    <form onSubmit={handleSubmit}>
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
          <input type="submit" />
    </form>
  )
}

export default Signup;
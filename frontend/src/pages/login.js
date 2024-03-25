import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

function Login(){
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (userData) => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/home", {state:{name:data.name, token:data.token, user:data.user}});
      }else{
        setError("Incorrect email or password")
      }
    }catch(error){
      console.error("Error: ". error);
      setError("An error occurred. Please try again later.");
    }
  };

      return (
        <>
          <h1>Login</h1>
          {error && <p>{error}</p>}
          <div>
            <LoginCard onLogin={handleLogin} />
          </div>
        </>
      );
}

function LoginCard({onLogin}){
  return(
    <>
      <LoginForm onLogin={onLogin} />
    </>
  );
}

function LoginForm({onLogin}){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("Customer");

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({"email": email, "password": password, "user": type});
  }

  return(
    <form onSubmit={handleSubmit}>
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
      <Link to="/signup">
        <button>Sign up</button>
      </Link>
    </form>
  )
}

export default Login;
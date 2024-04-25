import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

function Login(){
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [token, setToken] = useState(Cookies.get("token") || null);

  useEffect(() => {
    if(token !== null){
      Cookies.remove("token");
      Cookies.remove("user");
      handleLogout();
    }

}, []);

const handleLogout = async () => {
  try{
    const response = await fetch("/logout", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if(response.ok){
      setToken(null);
    }

  }catch (error){
    console.error("Error" + error);
  }
};

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
        Cookies.set("token", data.token);
        navigate("/home");
      }else{
        const data = await response.json();
        setError(data.message)
      }
    }catch(error){
      console.error("Error: " + error);
      setError("An error occurred. Please try again later.");
    }
  };

      return (
        <>
          <div class="d-flex justify-content-center">
            <h1 style={{color:'#FFF4E9'}}>Minizon</h1>
          </div>
          <div>
            <LoginCard onLogin={handleLogin} setError={setError} error={error} />
          </div>
        </>
      );
}

function LoginCard({onLogin, setError, error}){
  return(
    <div class="container d-flex justify-content-center">
    <div class="card">
      <LoginForm onLogin={onLogin} setError={setError} error={error} />
    </div>
    </div>
  );
}

function LoginForm({onLogin, setError, error}){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("Customer");

  const handleSubmit = () => {
    if(validate()){
      Cookies.set("user", type);
      onLogin({"email": email, "password": password, "user": type});
    }
  }

  const validate = () => {
    if(email === ''){
      setError("Email is required")
      return false;
    }
    else if(password === ''){
      setError("Password is required")
      return false;
    }
    return true;
  }

  return(
      <div class="card-body">
      {error && <div class="row"><div class="col d-flex justify-content-center"><p class="error">{error}</p></div></div>}
      <div class="row">
        <div class="col d-flex justify-content-center">
          <input class="form-control w-100" type="text" name="username" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}  />
        </div>
      </div>
      <div class="row">
        <div class="col d-flex justify-content-center">
          <input class="form-control w-100" type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
        <div class="row">
        <div class="col d-flex justify-content-center">
        <button class="btn btn-primary w-100 custom-button" onClick={handleSubmit}>Log in</button>
        </div>
        </div>
        <div class="row">
        <div class="col d-flex justify-content-center">
        <Link class="btn btn-primary w-100 custom-button" to="/signup">
          Sign up
        </Link>
        </div>
        </div>
      </div>
  )
}

export default Login;
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
    console.error("Error", error);
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
      console.error("Error: ". error);
      setError("An error occurred. Please try again later.");
    }
  };

      return (
        <>
          <h1>Login</h1>
          {error && <p>{error}</p>}
          <div>
            <LoginCard onLogin={handleLogin} setError={setError} />
          </div>
        </>
      );
}

function LoginCard({onLogin, setError}){
  return(
    <>
      <LoginForm onLogin={onLogin} setError={setError} />
    </>
  );
}

function LoginForm({onLogin, setError}){
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
    <div>
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
      <button onClick={handleSubmit}>Log in</button>
      <Link to="/signup">
        <button>Sign up</button>
      </Link>
    </div>
  )
}

export default Login;
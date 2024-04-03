import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


function BalanceView (){
    const location = useLocation();
    const token = Cookies.get("token");
    const navigate = useNavigate();
    const [isPay, setIsPay] = useState(false);
    const [balance, setBalance] = useState(0.0);
    const [displayBalance, setDisplayBalance] = useState(0.0);
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch("/Customer/balance", {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });
                const result = await response.json();
                setBalance(result);
                setDisplayBalance(result);
            }catch(error){
                console.error('Error fetching data: ' , error);
            }
        };
    
        fetchData();
    }, []);


    const handleClick = () =>{
        if(isPay){
            if(validate()){
                makePayment(balance);
                setIsPay(false);
            } 
        }
        else{
            setIsPay(true);
        }
    }

    const makePayment = async (balance) => {
        try{
            const response = await fetch("/Customer", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"payment": balance}),
            });

            if(response.ok){
                const data = await response.json();
                setDisplayBalance(data);
            }else{
                const data = await response.json();
                setError(data.message);
            }
        }catch(error){
            console.error("Error " + error);
        }
    };

    const onHomeClick = () =>{
        navigate("/home");
    }

    const validate = () => {
        if(balance <= 0){
            setError("Invalid balance amount");
            return false;
        }
        return true;
    }


    return(
        <>
        <h1>Balance:</h1>
        {error && <p>{error}</p>}
        <span>{displayBalance}</span> {!isPay && <button onClick={handleClick}>Pay balance</button>} {isPay && <input type="number" step="0.1" value={balance} onChange={(e) => setBalance(e.target.value)}></input>} {isPay && <button onClick={handleClick}>Submit</button>} <button onClick={onHomeClick}>Go to home page</button>
        </>
    )

}

export default BalanceView;
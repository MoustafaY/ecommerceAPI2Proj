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

    const validate = () => {
        if(balance <= 0){
            setError("Invalid payment amount");
            return false;
        }
        else if(displayBalance - balance < 0){
            setError("Payment exceeds balance");
            return false;
        }
        return true;
    }


    return(
        <div>
            <div class="row">
                <div class="col d-flex justify-content-center">
                    <h1 class="d-flex justify-content-center" style={{color:'#FFF4E9'}}>Balance</h1>
                </div>
            </div>
            <div class="row">
                <div class="d-flex justify-content-center">
                    <div class="card" style={{padding:'10px'}}>
                        {error && <p class="error">{error}</p>}
                        <div class="card-body">
                            <div class="row d-flex justify-content-evenly">
                                <div class="col d-flex justify-content-start">
                                    <span>Balance: {displayBalance}</span>
                                </div>
                                <div class="col d-flex justify-content-start">
                                    {!isPay && <button class="btn btn-sm custom-button" onClick={handleClick}>Pay balance</button>}
                                    {isPay && <input class="custom-input" type="number" step="0.1" value={balance} onChange={(e) => setBalance(e.target.value)}></input>}
                                </div>
                                <div class="col d-flex jsutify-content-start">
                                    {isPay && <button class="btn btn-sm custom-button" onClick={handleClick}>Submit</button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default BalanceView;
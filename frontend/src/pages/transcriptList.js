import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function TranscriptList(){
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    const [transcripts, setTranscripts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch("/Customer/Transcripts", {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });
                const result = await response.json();
                setTranscripts(result);
            }catch(error){
                console.error('Error fetching data: ' , error);
            }
        };

        fetchData();
    }, []);

    const onTranscriptClick = (transcript) =>{
        Cookies.set("transcript", transcript);
        navigate("/transcriptView", {state:{transcript:transcript}});
    }
    
    return (
        <div style={{height: '200px', overflowY: 'auto'}}>
            <h1>transcripts</h1>
            <ul>
                {transcripts.map((transcript) => (
                    <li key={transcript.id} onClick={() => onTranscriptClick(transcript)} style={{ cursor: 'pointer' }} >
                        {transcript.date} 
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TranscriptList;
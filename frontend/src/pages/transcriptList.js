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
        <div>
            <div class="row">
                <div class="col d-flex justify-content-center">
                    <h1 class="d-flex justify-content-center" style={{color:'#FFF4E9'}}>Transcripts</h1>
                </div>
            </div>
            <div class="row">
            <div class="d-flex justify-content-center">
                <div class="card" style={{padding:'10px'}}>
                    <div class="card-body" style={{height: '200px', overflowY: 'auto', backgroundColor: '#E6DCD1', padding:'0', borderRadius:'10px'}}>
                    <ul class="custom-list">
                        {transcripts.map((transcript) => (
                            <li class="custom-item" key={transcript.id} onClick={() => onTranscriptClick(transcript)} style={{ cursor: 'pointer' }} >
                                {transcript.date} 
                            </li>
                        ))}
                    </ul>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default TranscriptList;
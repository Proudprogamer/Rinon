"use client"
import ProtectedRoute from "@/app/protected/ProtectedRoute";
import {useState, ChangeEvent} from "react";
import axios from "axios";

interface data {
    message: string,
    filename: string,
    supabaseUrl: string,
    analysis_generated: {
        number_of_stones: number,
        sizepos: spobj[],
        general_analysis: string,
    }
}

interface spobj {
    size: string, 
    location: string
}

function Ct(){
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<data | null>(null);
    const uploadImage = async ()=>{
        if(!file){
            console.log("file not selected");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try{
            const response = await axios.post(
                "http://localhost:5000/ct/v1/upload",
                formData
            );
            console.log(response.data);
            setData(response.data);
        } catch(e){
            console.log(e);
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    return (
            <div>
                <input type="file" accept="image/*" onChange={handleFileChange}/>
                <button onClick={uploadImage}>Upload Image</button>
                {data && 
                    <div>
                        <p>{data.message}</p>
                        <img src={data.supabaseUrl}></img>
                        <p>Stones: {data.analysis_generated.number_of_stones}</p>
                        {data.analysis_generated.sizepos.map((obj)=>{
                            return (<p>Stone -- {obj.size} -- {obj.location}</p>)
                        })}
                        <p>Analysis: {data.analysis_generated.general_analysis}</p>
                    </div>
                }
                
            </div>
    )
}

export default Ct;
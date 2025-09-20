"use client"
import ProtectedRoute from "@/app/protected/ProtectedRoute";
import {useState, ChangeEvent} from "react";
import axios from "axios";


function Ct(){
    const [file, setFile] = useState<File | null>(null);
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
            </div>
    )
}

export default Ct;
"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect, ChangeEvent } from 'react';
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

export default function DiseaseDetailsPage() {
  const params = useParams();
  const diseaseId = params.diseaseId as string;
  
  useEffect(()=>{
    const fetch = async()=>{
      try{
        const data = {
          diseaseId: diseaseId
        }
        const response = await axios.post(
          "http://localhost:5000/disease/get-disease-by-id",
          data
        );
        console.log(response.data);
        let text = response.data.disease.analysis;
        console.log(text);
        setData(JSON.parse(text));
        setType(response.data.disease.type);
      } catch(e){
          console.log(e);
      }
    }
    fetch();
  }, []);
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<data | null>(null);
    const [type, setType] = useState("");

    const [risk, setRisk] = useState("");
    const [gravity, setGravity] = useState(0);
    const [ph, setPh] = useState(0);
    const [osmo, setOsmo] = useState(0);
    const [cond, setCond] = useState(0);
    const [urea, setUrea] = useState(0);
    const [calc, setCalc] = useState(0);

    const uploadImage = async ()=>{
        if(!file){
            console.log("file not selected");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        formData.append('diseaseId', diseaseId);
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

    const handleSubmit = async()=>{
        const data = [[gravity, ph, osmo, cond, urea, calc]];
        try{
            const response = await axios.post(
                "http://localhost:5000/urinalysis/v1/upload",
                data
            );
            console.log(response.data);
            setRisk(response.data.analysis);
        } catch(e){
            console.log(e);
        }
    }
  
  return (
    <div>
      <p>This is the disease id : {diseaseId}</p>
      <div>
        {type==="ct scan" ? (
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange}/>
            <button onClick={uploadImage}>Upload Image</button>
          </div>
        ) : (
          <div>
            <p>Urinalysis</p>
            
            <label htmlFor="gravity">Gravity</label>
            <input
                id="gravity"
                type="number"
                value={gravity}
                onChange={(e) => setGravity(e.target.value ? parseFloat(e.target.value) : 0)}
            />
            
            <label htmlFor="ph">pH</label>
            <input
                id="ph"
                type="number"
                value={ph}
                onChange={(e) => setPh(e.target.value ? parseFloat(e.target.value) : 0)}
            />

            <label htmlFor="osmo">Osmo</label>
            <input
                id="osmo"
                type="number"
                value={osmo}
                onChange={(e) => setOsmo(e.target.value ? parseFloat(e.target.value) : 0)}
            />

            <label htmlFor="cond">Cond</label>
            <input
                id="cond"
                type="number"
                value={cond}
                onChange={(e) => setCond(e.target.value ? parseFloat(e.target.value) : 0)}
            />

            <label htmlFor="urea">Urea</label>
            <input
                id="urea"
                type="number"
                value={urea}
                onChange={(e) => setUrea(e.target.value ? parseFloat(e.target.value) : 0)}
            />

            <label htmlFor="calc">Calc</label>
            <input
                id="calc"
                type="number"
                value={calc}
                onChange={(e) => setCalc(e.target.value ? parseFloat(e.target.value) : 0)}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}
        
      </div>
      <hr/>
      <div>
        {data && 
            <div>
              {type==="ct scan" ? (
                <div>
                <p>{data.message}</p>
                <img src={data.supabaseUrl}></img>
                <p>Stones: {data.analysis_generated.number_of_stones}</p>
                {data.analysis_generated.sizepos.map((obj)=>{
                    return (<p>Stone -- {obj.size} -- {obj.location}</p>)
                })}
                <p>Analysis: {data.analysis_generated.general_analysis}</p>
                </div>
              ) : (
                <div>data</div>
              )}
            </div>
        }
      </div>
    </div>
  );
}
"use client"
import ProtectedRoute from "@/app/protected/ProtectedRoute";
import {useState, ChangeEvent} from "react";
import axios from "axios";



function Urinalysis(){
    
    const [risk, setRisk] = useState("");
    const [gravity, setGravity] = useState(0);
    const [ph, setPh] = useState(0);
    const [osmo, setOsmo] = useState(0);
    const [cond, setCond] = useState(0);
    const [urea, setUrea] = useState(0);
    const [calc, setCalc] = useState(0);

    const handleSubmit = async()=>{
        const data = [[gravity, ph, osmo, cond, urea, calc]];

        try{
            const response = await axios.post(
                "https://rinon.onrender.com/urinalysis/v1/upload",
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
            <p>{risk}</p>
        </div>
    )
}

export default Urinalysis;
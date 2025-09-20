import {useState} from 'react'

const FileUpload = () => {
    const [file, setFile] = useState();
    const uploadImage = async ()=>{
        const formData = new FormData();
        formData.append('image', file);
        try{
            const response = await fetch("http://localhost:3000/api/upload",{
                method: "POST",
                body: formData,
            });
            console.log(response);
        } catch(e){
            console.log(e);
        }
    }
  return (
    <div>
        <input type="file" accept="image/*" onChange={(e)=>{setFile(e.target.files[0])}}/>
        <button onClick={uploadImage}>Upload Image</button>
    </div>
  )
}

export default FileUpload
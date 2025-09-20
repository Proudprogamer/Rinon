
import fs from "fs"
import dotenv from "dotenv";
dotenv.config();


const API_KEY:string = process.env["GEM_API_KEY"] as string
//const API_KEY = "AIzaSyBX9ZJlv2-IfCdLZclALgVCE4uPtLlbhdU"
async function analyzeKidneyCT(imagePath:string, apiKey:string) {
    try {
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString('base64');
        
        const prompt = `Analyze this kidney CT scan for kidney stones. Return only valid JSON in this exact format:
{
    "number_of_stones": number,
    "sizepos": [
        {"size": "X mm", "location": "description"}
    ],
    "general_analysis": "brief description"
}

If no stones found, set number_of_stones to 0 and sizepos to empty array.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }]
            })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        const cleanText = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanText);
        
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('An unexpected error occurred:', error);
        }
        return null;
    }
}

async function gemCt(path:string) {
    const apiKey = API_KEY;
    //const imagePath = './samples/image.png';
    const imagePath = path;
    const result = await analyzeKidneyCT(imagePath, apiKey);
    return result;
}

export default gemCt;

const API_KEY = "AIzaSyBX9ZJlv2-IfCdLZclALgVCE4uPtLlbhdU";

const fs = require('fs');

async function analyzeKidneyCT(imagePath, apiKey) {
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
        console.error('Error:', error.message);
        return null;
    }
}

async function main() {
    const apiKey = API_KEY;
    const imagePath = './samples/image.png';
    
    const result = await analyzeKidneyCT(imagePath, apiKey);
    console.log(JSON.stringify(result, null, 2));
}


main();
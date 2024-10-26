const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Endpoint to handle image uploads and validation
app.post('/validate', upload.single('image'), async (req, res) => {
    const { prompt } = req.body;
    const imagePath = req.file.path;

    try {
        // Read the image file
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [
                {
                    role: 'user',
                    content: `Given this image data: ${base64Image}, please analyze it and respond with an appropriate action based on the following actions: 
                    1. Throwing away
                    2.
                    3.
                    4.
                    5.
                    6.
                    7.
                    8..`
                }
            ],
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        // Clean up the uploaded file
        fs.unlinkSync(imagePath);

        // Return the OpenAI response
        res.json(response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error validating image:', error);
        res.status(500).send('An error occurred while processing the image.');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

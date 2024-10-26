const axios = require('axios');
require('dotenv').config();

// Function to validate the uploaded image with OpenAI
const validateImage = async (req, res) => {
    const { prompt } = req.body;
    const imageBuffer = req.file.buffer; // Access the image directly from memory
    const base64Image = imageBuffer.toString('base64');

    try {
        // Send the base64 image and prompt to OpenAI
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [
                {
                    role: 'user',
                    content: `Analyze the following image data and determine if it matches the description of the activity: ${prompt}. Image data (base64): ${base64Image}`
                }
            ],
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        // Return the OpenAI response to the client
        res.json({ message: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error validating image:', error);
        res.status(500).send('An error occurred while processing the image.');
    }
};

module.exports = { validateImage };

const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.API_KEY});

// Define the system prompt
const systemPrompt = 
  `  You are a knowledgeable and supportive personal assistant focused on sustainability and recycling practices. 
    Your role is to assist users with any questions they may have about recycling, reducing waste, eco-friendly 
    habits, and sustainable living. Offer guidance on best practices, suggest actionable steps to minimize 
    environmental impact, and provide information on recycling processes, waste management, and sustainable products. 
    Always respond in a friendly and encouraging tone, making users feel empowered and motivated to adopt 
    environmentally conscious habits. Be clear, give concise responses, and informative, directing users to helpful resources 
    when appropriate.`
;

// Controller function to handle chat requests
async function getChatResponse(req, res) {
    const { userPrompt } = req.body;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // Use the appropriate model name
            messages: messages
        });

        const responseContent = completion.choices[0].message.content;
        res.json({ response: responseContent });
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
}

module.exports = {
    getChatResponse
};
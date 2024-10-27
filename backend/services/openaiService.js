const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const validateActivityDescription = async (activityPrompt, imagePath) => {
    const imageBuffer = fs.readFileSync(imagePath);

    const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
            { role: 'system', content: 'You are an AI that checks if an image matches the description given.' },
            { role: 'user', content: `Does this image match the activity: ${activityPrompt}` },
        ],
        file: imageBuffer,
    });
    return response.data.choices[0].message.content;
};

module.exports = { validateActivityDescription };

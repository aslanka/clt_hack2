import OpenAI from "openai";
import fs from "fs";

// Initialize OpenAI instance
const openai = new OpenAI();

const validateActivityDescription = async (activityPrompt, imagePath) => {
    // Assuming image is hosted at an accessible URL; otherwise, upload and get URL
    const image_url = "https://example.com/path/to/your/image.jpg"; // Replace with actual hosted image URL

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // or your preferred model
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: `Does this image match the activity: ${activityPrompt}?` },
                    { type: "image_url", image_url: { url: image_url } }
                ],
            },
        ],
    });

    // Log the response
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
};

validateActivityDescription("A nature walk in a scenic area", "path/to/your/image.jpg");

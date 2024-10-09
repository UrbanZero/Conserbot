const { OpenAI } = require("openai");
require('dotenv').config();

// Set up the configuration with your API key
const openai = new OpenAI({
    apiKey: process.env.gpt
});

// Function to call GPT-4
const askGpt = async function (prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Eres Conserbot, un profesor de Desarrollo de Aplicaciones, da respuestas claras y concisas de menos de 1500 carácteres."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 400
        });

        const message = response.choices[0].message.content;
        return message
    } catch (error) {
        console.error("Error fetching response from GPT-4:", error);
        return "ERROR No se encontró respuesta"
    }
}

module.exports = askGpt;

// Example usage
//gptResponse(userPrompt);

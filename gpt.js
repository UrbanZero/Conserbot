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

// Function to call GPT-4
async function teacher(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: prompt
                }
            ],
        });

        const message = response.choices[0].message.content;
        console.log("GPT-4 Response:", message);
    } catch (error) {
        console.error("Error fetching response from GPT-4:", error);
    }
}

module.exports = askGpt;

// Example usage
//const userPrompt = "Qué es un div?";
//teacher("Eres un profesor de un grado Desarrollo de Aplicaciones que da respuestas tecnicas y claras.");
//gptResponse(userPrompt);

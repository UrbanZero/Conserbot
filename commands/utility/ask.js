const { SlashCommandBuilder } = require('discord.js');
const { pgClient } = require('../../utils/database');
const askGpt = require('../../gpt');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Pregunta lo que quieras a Conserbot!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('La pregunta que quieras hacerle')
                .setMinLength(1)
                .setMaxLength(200)
                .setRequired(true)),
    async execute(interaction) {
        const date = new Date()
        const now = date.toLocaleString('en-US', { timeZone: 'Europe/Madrid' });

        const selectQuery = `SELECT created_at FROM questions WHERE name = $1 ORDER BY created_at DESC LIMIT 1`;
        const consult = await pgClient.query(selectQuery, [interaction.user.username]);
        if (consult && consult.rows.length > 0) {
            const wait = consult.rows[0].created_at.getTime() + 20000 - now.getTime()
            if (wait > 0) {
                await tempMsg(`Tienes que esperar ${Math.ceil(wait / 1000)} segundos para preguntar de nuevo.`);
                return
            }
        }
        try {
            const insertQuery = `INSERT INTO questions (name, created_at) VALUES ($1, $2)`;
            const date = new Date()
            const now = date.toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
            await pgClient.query(insertQuery, [interaction.user.username, now]);
        } catch (error) {
            console.log(error)
            return interaction.reply(`ERROR AL AÑADIR A LA BASE DE DATOS.${error.name}`);
        }

        const question = interaction.options.get('question').value
        await interaction.deferReply();
        const answer = await askGpt(question)
        await interaction.editReply(`**Pregunta:** ${question}\n**Respuesta:**\n${answer}`);

        async function tempMsg(str) {
            await interaction.reply({
                content: str,
                ephemeral: true,
            });
        }
    },
};
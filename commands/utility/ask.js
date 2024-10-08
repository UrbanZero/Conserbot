const { SlashCommandBuilder } = require('discord.js');
const gptdb = require('../../models/gpt');
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
        const now = new Date()
        const user = await gptdb.findAll({
            limit: 1,
            where: { user: interaction.user.username },
            order: [['createdAt', 'ASC']],
        });
        if (user.length != 0) {
            const last = user[0].get("createdAt")
            const wait = last.getTime() + 20000 - now.getTime()
            if (wait > 0) {
                await tempMsg(`Tienes que esperar ${Math.ceil(wait / 1000)} segundos para preguntar de nuevo.`);
                return
            }
        }
        try {
            await gptdb.create({
                user: interaction.user.username
            });
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return interaction.reply('ERROR EN LA BASE DE DATOS.');
            }
            console.log(error)
            return interaction.reply(`ERROR AL AÑADIR A LA BASE DE DATOS.${error.name}`);
        }

        const question = interaction.options.get('question').value
        await interaction.deferReply();
        const answer = await askGpt(question)
        await interaction.editReply(`**Pregunta:**\n${question}\n\n**Respuesta:**\n${answer}`);

        async function tempMsg(str) {
            await interaction.reply({
                content: str,
                ephemeral: true,
            });
        }
    },
};
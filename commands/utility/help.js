const fs = require('fs');
const path = require('node:path');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lista de comandos.'),
    async execute(interaction) {
        let str = "__Lista de comandos:__\n"
        const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator)
        const foldersPath = path.join(__dirname, '..', '..', 'commands');
        const commandFolders = fs.readdirSync(foldersPath);
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                const adminCommand = command.data.default_member_permissions == PermissionFlagsBits.Administrator
                if (adminCommand) str += "**ADMIN** "
                if (!isAdmin && !adminCommand || isAdmin)
                    str += `**/${command.data.name}**: ${command.data.description}\n`;
            }
        }
        return interaction.reply({
            content: str,
            ephemeral: true,
        });
    }
};
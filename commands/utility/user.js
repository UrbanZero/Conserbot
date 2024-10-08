const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Información del usuario.'),
	async execute(interaction) {
		await interaction.reply(`Este comando ha sido ejecutado por ${interaction.user.username}, quien entró en ${interaction.member.joinedAt}.`);
	},
};
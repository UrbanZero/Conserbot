const { SlashCommandBuilder } = require('discord.js');
const { DAWid, DAMid } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Añade o elimina tu grado.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('get')
				.setDescription('añade')
				.addRoleOption(role =>
					role
						.setName('role')
						.setDescription('grado')
						.setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('elimina')
				.addRoleOption(role =>
					role
						.setName('role')
						.setDescription('grado')
						.setRequired(true))
		),
	async execute(interaction) {
		const roles = [{ "name": "DAW", "id": DAWid }, { "name": "DAM", "id": DAMid }]
		const role = interaction.options.getRole('role')
		if (!role) {
			await interaction.reply(`ERROR Rol no especificado`);
			return;
		}
		// DAW DAM roles
		if (!roles.some(r => r.id === role.id)) {
			await interaction.reply(`ERROR No tienes acceso a ese rol`);
			return;
		}
		// Get
		if (interaction.options.getSubcommand() === 'get') {
			if (interaction.member.roles.cache.some(r => r.id === role.id)) {
				await interaction.reply(`ERROR <@${interaction.user.id}> ya está estudiando **${role.name}**`);//<@&${role.id}>
			} else {
				// Remove other degree roles
				let extra = ""
				for (let i = 0; i < roles.length; i++) {
					const roleRem = roles[i];
					if (interaction.member.roles.cache.some(r => r.id === roleRem.id)) {
						interaction.member.roles.remove(role);
						extra = `<@${interaction.user.id}> dejó de estudiar **${roleRem.name}**\n`
					}
				}
				interaction.member.roles.add(role);
				await interaction.reply(`${extra}<@${interaction.user.id}> está estudiando **${role.name}**`);
			}
		}
		// Remove
		else if (interaction.options.getSubcommand() === 'remove') {
			if (interaction.member.roles.cache.some(r => r.id === role.id)) {
				interaction.member.roles.remove(role);
				await interaction.reply(`<@${interaction.user.id}> dejó de estudiar **${role.name}**`);
			} else {
				await interaction.reply(`ERROR <@${interaction.user.id}> no está estudiando **${role.name}**`);
			}
		}
	},
};

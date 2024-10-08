const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { subjects } = require('../../data.json');
const deadlines = require('../../models/deadlines');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deadline')
        .setDescription('deadlines de trabajos')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('añade')
                .addStringOption(option =>
                    option.setName('name')
                        .setRequired(true)
                        .setDescription('nombre de la deadline'))
                .addStringOption(option => {
                    option.setName('subject')
                        .setDescription('asignatura')
                        .setRequired(true)
                    for (let subject of subjects) {
                        option.addChoices({ name: subject.name, value: subject.id.toString() })
                    }
                    return option
                })
                .addStringOption(option =>
                    option.setName('date')
                        .setDescription('MM-dd HH:mm')
                        .setRequired(true))
        ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const name = interaction.options.get('name').value
        const id = Number(interaction.options.get('subject').value)
        const dateString = interaction.options.get('date').value
        const [dayMonth, hourMins] = dateString.split(' ')
        const [month, day] = dayMonth.split('-')
        const [hour, mins] = hourMins.split(':')
        const now = new Date();
        let year = now.getFullYear()
        //In case of next year
        if (month > now.getMonth()) {
            year = (Number(year) + 1).toString()
        }
        const then = new Date(year, month, day, hour, mins);
        let sub
        for (let i = 0; i < subjects.length; i++) {
            const s = subjects[i]; if (s.id == id) sub = s
        }
        if (interaction.options.getSubcommand() === 'add') {
            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                const deadline = await deadlines.create({
                    name: name,
                    subject: id,
                    date: then,
                });
                return interaction.reply(`Deadline ${deadline.name} de ${sub.name} añadida para el ${year + "-" + dateString}.`);
            }
            catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return interaction.reply('That deadline already exists.');
                }
                console.log(error)
                return interaction.reply(`Something went wrong with adding a deadline.${error.name}`);
            }
        }
    },
};
///deadline add name:Jeff subject:Bases de Datos date:08-10 8:00

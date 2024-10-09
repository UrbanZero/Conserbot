const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { subjects } = require('../../data.json');
const { pgClient } = require('../../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deadlines')
        .setDescription('deadlines de trabajos.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('see')
                .setDescription('ver'))
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
                        .setDescription('dd-MM HH:mm')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('eliminar')
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
        ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'see') {
            try {
                const selectQuery = `SELECT * FROM deadlines WHERE date > $1 ORDER BY date ASC`;
                const date = new Date()
                const now = date.toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
                const selectResult = await pgClient.query(selectQuery, [now]);
                let str = "__Deadlines:__\n"
                for (let i = 0; i < selectResult.rows.length; i++) {
                    const row = selectResult.rows[i];
                    str += `**${row.name}** de ${subjects.filter((s) => s.id == row.subject)[0].name} el ${row.date.getMonth() + 1}/${row.date.getDate()} a las ${row.date.getHours()}:${row.date.getMinutes()}\n`
                }
                if (selectResult.rows.length == 0) {
                    str += `No hay deadlines en curso.`
                }
                return interaction.reply(str);
            } catch (error) {
                console.log(error)
                return interaction.reply(`ERROR En la base de datos.${error.name}`);
            }
        }
        else if (interaction.options.getSubcommand() === 'add') {
            const name = interaction.options.get('name').value
            const id = Number(interaction.options.get('subject').value)
            const dateString = interaction.options.get('date').value
            const [dayMonth, hourMins] = dateString.split(' ')
            let [day, month] = dayMonth.split('-')
            const [hour, mins] = hourMins.split(':')
            month -= 1
            if (month > 12) return interaction.reply(`ERROR Mes mayor a 12.`);
            if (day > 31) return interaction.reply(`ERROR Dias mayores a 31.`);
            if (hour > 23) return interaction.reply(`ERROR Horas mayores a 23.`);
            if (mins > 59) return interaction.reply(`ERROR Minutos mayores a 59.`);
            const date = new Date()
            const now = date.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }); 
            let year = now.getFullYear()
            //In case of next year
            if (month < now.getMonth()) {
                year = (Number(year) + 1).toString()
            }
            console.log(year)
            const date2 = new Date(year, month, day, hour, mins);
            const then = date2.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }); 
            let sub
            for (let i = 0; i < subjects.length; i++) {
                const s = subjects[i]; if (s.id == id) sub = s
            }
            try {
                const selectQuery = `SELECT * FROM deadlines WHERE name = $1 AND subject = $2 AND date > $3`;
                const date = new Date()
                const now = date.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }); 
                const duplicated = await pgClient.query(selectQuery, [name, id, now]);
                console.log(duplicated.rows)
                if (duplicated.rows.length != 0) {
                    return interaction.reply(`${sub.name} ya tiene una deadline con el nombre ${name}.`);
                }
                const insertQuery = `INSERT INTO deadlines (name, subject, date, created_at) VALUES ($1, $2, $3, $4)`;
                await pgClient.query(insertQuery, [name, id, then, now]);
                return interaction.reply(`Deadline ${name} de ${sub.name} añadida para el ${year}-${dateString}.`);
            } catch (error) {
                console.log(error)
                return interaction.reply(`ERROR En la base de datos.${error.name}`);
            }
        }
        else if (interaction.options.getSubcommand() === 'remove') {
            const name = interaction.options.get('name').value
            const id = Number(interaction.options.get('subject').value)
            let sub
            for (let i = 0; i < subjects.length; i++) {
                const s = subjects[i]; if (s.id == id) sub = s
            }
            try {
                const deleteQuery = `DELETE FROM deadlines WHERE name = $1 AND subject = $2 AND date > $3`;
                const date = new Date(year, month, day, hour, mins);
                const now = date.toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
                await pgClient.query(deleteQuery, [name, id, now]);
                return interaction.reply(`Deadline ${name} de ${sub.name} eliminada.`);
            } catch (error) {
                console.log(error)
                return interaction.reply(`ERROR En la base de datos.${error.name}`);
            }
        }
    },
};
///deadline add name:Jeff subject:Bases de Datos date:08-10 8:00

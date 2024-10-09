const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { subjects } = require('../../data.json');
const { pgClient } = require('../../utils/database');
const { setTimezone } = require('../../utils/timezone');

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
        ),//.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'see') {
            const roles = [{ "id": 0, "name": "DAW", "role_id": process.env.DAWid }, { "id": 1, "name": "DAM", "role_id": process.env.DAMid }]
            for (let j = 0; j < roles.length; j++) {
                const role = roles[j]
                //If is users role
                if (interaction.member.roles.cache.some(r => r.id === role.role_id)) {
                    try {
                        const selectQuery = `SELECT * FROM deadlines WHERE date > $1 AND role_id = $2 ORDER BY date ASC`;
                        const selectResult = await pgClient.query(selectQuery, [setTimezone(new Date()), role.id]);
                        let str = `__Deadlines de **${role.name}**:__\n`
                        for (let i = 0; i < selectResult.rows.length; i++) {
                            const row = selectResult.rows[i];
                            str += `**${row.name}** de ${subjects.filter((s) => s.id == row.subject_id)[0].name} el ${row.date.getMonth() + 1}/${row.date.getDate()} a las ${row.date.getHours()}:${row.date.getMinutes()}\n`
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
            }
        }
        //ADD
        else if (interaction.options.getSubcommand() === 'add') {
            const roles = [{ "id": 0, "name": "DAW", "role_id": process.env.DAWid }, { "id": 1, "name": "DAM", "role_id": process.env.DAMid }]
            for (let j = 0; j < roles.length; j++) {
                const role = roles[j]
                //If is users role
                if (interaction.member.roles.cache.some(r => r.id === role.role_id)) {

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
                    const now = setTimezone(new Date());
                    let year = now.getFullYear()
                    //In case of next year
                    if (month < now.getMonth()) year = (Number(year) + 1).toString()
                    const then = new Date(year, month, day, hour, mins);
                    let sub
                    for (let i = 0; i < subjects.length; i++) { const s = subjects[i]; if (s.id == id) sub = s }
                    try {
                        const selectQuery = `SELECT * FROM deadlines WHERE name = $1 AND subject_id = $2 AND role_id = $3 AND date > $4`;
                        const duplicated = await pgClient.query(selectQuery, [name, id, role.id, setTimezone(new Date())]);
                        console.log(duplicated.rows)
                        if (duplicated.rows.length != 0) {
                            return interaction.reply(`${sub.name} ya tiene una deadline con el nombre ${name}.`);
                        }
                        const insertQuery = `INSERT INTO deadlines (name, subject_id, role_id, date, created_at) VALUES ($1, $2, $3, $4, $5)`;
                        await pgClient.query(insertQuery, [name, id, role.id, then, setTimezone(new Date())]);
                        return interaction.reply(`Deadline ${name} de ${sub.name} añadida para el ${year}-${dateString}.`);
                    } catch (error) {
                        console.log(error)
                        return interaction.reply(`ERROR En la base de datos.${error.name}`);
                    }
                }
            }
        }
        else if (interaction.options.getSubcommand() === 'remove') {
            const roles = [{ "id": 0, "name": "DAW", "role_id": process.env.DAWid }, { "id": 1, "name": "DAM", "role_id": process.env.DAMid }]
            for (let j = 0; j < roles.length; j++) {
                const role = roles[j]
                //If is users role
                if (interaction.member.roles.cache.some(r => r.id === role.role_id)) {
                    const name = interaction.options.get('name').value
                    const id = Number(interaction.options.get('subject').value)
                    let sub
                    for (let i = 0; i < subjects.length; i++) {
                        const s = subjects[i]; if (s.id == id) sub = s
                    }
                    try {
                        const deleteQuery = `DELETE FROM deadlines WHERE name = $1 AND subject_id = $2 AND role_id = $3 AND date > $4`;
                        await pgClient.query(deleteQuery, [name, id, role.id, setTimezone(new Date())]);
                        return interaction.reply(`Deadline ${name} de ${sub.name} eliminada.`);
                    } catch (error) {
                        console.log(error)
                        return interaction.reply(`ERROR En la base de datos.${error.name}`);
                    }
                }
            }
        }
    },
};
///deadline add name:Jeff subject:Bases de Datos date:08-10 8:00

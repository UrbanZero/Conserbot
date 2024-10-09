const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const { subjects, classes } = require('../../data.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('class')
        .setDescription('Devuelve tu clase actual o próxima en base a tu rol de grado.'),
    async execute(interaction) {
        const roles = [{ "name": "DAW", "id": process.env.DAWid }, { "name": "DAM", "id": process.env.DAMid }]
        const date = new Date()
        const now = date.toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        let nextClass = null;

        for (let j = 0; j < roles.length; j++) {
            const degree = roles[j]
            if (interaction.member.roles.cache.some(r => r.id === degree.id)) {
                //Temporal
                if (degree.name == "DAM") {
                    await tempMsg(`El dueño de este bot no tiene las url meet de DAM, habla con <@${process.env.author}> para que las añada.`);
                    return
                }
                for (let i = 0; i < classes.length; i++) {
                    const _class = classes[i];
                    //If not your degree
                    if (_class.role != degree.name) continue
                    const start = parseTime(_class.from, _class.day, now);
                    const end = parseTime(_class.to, _class.day, now);
                    if (now >= start && now <= end) {
                        // Class is ongoing
                        await tempMsg(`Clase de **${getSubjectName(_class.subject)} de ${degree.name} en curso** desde las ${_class.from}!\nMeet: ${_class.url} `);
                        return;
                    }
                    if (now < start && (!nextClass || start < nextClass.start)) {
                        // Set next class if it's earlier than the previously found next class
                        nextClass = { start, _class, degree };
                    }
                }
            }
        };
        // If no class is found today, check the next class in upcoming days
        if (nextClass) {
            const diff = nextClass.start - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var dayName = dayNames[nextClass._class.day];
            console.log(diff)
            console.log(days)
            console.log(hours)
            console.log(minutes)
            if (hours == 0) {
                await tempMsg(`La proxima clase de **${nextClass.degree.name}** es **${getSubjectName(nextClass._class.subject)}** y empeiza en **${minutes} minutos** el **${dayName}** a las **${nextClass._class.from}**\nMeet: ${nextClass._class.url} `);
                return
            }
            if (days == 0) {
                await tempMsg(`La proxima clase de **${nextClass.degree.name}** es **${getSubjectName(nextClass._class.subject)}** y empeiza en ${hours} horas y ${minutes} minutos el **${dayName}** a las **${nextClass._class.from}**\nMeet: ${nextClass._class.url} `);
                return
            }
            await tempMsg(`La proxima clase de **${nextClass.degree.name}** es **${getSubjectName(nextClass._class.subject)}** y empeiza en ${days} días, ${hours} horas y ${minutes} minutos el **${dayName}** a las **${nextClass._class.from}**\nMeet: ${nextClass._class.url} `);
        } else {
            await tempMsg(`Parece que aun no tienes roles, escribe **/role get *@role*** para obtenerlos!`);
        }

        // Helper function to parse time strings into Date objects
        function parseTime(timeString, classDay, now1) {
            const [hours, minutes] = timeString.split(':').map(Number);
            const date = new Date(now1)
            const now = date.toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
            // Calculate the difference in days, ensuring no extra days are added
            let diffDays = classDay - now.getDay();
            if (diffDays < 0) {
                diffDays += 7; // Wrap around if the class day is earlier in the week
            }

            // Set the date to the correct class day and time
            date.setDate(now.getDate() + diffDays);
            date.setHours(hours, minutes, 0, 0);

            return date;
        }
        function getSubjectName(id) {
            for (let i = 0; i < subjects.length; i++) {
                const s = subjects[i]; if (s.id == id) return s.name
            }
        }
        async function tempMsg(str) {
            await interaction.reply({
                content: str,
                ephemeral: true,
            });
        }
    }
};

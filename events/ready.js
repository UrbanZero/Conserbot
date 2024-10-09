const { Events } = require('discord.js');
const { pgClient } = require('../utils/database');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        pgClient.connect().then(() => {
            console.log('Connected to PostgreSQL');
        }).catch(err => console.error('Error connecting to PostgreSQL:', err));

        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
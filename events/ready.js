const { Events } = require('discord.js');
const deadlines = require('../models/deadlines');
const gptdb = require('../models/gpt');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        deadlines.sync({ force: true });//force/alter
        gptdb.sync({ force: true });//force/alter
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
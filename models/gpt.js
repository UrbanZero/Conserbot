const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const gptdb = sequelize.define('gpt', {
    user: Sequelize.STRING
});

module.exports = gptdb;
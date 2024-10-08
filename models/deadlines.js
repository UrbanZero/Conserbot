const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const deadlines = sequelize.define('deadlines', {
    name: Sequelize.STRING,
    subject: Sequelize.NUMBER,
    date: Sequelize.DATE
});

module.exports = deadlines;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guild = sequelize.define('Guild', {
    discordGuildId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Guild;

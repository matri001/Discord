
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GuildConfig = sequelize.define('GuildConfig', {
    guildId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },

    language: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'vi'
    },

    aiEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

module.exports = GuildConfig;

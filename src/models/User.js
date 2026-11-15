
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    discordUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false
    },

    globalName: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = User;

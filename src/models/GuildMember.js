
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GuildMember = sequelize.define('GuildMember', {
    guildId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    joinedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['guildId', 'userId']
        }
    ]
});

module.exports = GuildMember;


const sequelize = require('../config/database');

const Guild = require('./Guild');
const GuildConfig = require('./GuildConfig');
const User = require('./User');
const GuildMember = require('./GuildMember');

// Guild 1 - 1 GuildConfig
Guild.hasOne(GuildConfig, {
    foreignKey: 'guildId',
    onDelete: 'CASCADE'
});

GuildConfig.belongsTo(Guild, {
    foreignKey: 'guildId'
});

// Guild N - N User thông qua GuildMember
Guild.belongsToMany(User, {
    through: GuildMember,
    foreignKey: 'guildId',
    otherKey: 'userId'
});

User.belongsToMany(Guild, {
    through: GuildMember,
    foreignKey: 'userId',
    otherKey: 'guildId'
});

// Guild 1 - N GuildMember
Guild.hasMany(GuildMember, {
    foreignKey: 'guildId'
});

GuildMember.belongsTo(Guild, {
    foreignKey: 'guildId'
});

// User 1 - N GuildMember
User.hasMany(GuildMember, {
    foreignKey: 'userId'
});

GuildMember.belongsTo(User, {
    foreignKey: 'userId'
});

module.exports = {
    sequelize,
    Guild,
    GuildConfig,
    User,
    GuildMember
};

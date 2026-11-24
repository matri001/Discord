
const { Guild, GuildConfig } = require('../models');

const DEFAULT_CONFIG = {
    language: 'vi',
    aiEnabled: true
};

// Lấy cấu hình của server
async function getConfig(discordGuildId) {
    const guild = await Guild.findOne({
        where: { discordGuildId }
    });

    if (!guild) {
        throw new Error(`Guild not found: ${discordGuildId}`);
    }

    const [config] = await GuildConfig.findOrCreate({
        where: { guildId: guild.id },
        defaults: {
            guildId: guild.id,
            ...DEFAULT_CONFIG
        }
    });

    return config;
}

// Cập nhật cấu hình server
async function updateConfig(discordGuildId, data) {
    const guild = await Guild.findOne({
        where: { discordGuildId }
    });

    if (!guild) {
        throw new Error(`Guild not found: ${discordGuildId}`);
    }

    const [config] = await GuildConfig.findOrCreate({
        where: { guildId: guild.id },
        defaults: {
            guildId: guild.id,
            ...DEFAULT_CONFIG
        }
    });

    const allowedFields = ['language', 'aiEnabled'];
    const updates = {};

    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(data, field)) {
            updates[field] = data[field];
        }
    }

    await config.update(updates);

    return config;
}

// Kiểm tra AI có được bật không
async function isAIEnabled(discordGuildId) {
    const config = await getConfig(discordGuildId);
    return config.aiEnabled;
}

module.exports = {
    getConfig,
    updateConfig,
    isAIEnabled
};

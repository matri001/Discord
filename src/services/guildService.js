
const {
    sequelize,
    Guild,
    GuildConfig,
    User,
    GuildMember
} = require('../models');

async function ensureGuild(guild) {
    return sequelize.transaction(async (transaction) => {
        // Tìm hoặc tạo Discord Server
        const [guildRecord] = await Guild.findOrCreate({
            where: {
                discordGuildId: guild.id
            },
            defaults: {
                discordGuildId: guild.id,
                name: guild.name
            },
            transaction
        });

        // Cập nhật tên nếu Server đổi tên
        if (guildRecord.name !== guild.name) {
            await guildRecord.update(
                { name: guild.name },
                { transaction }
            );
        }

        // Tạo cấu hình mặc định nếu chưa tồn tại
        const [config] = await GuildConfig.findOrCreate({
            where: {
                guildId: guildRecord.id
            },
            defaults: {
                guildId: guildRecord.id,
                language: 'vi',
                aiEnabled: true
            },
            transaction
        });

        return {
            guild: guildRecord,
            config
        };
    });
}

async function ensureGuildMember(guild, discordUser, joinedAt = null) {
    return sequelize.transaction(async (transaction) => {
        // Đảm bảo Guild và GuildConfig tồn tại
        const [guildRecord] = await Guild.findOrCreate({
            where: {
                discordGuildId: guild.id
            },
            defaults: {
                discordGuildId: guild.id,
                name: guild.name
            },
            transaction
        });

        await GuildConfig.findOrCreate({
            where: {
                guildId: guildRecord.id
            },
            defaults: {
                guildId: guildRecord.id,
                language: 'vi',
                aiEnabled: true
            },
            transaction
        });

        // Tìm hoặc tạo User
        const [userRecord] = await User.findOrCreate({
            where: {
                discordUserId: discordUser.id
            },
            defaults: {
                discordUserId: discordUser.id,
                username: discordUser.username,
                globalName: discordUser.globalName
            },
            transaction
        });

        // Đồng bộ thông tin User mới nhất
        await userRecord.update({
            username: discordUser.username,
            globalName: discordUser.globalName
        }, { transaction });

        // Tạo quan hệ Guild - User nếu chưa tồn tại
        await GuildMember.findOrCreate({
            where: {
                guildId: guildRecord.id,
                userId: userRecord.id
            },
            defaults: {
                guildId: guildRecord.id,
                userId: userRecord.id,
                joinedAt
            },
            transaction
        });

        return {
            guild: guildRecord,
            user: userRecord
        };
    });
}

module.exports = {
    ensureGuild,
    ensureGuildMember
};


const {
    sequelize,
    Guild,
    GuildConfig,
    User,
    GuildMember
} = require('../models');

// Kiểm tra server đã tồn tại chưa, nếu chưa thì tạo mới
async function ensureGuild(guild) {
    return sequelize.transaction(async (transaction) => {
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

        // Cập nhật tên server nếu có thay đổi
        if (guildRecord.name !== guild.name) {
            await guildRecord.update(
                { name: guild.name },
                { transaction }
            );
        }

        // Tạo cấu hình mặc định cho server
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

// Đảm bảo server và thành viên đã được lưu
async function ensureGuildMember(guild, discordUser, joinedAt = null) {
    return sequelize.transaction(async (transaction) => {
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

        // Đồng bộ tên người dùng mới nhất
        await userRecord.update({
            username: discordUser.username,
            globalName: discordUser.globalName
        }, { transaction });

        // Lưu quan hệ thành viên - server
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
